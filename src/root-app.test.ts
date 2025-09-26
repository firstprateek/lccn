import { describe, it, expect } from "vitest";
import "./root-app";

describe("<lccn-app>", () => {
  it("defines the custom element", () => {
    expect(customElements.get("lccn-app")).toBeTruthy();
  });
});
