export default function GuideLoading() {
  return (
    <>
      {/* Progress bar skeleton */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-3">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="h-5 bg-muted rounded w-24" />
            <div className="flex-1 h-2 bg-muted rounded-full" />
            <div className="h-5 bg-muted rounded w-12" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 max-w-7xl mx-auto">
          <main className="space-y-6 animate-pulse">
            {/* Guide header skeleton */}
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-32" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4 pt-8">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/5" />

              <div className="h-48 bg-muted rounded-lg my-6" />

              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>

            <div className="space-y-4 pt-8">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />

              <div className="h-48 bg-muted rounded-lg my-6" />
            </div>
          </main>

          {/* Sidebar skeleton */}
          <aside className="hidden lg:block space-y-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded w-full" />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
