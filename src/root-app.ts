import { LitElement, html, css } from "lit";

customElements.define(
  "lccn-app",
  class extends LitElement {
    static styles = css`
      :host {
        display: grid;
        grid-template-columns: 260px 1fr 320px;
        grid-template-rows: 100vh;
        gap: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
          Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      }
      .sidebar {
        border-right: 1px solid #e5e7eb;
        padding: 12px;
      }
      .editor {
        padding: 12px;
      }
      .right {
        border-left: 1px solid #e5e7eb;
        padding: 12px;
        background: #fafafa;
      }
      pre {
        margin: 0;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #0f172a;
        color: #e2e8f0;
        overflow: auto;
        height: calc(100vh - 48px);
      }
      h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #334155;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
    `;

    render() {
      // Option A: Monaco placeholder (fast)
      const sample = `function hello(name: string) {
      return \`Hello, \${name}\`;
    }
    
    console.log(hello("World"));`;

      return html`
        <div class="sidebar">
          <h3>Sidebar</h3>
          <div>Nav & project tree (stub)</div>
        </div>
        <div class="editor">
          <h3>Editor</h3>
          <pre>${sample}</pre>
        </div>
        <div class="right">
          <h3>Right Panel</h3>
          <div>Problems/Props/Inspector (stub)</div>
        </div>
      `;
    }
  }
);
