import React from 'react';
export const SkeletonText: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}) => (
  <div className={`animate-pulse bg-gray-200 rounded ${width} ${height} ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
    <SkeletonText width="w-3/4" height="h-5" />
    <SkeletonText width="w-full" height="h-4" />
    <SkeletonText width="w-1/2" height="h-4" />
    <div className="flex gap-2 pt-2">
      <SkeletonText width="w-20" height="h-8" />
      <SkeletonText width="w-20" height="h-8" />
    </div>
  </div>
);