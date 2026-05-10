export default function ShopLoading() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <section className="py-20 bg-zapatos-taupe/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="h-4 w-32 bg-zapatos-taupe/30 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-64 bg-zapatos-taupe/30 rounded mx-auto mb-6 animate-pulse" />
          <div className="h-6 w-96 max-w-full bg-zapatos-taupe/30 rounded mx-auto animate-pulse" />
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="py-16 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-zapatos-taupe/20 luxury-border animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-16 bg-zapatos-taupe/20 rounded animate-pulse" />
                <div className="h-6 w-full bg-zapatos-taupe/20 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-zapatos-taupe/20 rounded animate-pulse" />
                <div className="h-6 w-24 bg-zapatos-taupe/20 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
