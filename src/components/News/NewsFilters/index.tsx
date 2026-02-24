"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { FilterSelect } from "./FilterSelect";

interface NewsFiltersProps {
  tags: string[];
  authors: string[];
}

type FilterKey = "source" | "tag" | "author";

export default function NewsFilters({ tags, authors }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (key: FilterKey, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchParams.get(key) === value) return;

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    const newQuery = params.toString();
    const cleanPath = pathname.replace(/\/page\/\d+$/, "");

    startTransition(() => {
      router.replace(`${cleanPath}${newQuery ? `?${newQuery}` : ""}`);
    });
  };

  return (
    <div className="w-full flex justify-center px-4 mt-8 mb-10">
      <div className="flex flex-wrap justify-center gap-4 max-w-3xl w-full">
        {/* SOURCE FILTER */}
        <FilterSelect
          label="All Sources"
          value={searchParams.get("source") || ""}
          options={["adoptium", "eclipse"]}
          onChange={(value) => handleChange("source", value)}
          disabled={isPending}
        />

        {/* TAG FILTER */}
        <FilterSelect
          label="All Tags"
          value={searchParams.get("tag") || ""}
          options={tags}
          onChange={(value) => handleChange("tag", value)}
          disabled={isPending}
        />

        {/* AUTHOR FILTER */}
        <FilterSelect
          label="All Authors"
          value={searchParams.get("author") || ""}
          options={authors}
          onChange={(value) => handleChange("author", value)}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
