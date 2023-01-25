import _ from 'lodash';
import path from 'path';
import fse from 'fs-extra';
import {
    Asset,
    Assets,
    ContentChangeEvent,
    ContentSourceInterface,
    Document,
    DocumentField,
    DocumentListFieldItems,
    Field,
    FieldListItems,
    FieldObjectProps,
    FieldSpecificProps,
    InitOptions,
    Locale,
    Logger,
    Model,
    ModelMap,
    UpdateOperation,
    UpdateOperationField,
    ValidationError
} from '@stackbit/types';
import { utils } from '@stackbit/cms-core';
import artisanalName from '@stackbit/artisanal-names';
import slugify from 'slugify';
import axios from 'axios';
import { Readable } from 'stream';

const MARKDOWN_FILE_EXTENSIONS = ['md', 'mdx', 'markdown'];

export class FileSystemContentSource implements ContentSourceInterface {
    private rootDir: string;
    private contentDir: string;
    private models: Model[];
    private assets: Assets;
    private logger?: Logger;
    private getModelMap?: () => ModelMap;

    constructor(options: { rootDir: string; contentDir: string; models: Model[]; assets: Assets }) {
        this.rootDir = options.rootDir;
        this.contentDir = options.contentDir;
        this.models = options.models;
        this.assets = options.assets;
    }

    getContentSourceType(): string {
        return 'fs';
    }

    getProjectId(): string {
        return this.contentDir;
    }

    getProjectEnvironment(): string {
        return '';
    }

    getProjectManageUrl(): string {
        return '';
    }

    async init(options: InitOptions): Promise<void> {
        this.logger = options.logger;
    }

    async reset(): Promise<void> {}

    async onFilesChange?({
        updatedFiles
    }: {
        updatedFiles: string[];
    }): Promise<{ schemaChanged?: boolean | undefined; contentChangeEvent?: ContentChangeEvent<unknown, unknown> | undefined }> {
        const modelMap = this.getModelMap?.();
        if (!modelMap) {
            return {};
        }

        const documents: Document[] = [];
        const deletedDocumentIds: string[] = [];
        const contentFiles = updatedFiles.filter((updatedFile) => updatedFile.startsWith(this.contentDir));

        for (const contentFile of contentFiles) {
            const filePath = path.join(this.rootDir, contentFile);
            if (!(await fse.pathExists(filePath))) {
                deletedDocumentIds.push(contentFile);
                continue;
            }
            let data;
            try {
                data = await getFileData(filePath);
            } catch (err) {
                this.logger?.warn('Error loading file ' + filePath, err);
                continue;
            }
            const document = await convertDocument(contentFile, filePath, data, modelMap);
            if (!document) {
                this.logger?.warn('Error converting file ' + filePath);
                continue;
            }
            documents.push(document);
        }

        const assets: Asset[] = [];
        const deletedAssetIds: string[] = [];
        const assetsDir = this.assets.referenceType === 'static' ? this.assets.staticDir : this.assets.assetsDir ?? this.assets.staticDir;
        const assetFiles = updatedFiles.filter((updatedFile) => updatedFile.startsWith(assetsDir));
        for (const assetFile of assetFiles) {
            const filePath = path.join(this.rootDir, assetFile);
            if (!(await fse.pathExists(filePath))) {
                deletedAssetIds.push(assetFile);
                continue;
            }
            const asset = await convertAsset(assetFile, filePath, this.assets.publicPath);
            assets.push(asset);
        }

        return {
            schemaChanged: false, //TODO
            contentChangeEvent: {
                documents,
                assets,
                deletedDocumentIds,
                deletedAssetIds
            }
        };
    }

    startWatchingContentUpdates(options: {
        getModelMap: () => ModelMap;
        getDocument: ({ documentId }: { documentId: string }) => Document<unknown> | undefined;
        getAsset: ({ assetId }: { assetId: string }) => Asset<unknown> | undefined;
        onContentChange: (contentChangeEvent: ContentChangeEvent<unknown, unknown>) => Promise<void>;
        onSchemaChange: () => void;
    }): void {
        this.getModelMap = options.getModelMap;
    }

    stopWatchingContentUpdates(): void {}

    async getModels(): Promise<Model[]> {
        return this.models;
    }

    async getLocales(): Promise<Locale[]> {
        return [];
    }

