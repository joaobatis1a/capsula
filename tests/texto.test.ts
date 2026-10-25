import { describe, expect, it } from "vitest";
import { semIds } from "@/lib/motor/texto";

describe("semIds", () => {
  it("tira o id de evidência que escapou para o texto", () => {
    expect(semIds("Peça orientação ao farmacêutico. [rad-musica-1]")).toBe("Peça orientação ao farmacêutico.");
    expect(semIds("Oferta válida até 24/11 [rad-musica-1]")).toBe("Oferta válida até 24/11");
    expect(semIds("Cuide da pele (saz-exposicao-sol) no verão")).toBe("Cuide da pele no verão");
    expect(semIds("Pergunta direta [rk-ctr-pergunta-instagram-feed]")).toBe("Pergunta direta");
  });

  it("não mexe em texto comum entre parênteses ou colchetes", () => {
    expect(semIds("Para jovens (18-24) na rotina")).toBe("Para jovens (18-24) na rotina");
    expect(semIds("Creme [anti-idade] com 30% off")).toBe("Creme [anti-idade] com 30% off");
    expect(semIds(undefined)).toBeUndefined();
  });
});
