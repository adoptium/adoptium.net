interface NewsEmptyStateProps {
  tag?: string;
  author?: string;
  source?: string;
}

export default function NewsEmptyState({
  tag,
  author,
  source,
}: NewsEmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-2xl font-semibold text-white mb-4">
        No results found
      </h2>

      <p className="text-white/70 max-w-md">
        We couldn't find any blogs matching your selected filters.
      </p>

      <div className="mt-6 flex gap-2 flex-wrap justify-center">
        {tag && (
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
            Tag: {tag}
          </span>
        )}
        {author && (
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
            Author: {author}
          </span>
        )}
        {source && (
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
            Source: {source}
          </span>
        )}
      </div>

      <p className="mt-6 text-white/50">
        Try adjusting or clearing your filters.
      </p>
    </div>
  );
}
