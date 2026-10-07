/** Marcador de carga con la misma forma que PropertyCard. */
export default function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-[4/3] rounded-2xl bg-sand-200" />
      <div className="mt-4 h-3 w-1/3 rounded bg-sand-200" />
      <div className="mt-3 h-4 w-3/4 rounded bg-sand-200" />
      <div className="mt-3 h-5 w-1/2 rounded bg-sand-200" />
      <div className="mt-5 h-px bg-line" />
      <div className="mt-4 h-3 w-2/3 rounded bg-sand-200" />
    </div>
  )
}
