import { describe, expect, it } from "vitest";
import { MockDataSource } from "@/lib/data/mock";
import { suiteDoAdaptador } from "./helpers/suite-adaptador";

suiteDoAdaptador("mock", () => new MockDataSource());

describe("mock", () => {
  it("gera 300 campanhas sintéticas, sempre as mesmas", async () => {
    const a = await new MockDataSource().getCampanhas();
    expect(a).toHaveLength(300);
    expect(a.every((c) => c.origem === "sintetico")).toBe(true);
    expect(a[0].id).toBe((await new MockDataSource().getCampanhas())[0].id);
  });
});
