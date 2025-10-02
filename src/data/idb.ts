import type { Cell, NotebookMeta, ID } from "./types";

const DB_NAME = "lccn";
const DB_VERSION = 1 as const;

const STORES = {
  notebooks: "notebooks",
  cells: "cells",
  snapshots: "snapshots",
  meta: "meta",
} as const;

let _dbPromise: Promise<IDBDatabase> | null = null;

function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => { resolve(req.result); };
    req.onerror = () => { reject(req.error); };
  });
}

export function openDatabase(): Promise<IDBDatabase> {
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORES.notebooks)) {
        db.createObjectStore(STORES.notebooks, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORES.cells)) {
        const cells = db.createObjectStore(STORES.cells, {
          keyPath: ["notebookId", "id"],
        });
        cells.createIndex("byNotebook", "notebookId", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.snapshots)) {
        const snaps = db.createObjectStore(STORES.snapshots, {
          keyPath: ["notebookId", "createdAt"],
        });
        snaps.createIndex("byNotebook", "notebookId", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.meta)) {
        db.createObjectStore(STORES.meta, { keyPath: "key" });
      }
    };

    req.onsuccess = () => { resolve(req.result); };
    req.onerror = () => { reject(req.error); };
  });

  return _dbPromise;
}

// ------- Notebooks -------
export async function putNotebook(meta: NotebookMeta): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(["notebooks"], "readwrite");
  tx.onerror = () => { console.error("putNotebook tx error:", tx.error); };
  tx.objectStore("notebooks").put(meta);
  await new Promise<void>((res, rej) => {
    tx.oncomplete = () => { res(); };
    tx.onabort = () => { rej(tx.error); };
  });
}

export async function getNotebook(id: ID): Promise<NotebookMeta | undefined> {
  const db = await openDatabase();
  const tx = db.transaction(["notebooks"], "readonly");
  return await promisify<NotebookMeta | undefined>(
    tx.objectStore("notebooks").get(id),
  );
}

export async function listNotebooks(): Promise<NotebookMeta[]> {
  const db = await openDatabase();
  const tx = db.transaction(["notebooks"], "readonly");
  const all = await promisify<NotebookMeta[]>(tx.objectStore("notebooks").getAll());
  all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return all;
}

// ------- Cells -------
export async function putCell(cell: Cell): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(["cells", "notebooks"], "readwrite");
  tx.onerror = () => { console.error("putCell tx error:", tx.error); };

  tx.objectStore("cells").put(cell);

  const nbStore = tx.objectStore("notebooks");
  const getReq = nbStore.get(cell.notebookId);
  getReq.onsuccess = () => {
    const nb = getReq.result as NotebookMeta | undefined;
    if (nb) {
      nb.updatedAt = new Date().toISOString();
      nbStore.put(nb);
    }
  };

  await new Promise<void>((res, rej) => {
    tx.oncomplete = () => { res(); };
    tx.onabort = () => { rej(tx.error); };
  });
}

export async function listCells(notebookId: ID): Promise<Cell[]> {
  const db = await openDatabase();
  const tx = db.transaction(["cells"], "readonly");
  const idx = tx.objectStore("cells").index("byNotebook");
  const cells = await promisify<Cell[]>(idx.getAll(IDBKeyRange.only(notebookId)));
  cells.sort((a, b) => a.order - b.order);
  return cells;
}

export async function deleteCell(notebookId: ID, id: ID): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(["cells"], "readwrite");
  tx.objectStore("cells").delete([notebookId, id]);
  await new Promise<void>((res, rej) => {
    tx.oncomplete = () => { res(); };
    tx.onabort = () => { rej(tx.error); };
  });
}
