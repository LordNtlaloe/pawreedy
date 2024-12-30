import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "./SkeletonCard";

export function ProductInfoSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Product Image Skeleton */}
        <div className="relative w-full aspect-w-4 aspect-h-3 lg:aspect-h-2">
          <Skeleton className="absolute inset-0 rounded-md shadow-sm border bg-gray-50" />
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
          <Skeleton className="h-12 w-3/4 rounded-md mt-4" />
          <Skeleton className="h-10 w-full rounded-md mt-6" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-36 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
