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
    <div className="w-full flex justify-center px-4 mt-8 mb-10">
      <div className="flex w-full max-w-4xl gap-4">
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
            onChange={(value) => handleChange("tag", value)}
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
    </div>
  );
}
