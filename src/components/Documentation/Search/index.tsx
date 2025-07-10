"use client";

import React, { useState, useEffect, useRef } from "react";

type SearchResult = {
    slug: string;
    title: string;
    desc: string;
    locale: string;
};

const DocumentationSearch: React.FC = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => setResults((data as SearchResult[]).filter((r: SearchResult) => r.locale === 'en')))
            .catch(() => setResults([]));
    }, [query]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            // Only close if click is outside BOTH input and dropdown
            if (
                inputRef.current &&
                !inputRef.current.contains(e.target as Node) &&
                !(dropdownRef.current && dropdownRef.current.contains(e.target as Node))
            ) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="main-search-box d-block mx-auto">
            <div className="h-20 flex flex-col items-center">
                <div className="relative w-96">
                    <input
                        ref={inputRef}
                        type="text"
                        className="rounded-lg px-4 py-2 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        placeholder="Search documentation..."
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setShowResults(true);
                        }}
                        onFocus={() => setShowResults(true)}
                    />
                    {showResults && results.length > 0 && (
                        <div
                            ref={dropdownRef}
                            id="doc-search-dropdown"
                            className="absolute bottom-14 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                        >
                            {results.map((r, i) => (
                                <a
                                    key={i}
                                    href={`/${r.slug}`}
                                    className="block px-4 py-2 hover:bg-rose-50 text-black border-b last:border-b-0 border-gray-100"
                                    onClick={() => setShowResults(false)}
                                >
                                    <div className="font-semibold">{r.title}</div>
                                    <div className="text-xs text-gray-500">{r.desc}</div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentationSearch;
