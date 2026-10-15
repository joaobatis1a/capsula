/* Recriado a cada navegação: dá a entrada da página. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="pagina">{children}</div>;
}
