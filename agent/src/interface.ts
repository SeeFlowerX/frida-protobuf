export interface tsMap {
    [key: string]: any;
    [index: number]: any;
}

export interface javaMethod {
    getName: {
        (): string;
    };
    getReturnType: {
        (): javaType;
    };
}

export interface javaType {
    getSimpleName: {
        (): string;
    };
    getCanonicalName: {
        (): string;
    };
}

export interface javaField {
    getType: {
        (): javaType;
    };
    getSignatureAnnotation: {
        (): string[];
    };
}