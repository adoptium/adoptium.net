import Link from 'next/link';

type TagsProps = {
  tags?: string[]
};

const Tags: React.FC<TagsProps> = ({ tags = [] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {tags.map((tag, index) => (
        <Link 
          key={index} 
          href={`/news/tag/${encodeURIComponent(tag)}`}
          className="px-3 py-1 text-sm bg-neutral-800 hover:bg-rose-800 transition-colors rounded-full text-white"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
};

export default Tags;
