export default function Loading() {
  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="h-12 bg-muted rounded-lg w-3/4" />
        <div className="h-6 bg-muted rounded w-1/2" />

        {/* Search bar skeleton */}
        <div className="h-12 bg-muted rounded-lg w-full max-w-2xl mx-auto my-8" />

        {/* Platform cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="h-8 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
