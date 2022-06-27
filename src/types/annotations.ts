export declare const StackbitObjectIdAttrName = "data-sb-object-id";
export declare const StackbitFieldPathAttrName = "data-sb-field-path";
export declare type StackbitObjectId = {
    [StackbitObjectIdAttrName]?: string;
};
export declare type StackbitFieldPath = {
    [StackbitFieldPathAttrName]?: string;
};
export declare type StackbitAnnotations = StackbitObjectId & StackbitFieldPath;
export declare function getObjectId(props?: StackbitObjectId): string | undefined;
export declare function getFieldPath(props?: StackbitFieldPath): string | undefined;