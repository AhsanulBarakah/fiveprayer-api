export default function Skeleton() {
  return (
    <div className="h-screen bg-gray-100 py-2 px-2 overflow-hidden flex items-center justify-center">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl p-3 shadow-xl border border-gray-200">
          {/* Language Switcher Skeleton */}
          <div className="flex justify-center gap-3 mb-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Header Skeleton */}
          <div className="text-center mb-3 pb-3 border-b border-gray-200">
            <div className="h-5 w-28 bg-gray-200 rounded mx-auto mb-1 animate-pulse"></div>
            <div className="h-3 w-32 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="h-3 w-40 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Next Prayer Skeleton */}
          <div className="bg-gray-200 rounded-xl p-3 mb-3 h-16 animate-pulse"></div>

          {/* Prayer Schedule Skeleton */}
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-1 animate-pulse"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg mb-1 h-10 animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 mx-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Footer Skeleton */}
          <div className="h-3 w-28 bg-gray-200 rounded mx-auto mt-2 animate-pulse"></div>
          <div className="h-3 w-40 bg-gray-200 rounded mx-auto mt-1 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
