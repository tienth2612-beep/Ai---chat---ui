export interface ExcelTemplateDetailResponse {
    excelTemplate: ExcelTemplateResponse;
    excelTemplateColumns: ExcelTemplateColumn[] | null;
}
export interface ExcelTemplateResponse {
    id: number;
    name: string;
    sheetName: string | null;
    fileName: string | null;
    createAt: string;
    targetTable: string;
    fileUrl: string | null;
    status: number;
    createBy: number;
    updateBy: number | null;
    updateAt: string | null;
    isFunction: boolean;
    functionName: string | null;
    type: 0 | 1;
    target: number;
    description: string | null;
}
export interface ExcelTemplateColumn {
    id: number;
    templateId: number;
    columnName: string;
    mappedProperty: string;
    dataType: string;
    isRequired: boolean;
    validationRegex: string | null;
    columnIndex: number;
    mappedTable: string | null;
    status: number;
    createBy: number;
    createAt: string;
    updateBy: number | null;
    updateAt: string | null;
}
