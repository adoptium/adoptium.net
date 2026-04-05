import { Link } from "@/i18n/navigation";

type TagsProps = {
  tags?: string[];
};

const Tags: React.FC<TagsProps> = ({ tags = [] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/news?tag=${encodeURIComponent(tag)}`}
          className="px-3 py-1 text-xs font-medium bg-white/10 light:bg-gray-100 hover:bg-pink/20 text-gray-300 light:text-gray-600 hover:text-pink border border-white/10 light:border-gray-200 hover:border-pink/30 transition-all rounded-full"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
};

export default Tags;
