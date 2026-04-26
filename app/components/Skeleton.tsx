export default function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-200">
          {/* Language Switcher Skeleton */}
          <div className="flex justify-center gap-3 mb-4">
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Header Skeleton */}
          <div className="text-center mb-4 pb-4 border-b border-gray-200">
            <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Next Prayer Skeleton */}
          <div className="bg-gray-200 rounded-xl p-4 mb-4 h-20 animate-pulse"></div>

          {/* Prayer Schedule Skeleton */}
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 h-12 animate-pulse">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 mx-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Footer Skeleton */}
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto mt-3 animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto mt-1 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
