import { Metadata } from "next"
import React from "react"
import { FaTools, FaBullseye, FaExclamationTriangle, FaFileAlt, FaCogs, FaBolt, FaCheckCircle, FaArrowRight } from "react-icons/fa"

export const metadata: Metadata = {
    title: "Eclipse Migration Toolkit for Java",
    description: "The Eclipse Migration Toolkit for Java (EMT) is a set of tools designed to help developers and organizations migrate their Java applications to newer versions of the Java platform. It provides automated analysis, recommendations, and code transformation capabilities to simplify the migration process.",
}

export default function EMTPage() {
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-purple bg-gradient-to-br from-purple to-[#1a0b38] relative overflow-hidden">
                <div className="absolute inset-0 bg-center bg-no-repeat opacity-40 mix-blend-overlay"></div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink/30 rounded-full filter blur-3xl opacity-20"></div>
                    <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/30 rounded-full filter blur-3xl opacity-20"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-24 pb-20 md:pt-32 md:pb-28 flex flex-col items-center">
                        <div className="absolute sm:static sm:z-auto top-[80px] z-[-1] left-[50%] translate-x-[-50%] sm:translate-x-0">
                            <img src="/images/projects/adoptium-icon.png" style={{ width: "8em" }} alt="background-image" />
                        </div>

                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-300 text-6xl sm:text-7xl md:text-8xl">
                                Eclipse Migration Toolkit for Java
                            </h1>

                            <p className="mt-8 text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-3xl mx-auto">
                                A comprehensive tooling project for assisting Java version migration. EMT4J provides static and
                                dynamic tools with detailed analysis reports to help migrate Java applications from previous
                                versions of OpenJDK with confidence and ease.
                            </p>

                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                                <a
                                    href="https://github.com/adoptium/emt4j"
                                    target="_blank"
                                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <FaTools className="text-xl" />
                                    <span>Get Started</span>
                                </a>

                                <a
                                    target="_blank"
                                    href="https://projects.eclipse.org/projects/adoptium.emt4j"
                                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg border border-white/20 hover:border-white/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <FaBullseye className="text-xl" />
                                    <span>Learn More</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features/Benefits Section */}
            <div className="bg-gradient-to-b from-[#1a0b38] to-[#200e46] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-pink-500/50 hover:bg-white/10 transform hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/30">
                                <FaTools className="text-white text-xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Multiple Tool Types</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Java Agent, command-line tools, and Maven plugins provide flexible integration options for different development workflows and environments.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-pink-500/50 hover:bg-white/10 transform hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/30">
                                <FaExclamationTriangle className="text-white text-xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Incompatibility Analysis</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Comprehensive analysis of potential incompatibility issues across Java versions, including JDK internal API usage and system changes.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-pink-500/50 hover:bg-white/10 transform hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/30">
                                <FaFileAlt className="text-white text-xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Multiple Output Formats</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Generate detailed analysis reports in HTML, TXT, and JSON formats to integrate with your existing development and documentation workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section with Alternating Layout */}
            <div className="bg-gradient-to-b from-[#200e46] to-[#2a1359] py-24 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col space-y-24">
                        {/* Migration Toolkit Overview */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <span className="bg-purple-900/50 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/50 shadow-sm">ABOUT</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">Java Migration Made Simple</h2>
                                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                    The Eclipse Migration Toolkit for Java (EMT4J) is designed to simplify the process of upgrading Java applications across versions.
                                    Whether you're migrating from JDK 8 to 11 or JDK 11 to 17, EMT4J provides the tools and insights you need.
                                </p>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    By analyzing your codebase statically and dynamically, EMT4J identifies potential compatibility issues and provides detailed
                                    reports with actionable recommendations to ensure a smooth migration process.
                                </p>
                            </div>
                            <div className="order-1 md:order-2 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 group">
                                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 transform rotate-1 shadow-lg border border-white/10 group-hover:border-white/20 transition-all duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/30">
                                            <FaBolt className="text-white text-lg" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Project Status</div>
                                            <div className="text-lg font-bold text-purple-300">Incubating</div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mb-2">
                                        <div className="bg-purple-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-purple-200 border border-purple-500/50 shadow-sm">Migration</div>
                                        <div className="bg-purple-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-purple-200 border border-purple-500/50 shadow-sm">Analysis</div>
                                        <div className="bg-pink-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-pink-200 border border-pink-500/50 shadow-sm">Toolkit</div>
                                    </div>
                                    <div className="text-gray-300">
                                        An active project under the Adoptium umbrella, continuously evolving to support the latest Java versions.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tool Features Section */}
                        <div className="grid md:grid-cols-2 gap-12 items-center mt-24">
                            <div className="order-2 md:order-1 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 group">
                                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 transform -rotate-1 shadow-lg border border-white/10 group-hover:border-white/20 transition-all duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/30">
                                            <FaCogs className="text-white text-lg" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Available Tools</div>
                                            <div className="text-lg font-bold text-purple-300">3 Integration Options</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-500/50 shadow-sm">
                                            <div className="text-sm font-medium text-blue-200">Java Agent</div>
                                            <div className="text-xs text-blue-300/80">Runtime context & accurate call stack</div>
                                        </div>
                                        <div className="bg-green-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-500/50 shadow-sm">
                                            <div className="text-sm font-medium text-green-200">Command-line Tool</div>
                                            <div className="text-xs text-green-300/80">Easy to use, no app startup required</div>
                                        </div>
                                        <div className="bg-amber-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-500/50 shadow-sm">
                                            <div className="text-sm font-medium text-amber-200">Maven Plugin</div>
                                            <div className="text-xs text-amber-300/80">Build phase integration</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <span className="bg-purple-900/50 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/50 shadow-sm">FEATURES</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">Flexible Integration Options</h2>
                                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                    EMT4J provides three different tools to fit your development workflow:
                                </p>
                                <ul className="space-y-4 text-gray-300">
                                    <li className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <strong className="text-white">Java Agent:</strong> Provides runtime context information and accurate call stack analysis to find more potential issues
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <strong className="text-white">Command-line Tool:</strong> Easy to use without starting your application, though may have some false positives
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <strong className="text-white">Maven Plugin:</strong> Integrates directly into your build process to catch issues during development
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Supported Migration Paths */}
                        <div className="grid md:grid-cols-2 gap-12 items-center mt-24">
                            <div>
                                <span className="bg-pink-900/50 text-pink-200 text-xs font-semibold px-3 py-1 rounded-full border border-pink-500/50 shadow-sm">COMPATIBILITY</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">Supported Migration Paths</h2>
                                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                    EMT4J supports analysis for the most common Java migration scenarios, covering both JDK 8 to 11 and JDK 11 to 17 upgrade paths.
                                </p>
                                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                    Each migration path includes specific checks for known compatibility issues, API changes, and system modifications
                                    that could affect your application's functionality.
                                </p>
                                <div className="mt-6">
                                    <a
                                        href="/news/2022/12/emt4j-an-easier-upgrade-for-java-applications/"
                                        className="group px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center w-fit"
                                    >
                                        <FaFileAlt className="text-xl mr-2 group-hover:animate-pulse" />
                                        <span>Read the Blog Post</span>
                                        <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </a>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-40 animate-pulse"></div>
                                <div className="relative bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20">
                                    <div className="space-y-6 relative z-10">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/5 rounded-full filter blur-xl"></div>
                                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-xl"></div>

                                        {/* JDK 8 to 11 */}
                                        <div className="border border-purple-500/30 rounded-xl p-4 bg-purple-900/20">
                                            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                                                JDK 8 to JDK 11
                                            </h3>
                                            <ul className="space-y-2 text-sm text-gray-300">
                                                <li>• JDK Internal API usage detection</li>
                                                <li>• System ClassLoader changes</li>
                                                <li>• Arrays.asList return type changes</li>
                                                <li>• Java Version schema updates</li>
                                                <li>• JPMS add-exports and add-opens requirements</li>
                                                <li>• Time zone data CLDR changes</li>
                                                <li>• Pattern.compile API changes</li>
                                                <li>• JVM option modifications</li>
                                            </ul>
                                        </div>

                                        {/* JDK 11 to 17 */}
                                        <div className="border border-pink-500/30 rounded-xl p-4 bg-pink-900/20">
                                            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                                                JDK 11 to JDK 17
                                            </h3>
                                            <ul className="space-y-2 text-sm text-gray-300">
                                                <li>• Removed Nashorn engine</li>
                                                <li>• Removed RMI and Java Applet support</li>
                                                <li>• Field access restrictions in some classes</li>
                                                <li>• Additional API deprecations and removals</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action Section */}
                        <div className="mt-24 mb-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-pink-600/50 rounded-3xl blur-2xl opacity-30 -z-10"></div>
                            <div className="relative bg-gradient-to-br from-[#1a0b38]/90 to-[#2b1a4f]/90 backdrop-blur-lg rounded-3xl border border-white/10 p-12 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full filter blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"></div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="max-w-2xl">
                                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start your Java migration journey today</h2>
                                        <p className="text-lg text-white/80">
                                            Join developers worldwide who are using EMT4J to upgrade their Java applications with confidence and minimal risk.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a
                                            href="https://github.com/adoptium/emt4j"
                                            target="_blank"
                                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                                        >
                                            <FaTools className="mr-2" />
                                            Get EMT4J
                                        </a>

                                        <a
                                            href="https://projects.eclipse.org/projects/adoptium.emt4j"
                                            target="_blank"
                                            className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg border border-white/20 hover:border-white/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                                        >
                                            <FaBullseye className="mr-2" />
                                            View Project
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[1px] bg-[#3E3355] opacity-50"></div>
        </div>
    )
}
