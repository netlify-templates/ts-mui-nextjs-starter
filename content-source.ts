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
const { utils } = require('@stackbit/cms-core');

const MARKDOWN_FILE_EXTENSIONS = ['md', 'mdx', 'markdown'];

export class FileSystemContentSource implements ContentSourceInterface {
    private rootDir: string;
    private contentDir: string;
    private models: Model[];
    private assets: Assets;
    private logger?: Logger;

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
        return {};
    }

    startWatchingContentUpdates(options: {
        getModelMap: () => ModelMap;
        getDocument: ({ documentId }: { documentId: string }) => Document<unknown> | undefined;
        getAsset: ({ assetId }: { assetId: string }) => Asset<unknown> | undefined;
        onContentChange: (contentChangeEvent: ContentChangeEvent<unknown, unknown>) => Promise<void>;
        onSchemaChange: () => void;
    }): void {}

    stopWatchingContentUpdates(): void {}

    async getModels(): Promise<Model[]> {
        return this.models;
    }

    async getLocales(): Promise<Locale[]> {
        return [];
    }

    async getDocuments(options: { modelMap: ModelMap }): Promise<Document[]> {
        const filePaths = await utils.readDirRec(path.join(this.rootDir, this.contentDir));
        const documents: Document[] = [];
        for (const filePath of filePaths) {
            const fullFilePath = path.join(this.rootDir, this.contentDir, filePath);
            const extension = path.extname(filePath).substring(1);
            let data;
            try {
                data = await utils.parseFile(fullFilePath);
                if (MARKDOWN_FILE_EXTENSIONS.includes(extension) && _.has(data, 'frontmatter') && _.has(data, 'markdown')) {
                    data = data.frontmatter;
                }
            } catch (err) {
                this.logger?.warn('Error loading file ' + filePath, err);
                continue;
            }
            const document = await convertDocument(path.relative(this.rootDir, fullFilePath), fullFilePath, data, options.modelMap);
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
        const filePaths = await utils.readDirRec(assetsDir);
        const assets: Asset[] = [];
        for (const filePath of filePaths) {
            let fileStats: fse.Stats | null = null;
            try {
                fileStats = await fse.stat(path.join(this.rootDir, filePath));
            } catch (err) {}
            assets.push({
                type: 'asset',
                id: filePath,
                context: {},
                createdAt: (fileStats?.birthtime ?? new Date()).toISOString(),
                updatedAt: (fileStats?.mtime ?? new Date()).toISOString(),
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

    createDocument(options: {
        updateOperationFields: Record<string, UpdateOperationField>;
        model: Model;
        modelMap: ModelMap;
        locale?: string | undefined;
        defaultLocaleDocumentId?: string | undefined;
        userContext?: unknown;
    }): Promise<Document<unknown>> {
        throw new Error('Method not implemented.');
    }

    updateDocument(options: {
        document: Document<unknown>;
        operations: UpdateOperation[];
        modelMap: ModelMap;
        userContext?: unknown;
    }): Promise<Document<unknown>> {
        throw new Error('Method not implemented.');
    }

    deleteDocument(options: { document: Document<unknown>; userContext?: unknown }): Promise<void> {
        throw new Error('Method not implemented.');
    }

    uploadAsset(options: {
        url?: string | undefined;
        base64?: string | undefined;
        fileName: string;
        mimeType: string;
        locale?: string | undefined;
        userContext?: unknown;
    }): Promise<Asset<unknown>> {
        throw new Error('Method not implemented.');
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
        throw new Error('Method not implemented.');
    }
}

async function convertDocument(filePath: string, fullFilePath: string, data: any, modelMap: ModelMap): Promise<Document | null> {
    const { id, type, ...fields } = data;
    const model = modelMap[type];
    if (!model) {
        return null;
    }
    let fileStats: fse.Stats | null = null;
    try {
        fileStats = await fse.stat(fullFilePath);
    } catch (err) {}
    return {
        type: 'document',
        id: filePath,
        modelName: model.name,
        manageUrl: '',
        status: 'published',
        createdAt: (fileStats?.birthtime ?? new Date()).toISOString(),
        updatedAt: (fileStats?.mtime ?? new Date()).toISOString(),
        context: {},
        fields: convertFields(fields, model.fields ?? [], modelMap)
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
        default:
            throw new Error('Unsupported type: ' + modelField.type);
    }
}
