import { LitElement, html, css } from "lit";
import { ulid } from "ulid";
import type { Cell, NotebookMeta } from "./data/types";
import {
  listNotebooks,
  putNotebook,
  listCells,
  putCell,
  openDatabase,
} from "./data/idb";

customElements.define(
  "lccn-app",
  class extends LitElement {
    static styles = css`
      :host { display: grid; grid-template-columns: 260px 1fr 320px; grid-template-rows: 100vh; }
      .sidebar { border-right: 1px solid #e5e7eb; padding: 12px; }
      .editor { padding: 12px; }
      .editor header { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
      .right { border-left: 1px solid #e5e7eb; padding: 12px; background: #fafafa; }
      button { border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px 10px; background: white; cursor: pointer; }
      .cell { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; margin-bottom: 8px; background: #fff; }
      .id { font-size: 11px; color: #64748b; }
      .title { font-weight: 600; }
    `;

    private _currentNotebookId: string | null = null;
    private _currentNotebookTitle = "Demo Notebook";
    private _cells: Cell[] = [];

    async firstUpdated() {
      await openDatabase();
      await this.#ensureDemoNotebook();
      await this.#loadCells();
    }

    async #ensureDemoNotebook() {
      const list = await listNotebooks();
      if (list.length > 0) {
        this._currentNotebookId = list[0].id;
        this._currentNotebookTitle = list[0].title;
        return;
      }
      const now = new Date().toISOString();
      const nb: NotebookMeta = {
        id: ulid(),
        title: "Demo Notebook",
        createdAt: now,
        updatedAt: now,
      };
      await putNotebook(nb);
      this._currentNotebookId = nb.id;
      this._currentNotebookTitle = nb.title;
    }

    async #loadCells() {
      if (!this._currentNotebookId) return;
      this._cells = await listCells(this._currentNotebookId);
      this.requestUpdate();
    }

    async #addCell() {
      if (!this._currentNotebookId) return;
      const now = new Date().toISOString();
      const lastOrder = this._cells.length ? this._cells[this._cells.length - 1].order : 0;
      const cell: Cell = {
        id: ulid(),
        notebookId: this._currentNotebookId,
        kind: "markdown",
        content: "New cell ✍️",
        order: (lastOrder || 0) + 100,
        createdAt: now,
        updatedAt: now,
      };
      await putCell(cell);
      await this.#loadCells();
    }

    render() {
      return html`
        <div class="sidebar">
          <div class="title">Notebooks</div>
          <div class="id">${this._currentNotebookTitle}</div>
        </div>

        <div class="editor">
          <header>
            <div class="title">Cells</div>
            <button data-testid="add-cell" @click=${() => this.#addCell()}>Add cell</button>
          </header>

          ${this._cells.map(
            (c) => html`
              <div class="cell" data-testid="cell">
                <div class="id">#${c.order} • ${c.id.slice(-6)}</div>
                <div>${c.content}</div>
              </div>
            `,
          )}
        </div>

        <div class="right">
          <div class="title">Right Panel</div>
          <div>Snapshots / Inspector (stub)</div>
        </div>
      `;
    }
  },
);
