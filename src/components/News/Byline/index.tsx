import React from "react";
import { Link } from "@/i18n/navigation";
import ProfilePicInline from "@/components/ProfilePicInline";

interface IBylineProps {
  author: string;
  date: string;
  identifier: string;
}

const Byline: React.FC<IBylineProps> = (props) => {
  const { author, date, identifier } = props;
  return (
    <div className="flex items-center gap-4">
      <ProfilePicInline identifier={identifier} name={author} />
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
        <Link
          href={`/news/author/${identifier}`}
          className="font-semibold text-pink hover:underline transition-colors"
        >
          {author}
        </Link>
        <span className="hidden sm:inline text-gray-600">·</span>
        <time className="text-gray-400 light:text-gray-500">{date}</time>
      </div>
    </div>
  );
};

export default Byline;
