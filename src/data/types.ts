export type ID = string;
export type CellKind = 'markdown' | 'code';

export interface NotebookMeta {
    id: ID;
    title: string;
    createdAt: string;  // ISO
    updatedAt: string;  // ISO
}

export interface Cell {
    id: ID;
    notebookId: ID;
    kind: CellKind;
    content: string;
    order: number;      // 100, 200, 300 ....
    createdAt: string;  // ISO
    updatedAt: string;  // ISO
}

export interface SnapshotV1 {
    meta: Omit<NotebookMeta, "updatedAt">;
    cells: Array<Pick<Cell, "id" | "kind" | "content" | "order" | "createdAt">>;
}