"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Icon } from "@/components/ds";

/* Avisos rápidos no rodapé da tela ("Peça aprovada", "PNG baixado"). Somem sozinhos em 3s. */

type Avisar = (texto: string) => void;
const Contexto = createContext<Avisar>(() => {});

export function useAvisar() {
  return useContext(Contexto);
}

export function AvisosProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<{ id: number; texto: string }[]>([]);

  const avisar = useCallback<Avisar>((texto) => {
    const id = Date.now() + Math.random();
    setAvisos((a) => [...a.slice(-2), { id, texto }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <Contexto.Provider value={avisar}>
      {children}
      <div className="avisos-rapidos" role="status" aria-live="polite">
        {avisos.map((a) => (
          <p key={a.id} className="aviso-rapido">
            <Icon name="check" size={18} />
            {a.texto}
          </p>
        ))}
      </div>
    </Contexto.Provider>
  );
}
