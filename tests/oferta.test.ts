import { describe, expect, it } from "vitest";
import { calcularDesconto, descricaoDaOferta, lerPreco } from "@/lib/oferta";

describe("desconto da oferta", () => {
  it("R$ 100 por R$ 80 é 20% de desconto", () => {
    expect(calcularDesconto(100, 80)).toEqual({ tipo: "ok", percentual: 20, economia: 20 });
  });
  it("arredonda e nunca mostra 0%", () => {
    expect(calcularDesconto(79.9, 55.9)).toMatchObject({ percentual: 30, economia: 24 });
    expect(calcularDesconto(1000, 999)).toMatchObject({ percentual: 1 });
  });
  it("sem os dois preços ou com preço de oferta igual ou maior, não calcula", () => {
    expect(calcularDesconto(undefined, 80)).toEqual({ tipo: "vazio" });
    expect(calcularDesconto(100, undefined)).toEqual({ tipo: "vazio" });
    expect(calcularDesconto(100, 100)).toEqual({ tipo: "invalido" });
    expect(calcularDesconto(100, 120)).toEqual({ tipo: "invalido" });
  });
  it("lê preço em formato brasileiro e com ponto", () => {
    expect(lerPreco("79,90")).toBe(79.9);
    expect(lerPreco("R$ 1.234,50")).toBe(1234.5);
    expect(lerPreco("55.90")).toBe(55.9);
    expect(lerPreco("")).toBeUndefined();
    expect(lerPreco("abc")).toBeUndefined();
    expect(lerPreco("0")).toBeUndefined();
  });
  it("monta o texto da oferta para o motor a partir dos preços", () => {
    expect(descricaoDaOferta("Protetor solar FPS 50", 100, 80)).toBe("20% off em Protetor solar FPS 50");
    expect(descricaoDaOferta("Protetor", undefined, 55.9)).toContain("Protetor por R$");
    expect(descricaoDaOferta("Protetor", undefined, undefined)).toBe("Oferta em Protetor");
  });
});