    async getDocuments(options: { modelMap: ModelMap }): Promise<Document[]> {
        const contentDirPath = path.join(this.rootDir, this.contentDir);
        const filePaths = await utils.readDirRec(contentDirPath, {});
        const documents: Document[] = [];
        for (const filePath of filePaths) {
            const fullFilePath = path.join(contentDirPath, filePath);
            let data;
            try {
                data = await getFileData(fullFilePath);
            } catch (err) {
                this.logger?.warn('Error loading file ' + filePath, err);
                continue;
            }
            const document = await convertDocument(path.relative(contentDirPath, fullFilePath), fullFilePath, data, options.modelMap);
            if (!document) {
                this.logger?.warn('Error converting file ' + filePath);
                continue;
            }
            documents.push(document);
        }
        return documents;
    }

    async getAssets(): Promise<Asset[]> {
        const assetsDir = path.join(
            this.rootDir,
            this.assets.referenceType === 'static' ? this.assets.staticDir : this.assets.assetsDir ?? this.assets.staticDir
        );
        const filePaths = await utils.readDirRec(assetsDir, {});
        const assets: Asset[] = [];
        for (const filePath of filePaths) {
            const fullFilePath = path.join(assetsDir, filePath);
            assets.push({
                type: 'asset',
                id: filePath,
                context: {},
                ...(await getFileDates(fullFilePath)),
                manageUrl: '',
                status: 'published',
                fields: {
                    file: {
                        dimensions: {},
                        type: 'assetFile',
                        url: (this.assets.publicPath ?? '') + filePath,
                        fileName: filePath
                    },
                    title: {
                        type: 'string',
                        value: path.basename(filePath)
                    }
                }
            });
        }
        return assets;
    }

    async hasAccess(options: { userContext?: unknown }): Promise<{ hasConnection: boolean; hasPermissions: boolean }> {
        return {
            hasConnection: true,
            hasPermissions: true
        };
    }

    async createDocument(options: {
        updateOperationFields: Record<string, UpdateOperationField>;
        model: Model;
        modelMap: ModelMap;
        locale?: string | undefined;
        defaultLocaleDocumentId?: string | undefined;
        userContext?: unknown;
    }): Promise<Document> {
        const { model, modelMap } = options;
        let slugValue;
        const data: any = {
            type: model.name
        };
        for (const fieldName in options.updateOperationFields) {
            const updateOperationField = options.updateOperationFields[fieldName];
            const modelField = _.find(model.fields, (field: Field) => field.name === fieldName);
            if (!modelField) {
                continue;
            }
            const value = mapUpdateOperationToValue(updateOperationField, modelMap, modelField);
            if (modelField?.type === 'slug') {
                slugValue = value;
            }
            data[fieldName] = value;
        }
        if (_.isEmpty(slugValue) || !_.isString(slugValue)) {
            slugValue = artisanalName.generate();
        }
        const slugTemplate = ((model.type === 'page' || model.type === 'data') && model.filePath) || '{slug}.json';
        const filePath = slugTemplate.replace('{slug}', sanitizeSlug(slugValue));
        const fullFilePath = path.join(this.rootDir, this.contentDir, filePath);
        await fse.ensureDir(path.dirname(fullFilePath));
        await saveFileData(fullFilePath, data);

        const document = await convertDocument(path.join(this.contentDir, filePath), fullFilePath, data, modelMap);
        console.log(data);
        if (!document) {
            throw new Error('Error converting document');
        }
        return document;
    }

    async updateDocument(options: { document: Document; operations: UpdateOperation[]; modelMap: ModelMap; userContext?: unknown }): Promise<Document> {
        const { document } = options;
        const filePath = path.join(this.rootDir, this.contentDir, document.id);
        const data = await getFileData(filePath);
        for (const updateOperation of options.operations) {
            applyUpdateOp(updateOperation, data, options.modelMap);
        }
        await saveFileData(filePath, data);
        return (await convertDocument(document.id, filePath, data, options.modelMap)) || document;
    }

    async deleteDocument(options: { document: Document; userContext?: unknown }): Promise<void> {
        const { document } = options;
        const filePath = path.join(this.rootDir, this.contentDir, document.id);
        await fse.unlink(filePath);
    }

