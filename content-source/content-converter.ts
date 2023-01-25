import path from 'path';

import { Asset, Document, DocumentField, DocumentListFieldItems, Field, FieldSpecificProps, ModelMap } from '@stackbit/types';
import { getFileDates } from './utils';

export async function convertAsset(filePath: string, fullFilePath: string, publicPath?: string): Promise<Asset> {
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

export async function convertDocument(filePath: string, fullFilePath: string, data: any, modelMap: ModelMap): Promise<Document | null> {
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
