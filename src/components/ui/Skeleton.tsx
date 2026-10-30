/** Bloco cinza pulsante que ocupa o lugar do conteúdo enquanto ele carrega. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-line/70 ${className}`} />;
}