    async uploadAsset(options: {
        url?: string | undefined;
        base64?: string | undefined;
        fileName: string;
        mimeType: string;
        locale?: string | undefined;
        userContext?: unknown;
    }): Promise<Asset<unknown>> {
        const { url, base64, fileName } = options;
        const assetsDir = path.join(
            this.rootDir,
            this.assets.referenceType === 'static' ? this.assets.staticDir : this.assets.assetsDir ?? this.assets.staticDir
        );
        const uploadFileName = path.join(assetsDir, this.assets.uploadDir ?? '', fileName);

        let readStream: Readable | null = null;
        if (base64) {
            const buffer = Buffer.from(base64, 'base64');
            readStream = Readable.from(buffer);
        } else if (url) {
            const response = await axios({
                responseType: 'stream',
                url
            });
            readStream = response.data;
        }
        if (readStream) {
            await fse.ensureDir(path.dirname(uploadFileName));
            const writeStream = fse.createWriteStream(uploadFileName);
            readStream.pipe(writeStream);
            await new Promise((resolve, reject) => {
                writeStream.on('error', reject).on('finish', resolve);
            });
        } else {
            throw new Error('No upload data found for asset');
        }

        return await convertAsset(fileName, uploadFileName, this.assets.publicPath);
    }

    async validateDocuments(options: {
        documents: Document<unknown>[];
        assets: Asset<unknown>[];
        locale?: string | undefined;
        userContext?: unknown;
    }): Promise<{ errors: ValidationError[] }> {
        return {
            errors: []
        };
    }

    async publishDocuments(options: { documents: Document<unknown>[]; assets: Asset<unknown>[]; userContext?: unknown }): Promise<void> {
        //TODO
        // throw new Error('Method not implemented.');
    }
}

async function convertAsset(filePath: string, fullFilePath: string, publicPath?: string): Promise<Asset> {
    return {
        type: 'asset',
        id: filePath,
        context: {},
        ...(await getFileDates(fullFilePath)),
        manageUrl: '',
        status: 'published',
        fields: {
            file: {
                dimensions: {},
                type: 'assetFile',
                url: (publicPath ?? '') + filePath,
                fileName: filePath
            },
            title: {
                type: 'string',
                value: path.basename(filePath)
            }
        }
    };
}

async function convertDocument(filePath: string, fullFilePath: string, data: any, modelMap: ModelMap): Promise<Document | null> {
    const { id, type, ...fields } = data;
    const model = modelMap[type];
    if (!model) {
        return null;
    }
    const documentFields = convertFields(fields, model.fields ?? [], modelMap);
    return {
        type: 'document',
        id: filePath,
        modelName: model.name,
        manageUrl: '',
        status: 'published',
        context: {},
        ...(await getFileDates(fullFilePath)),
        fields: documentFields
    };
}

function convertFields(dataFields: Record<string, any>, modelFields: Field[], modelMap: ModelMap): Record<string, DocumentField> {
    const result: Record<string, DocumentField> = {};
    for (const [fieldName, fieldValue] of Object.entries(dataFields)) {
        const modelField = (modelFields ?? []).find((modelField: Field) => modelField.name === fieldName);
        if (!modelField || !fieldValue) {
            continue;
        }
        const documentField = convertFieldType(fieldValue, modelField, modelMap);
        if (documentField) {
            result[fieldName] = documentField;
        }
    }
    return result;
}

function convertFieldType(fieldValue: any, modelField: Field | FieldSpecificProps, modelMap: ModelMap): DocumentField | null {
    switch (modelField.type) {
        case 'string':
        case 'slug':
        case 'text':
        case 'html':
        case 'url':
        case 'boolean':
        case 'number':
        case 'date':
        case 'datetime':
        case 'enum':
        case 'json':
        case 'style':
        case 'color':
        case 'markdown':
            return {
                value: fieldValue,
                type: modelField.type
            } as DocumentField;
        case 'list':
            const itemsModel = modelField.items ?? { type: 'string' };
            const items: DocumentListFieldItems[] = [];
            for (const item of fieldValue) {
                const documentField = convertFieldType(item, itemsModel, modelMap) as DocumentListFieldItems;
                if (documentField) {
                    items.push(documentField);
                }
            }
            return {
                type: 'list',
                items
            };
        case 'object':
            return {
                type: 'object',
                fields: convertFields(fieldValue, modelField.fields, modelMap)
            };
        case 'model':
            const { id, type, ...fields } = fieldValue;
            const modelType = type ?? modelField.models?.[0];
            const model = modelMap[modelType];
            if (!model) {
                console.error('No model for type: ' + modelType, fieldValue); //TODO
                return null;
            }
            return {
                type: 'model',
                modelName: model.name,
                fields: convertFields(fields, model.fields ?? [], modelMap)
            };
        case 'reference':
            return {
                type: 'reference',
                refType: 'document',
                refId: fieldValue
            };
        case 'image':
            return {
                type: 'image',
                fields: {
                    title: {
                        type: 'string',
                        value: path.parse(fieldValue).name
                    },
                    url: {
                        type: 'string',
                        value: fieldValue
                    }
                }
            };
        // TODO file, richText ???
        default:
            throw new Error('Unsupported type: ' + modelField.type);
    }
}

