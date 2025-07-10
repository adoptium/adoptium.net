"use client";

import { useState } from "react";

const BecomeAdopter = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Dropdown Trigger */}
            <button
                className="mx-auto mt-10 mb-6 bg-gradient-to-r from-[#FF1464] to-[#7F1CFF] text-white text-lg font-semibold w-full max-w-xs h-14 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-pink-400/50 border-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                How can I get my logo displayed?
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="w-full max-w-2xl mx-auto mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-pink-100 animate-fade-in">
                    <div className="p-6 sm:p-8 space-y-6 text-gray-800">
                        <p className="text-lg text-center">
                            You can easily add your organization’s logo to our list of adopters
                            by creating an issue or by submitting a pull request.
                        </p>

                        {/* Option 1 */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#FF1464] mb-2 text-center sm:text-left">
                                Option 1 - Open an Issue
                            </h2>
                            <ol className="list-decimal list-inside mt-3 space-y-2 pl-4">
                                <li>
                                    Go to our{" "}
                                    <a
                                        href="https://github.com/adoptium/adoptium.net/issues/new?assignees=&labels=adopter&projects=&template=adopters.yml&title=%5BAdopter%5D%3A+"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#FF1464] hover:underline font-medium"
                                    >
                                        Temurin Adopters Form
                                    </a>
                                    .
                                </li>
                                <li>
                                    Fill out the relevant fields (it takes less than 5 minutes)
                                </li>
                                <li>
                                    Attach logo files to an issue by dragging and dropping them in the text editor of the form.
                                </li>
                            </ol>
                        </div>

                        {/* Option 2 */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#7F1CFF] mb-2 text-center sm:text-left">
                                Option 2 - Submit a Pull Request
                            </h2>
                            <p className="mt-3">
                                When submitting a pull request, please make the following changes to the eclipsefdn-project-adopters’{" "}
                                <a
                                    href="https://gitlab.eclipse.org/eclipsefdn/it/api/eclipsefdn-project-adopters"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#7F1CFF] hover:underline font-medium"
                                >
                                    codebase
                                </a>
                                :
                            </p>
                            <ol className="list-decimal list-inside mt-3 space-y-2 pl-4">
                                <li>
                                    Go to{" "}
                                    <a
                                        href="https://gitlab.eclipse.org/eclipsefdn/it/api/eclipsefdn-project-adopters/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#7F1CFF] hover:underline font-medium"
                                    >
                                        https://gitlab.eclipse.org/eclipsefdn/it/api/eclipsefdn-project-adopters
                                    </a>
                                    .
                                </li>
                                <li>Fork the repository.</li>
                                <li>
                                    Update the adopter data file{" "}
                                    <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-700">
                                        config/adopters.json
                                    </code>
                                    . If your organization supports multiple projects, another project can be added to the projects list within the organization’s node. The values in this list should be the ID of the project.
                                </li>
                                <li>
                                    Add a colored and a white organization logo to{" "}
                                    <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-700">
                                        static/assets/images/adopters
                                    </code>
                                    .
                                </li>
                                <li>Submit the pull request.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BecomeAdopter;
