"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { FilterSelect, SelectOption } from "./FilterSelect";

interface NewsFiltersProps {
  tags: SelectOption[];
  authors: SelectOption[];
}

type FilterKey = "source" | "tag" | "author";

export default function NewsFilters({ tags, authors }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const selectedTags = (searchParams.get("tag") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const addTag = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentTags = selectedTags.includes(value)
      ? selectedTags
      : [...selectedTags, value];

    params.set("tag", currentTags.join(","));
    params.delete("page");

    const newQuery = params.toString();
    const cleanPath = pathname.replace(/\/page\/\d+$/, "");

    startTransition(() => {
      router.replace(`${cleanPath}${newQuery ? `?${newQuery}` : ""}`);
    });
  };

  const removeTag = (tagToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const updatedTags = selectedTags.filter((t) => t !== tagToRemove);

    if (updatedTags.length > 0) {
      params.set("tag", updatedTags.join(","));
    } else {
      params.delete("tag");
    }

    params.delete("page");

    const newQuery = params.toString();
    const cleanPath = pathname.replace(/\/page\/\d+$/, "");

    startTransition(() => {
      router.replace(`${cleanPath}${newQuery ? `?${newQuery}` : ""}`);
    });
  };

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
  const sourceOptions: SelectOption[] = [
    { value: "adoptium", label: "Adoptium" },
    { value: "eclipse", label: "Eclipse" },
  ];

  return (
    <div className="w-full flex flex-col items-center px-4 mt-8 mb-10">
      <div className="flex flex-wrap gap-2 mt-4 max-w-4xl w-full">
        <div className="flex-1 min-w-0">
          <FilterSelect
            label="All Sources"
            value={searchParams.get("source") || ""}
            options={sourceOptions}
            onChange={(value) => handleChange("source", value)}
            disabled={isPending}
          />
        </div>

        <div className="flex-1 min-w-0">
          <FilterSelect
            label="All Tags"
            value={searchParams.get("tag") || ""}
            options={tags}
            onChange={(value) => addTag(value)}
            disabled={isPending}
          />
        </div>

        <div className="flex-1 min-w-0">
          <FilterSelect
            label="All Authors"
            value={searchParams.get("author") || ""}
            options={authors}
            onChange={(value) => handleChange("author", value)}
            disabled={isPending}
          />
        </div>
      </div>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 max-w-4xl">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-700 text-white rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-xs hover:text-gray-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