function mapUpdateOperationToValue(updateOperationField: UpdateOperationField, modelMap: ModelMap, modelField?: FieldSpecificProps): any {
    switch (updateOperationField.type) {
        case 'object':
            const object = {};
            _.forEach(updateOperationField.fields, (childUpdateOperationField, fieldName) => {
                const childModelField = _.find((modelField as FieldObjectProps).fields, (field) => field.name === fieldName);
                const value = mapUpdateOperationToValue(childUpdateOperationField, modelMap, childModelField);
                _.set(result, fieldName, value);
            });
            return object;
        case 'model':
            const modelName = updateOperationField.modelName;
            const childModel = modelMap[modelName];
            const result = {
                type: modelName
            };
            _.forEach(updateOperationField.fields, (updateOperationField, fieldName) => {
                const childModelField = _.find(childModel?.fields, (field) => field.name === fieldName);
                const value = mapUpdateOperationToValue(updateOperationField, modelMap, childModelField);
                _.set(result, fieldName, value);
            });
            return result;
        case 'list':
            const listItemsModel = modelField?.type === 'list' && modelField.items;
            return updateOperationField.items.map((item) => {
                let listItemModelField: FieldListItems | undefined;
                if (_.isArray(listItemsModel)) {
                    listItemModelField = (listItemsModel as FieldListItems[]).find((listItemsModel) => listItemsModel.type === item.type);
                } else if (listItemsModel) {
                    listItemModelField = listItemsModel;
                }
                return mapUpdateOperationToValue(item, modelMap, listItemModelField);
            });
        case 'reference':
            return updateOperationField.refId;
        default:
            return updateOperationField.value;
    }
}

async function getFileDates(filePath: string): Promise<{ createdAt: string; updatedAt: string }> {
    let fileStats: fse.Stats | null = null;
    try {
        fileStats = await fse.stat(filePath);
    } catch (err) {}
    return {
        createdAt: (fileStats?.birthtime ?? new Date()).toISOString(),
        updatedAt: (fileStats?.mtime ?? new Date()).toISOString()
    };
}

async function getFileData(filePath: string) {
    const extension = path.extname(filePath).substring(1);
    let data = await utils.parseFile(filePath);
    if (MARKDOWN_FILE_EXTENSIONS.includes(extension) && _.has(data, 'frontmatter') && _.has(data, 'markdown')) {
        data = data.frontmatter;
    }
    return data;
}

async function saveFileData(filePath: string, data: any) {
    let dataToWrite = data;
    const extension = path.extname(filePath).substring(1);
    if (MARKDOWN_FILE_EXTENSIONS.includes(extension)) {
        const existingData = (await fse.pathExists(filePath)) ? await utils.parseFile(filePath) : {};
        dataToWrite = {
            ...existingData,
            frontmatter: data
        };
    }
    return utils.outputDataIfNeeded(filePath, dataToWrite);
}

function applyUpdateOp(updateOperation: UpdateOperation, data: any, modelMap: ModelMap) {
    switch (updateOperation.opType) {
        case 'set': {
            const { field, fieldPath, modelField } = updateOperation;
            const value = mapUpdateOperationToValue(field, modelMap, modelField);
            _.set(data, fieldPath, value);
            break;
        }
        case 'unset': {
            const { fieldPath } = updateOperation;
            _.unset(data, fieldPath);
            break;
        }
        case 'insert': {
            const { item, fieldPath, modelField, index } = updateOperation;
            const value = mapUpdateOperationToValue(item, modelMap, modelField);
            const arr = [..._.get(data, fieldPath)];
            arr.splice(index ?? 0, 0, value);
            _.set(data, fieldPath, arr);
            break;
        }
        case 'remove': {
            const { fieldPath, index } = updateOperation;
            const arr = [..._.get(data, fieldPath)];
            arr.splice(index, 1);
            _.set(data, fieldPath, arr);
            break;
        }
        case 'reorder': {
            const { fieldPath, order } = updateOperation;
            const arr = [..._.get(data, fieldPath)];
            const newArr = order.map((newIndex) => arr[newIndex]);
            _.set(data, fieldPath, newArr);
            break;
        }
    }
    return data;
}

function sanitizeSlug(slug: string) {
    return slug
        .split('/')
        .map((part) => slugify(part, { lower: true }))
        .join('/');
}
