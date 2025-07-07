import AuthorData from "@/data/authors.json";

export interface Author {
  name: string;
  summary?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export function getFormattedAuthorData(authorId: string): Author {
  const rawAuthorData = AuthorData[authorId as keyof typeof AuthorData];

  if (!rawAuthorData) {
    return {
      name: "Unknown Author",
    };
  }

  // Convert the raw author data to our Author interface
  return {
    name: rawAuthorData.name || "Unknown Author",
    // Convert null values to undefined
    summary: rawAuthorData.summary || undefined,
    twitter: rawAuthorData.twitter || undefined,
    github: rawAuthorData.github || undefined,
    linkedin: rawAuthorData.linkedin || undefined,
  };
}
