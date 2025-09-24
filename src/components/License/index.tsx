import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "License(s)",
    description: "Information about the licenses for Adoptium build scripts, website, and OpenJDK code.",
};

const License = () => (
    <section className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">License(s)</h1>
        <ul className="list-disc pl-6 space-y-4 text-lg text-grey">
            <li>
                Build scripts and other code to produce the binaries, the website and other build infrastructure are licensed under{" "}
                <a
                    href="https://www.apache.org/licenses/LICENSE-2.0"
                    className="underline !underline-offset-5"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Apache License, Version 2.0
                </a>
                .
            </li>
            <li>
                OpenJDK code itself is licensed under{" "}
                <a
                    href="https://openjdk.java.net/legal/gplv2+ce.html"
                    className="underline !underline-offset-5"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GPL v2 with Classpath Exception
                </a>{" "}
                (GPLv2+CE) and{" "}
                <a
                    href="https://openjdk.java.net/legal/assembly-exception.html"
                    className="underline !underline-offset-5"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GPL v2 with Assembly Exception
                </a>{" "}
                (GPLv2+Assembly).
            </li>
        </ul>
    </section>
);

export default License;