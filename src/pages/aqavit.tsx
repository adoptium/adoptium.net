import React from "react"
import { graphql } from "gatsby"
import { Link } from "../components/Link"

import Layout from "../components/Layout"
import Seo from "../components/Seo"

// @ts-ignore
import HeroBgImg from "../images/backgrounds/aqavit-hero-bg.svg"
// Import react-icons
import {
  FaRocket,
  FaBullseye,
  FaCode,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaFlask,
  FaBolt,
  FaChartLine,
} from "react-icons/fa"

const AQAvit = () => {
  return (
    <Layout>
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
              <HeroBgImg
                className="sm:w-full sm:max-w-3xl"
                alt="background-image"
              />
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-300 text-6xl sm:text-7xl md:text-8xl">
                Eclipse AQAvit™
              </h1>

              <p className="mt-8 text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-3xl mx-auto">
                The quality and runtime branding evaluation project for Java SE
                runtimes and associated technology. We ensure your Java runtime
                meets exceptional quality standards for performance, security,
                and reliability in production environments.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/docs/aqavit-verification/"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaRocket className="text-xl" />
                  <span>Run AQAvit</span>
                </Link>

                <a
                  target="_blank"
                  href="https://projects.eclipse.org/projects/adoptium.aqavit"
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
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Quality Assurance
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Ensures all qualities are present for production use, including
                performance, security, resilience and endurance.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-pink-500/50 hover:bg-white/10 transform hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/30">
                <FaCheckCircle className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Verified Runtime
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Takes functionally complete Java runtimes and certifies them as
                release-ready through rigorous testing.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-pink-500/50 hover:bg-white/10 transform hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/30">
                <FaCode className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Application Testing
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Validates runtimes by passing a wide variety of application test
                suites, ensuring compatibility and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section with Alternating Layout */}
      <div className="bg-gradient-to-b from-[#200e46] to-[#2a1359] py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-24">
            {/* The AQAvit Name */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="bg-purple-900/50 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/50 shadow-sm">
                  ABOUT
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
                  The AQAvit Name
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  The AQAvit project gets its name from{" "}
                  <span className="font-semibold text-purple-200">
                    Adoptium Quality Assurance
                  </span>{" "}
                  'AQA' and 'vit' for vitality and speed.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  As the project engages with vendors and enterprise consumers,
                  the test suite is expanded and improved to keep pace with the
                  latest Java releases and to continuously raise the quality bar
                  through collaboration and rigour.
                </p>
              </div>
              <div className="order-1 md:order-2 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 group">
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 transform rotate-1 shadow-lg border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/30">
                      <FaBolt className="text-white text-lg" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">
                        Project Name Origin
                      </div>
                      <div className="text-lg font-bold text-purple-300">
                        AQA + vit
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <div className="bg-purple-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-purple-200 border border-purple-500/50 shadow-sm">
                      Adoptium
                    </div>
                    <div className="bg-purple-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-purple-200 border border-purple-500/50 shadow-sm">
                      Quality Assurance
                    </div>
                    <div className="bg-pink-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-pink-200 border border-pink-500/50 shadow-sm">
                      Vitality
                    </div>
                  </div>
                  <div className="text-gray-300">
                    A name that reflects our commitment to quality and
                    performance in Java runtimes.
                  </div>
                </div>
              </div>
            </div>

            {/* AQAvit Project Central Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mt-24">
              <div className="order-2 md:order-1 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 group">
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 transform -rotate-1 shadow-lg border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/30">
                      <FaChartLine className="text-white text-lg" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">
                        Repository Hub
                      </div>
                      <div className="text-lg font-bold text-purple-300">
                        aqa-tests
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="bg-blue-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-blue-200 border border-blue-500/50 shadow-sm">
                      Test Definitions
                    </div>
                    <div className="bg-green-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-green-200 border border-green-500/50 shadow-sm">
                      Documentation
                    </div>
                    <div className="bg-amber-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-amber-200 border border-amber-500/50 shadow-sm">
                      Test Suite Base
                    </div>
                  </div>
                  <div className="text-gray-300 mb-4">
                    The central repository for AQAvit's test definitions,
                    documentation, and test suite resources.
                  </div>
                  <a
                    href="https://github.com/adoptium/aqa-tests"
                    target="_blank"
                    className="inline-flex items-center text-pink-300 hover:text-pink-200 transition-colors font-medium group"
                  >
                    View on GitHub{" "}
                    <FaArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="bg-purple-900/50 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/50 shadow-sm">
                  DEVELOPMENT
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
                  AQAvit Project Central
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  AQAvit is comprised of many repositories listed in the
                  Developer Resources section of the Eclipse Foundation AQAvit
                  project page. The central repository is{" "}
                  <span className="font-semibold text-purple-200">
                    aqa-tests
                  </span>
                  , which houses the project's test definition files,
                  documentation, and serves as the base for running the AQAvit
                  test suite.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  To participate in the project, join the Adoptium Slack
                  workspace and ask questions in the{" "}
                  <span className="font-semibold text-purple-200">
                    #testing-aqavit
                  </span>{" "}
                  channel.
                </p>
                <div className="mt-4 flex items-center">
                  <Link
                    to="/slack"
                    className="px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center border border-purple-500/30"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.687 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.687a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                    </svg>
                    Join Slack
                  </Link>
                  <a
                    href="https://projects.eclipse.org/projects/adoptium.aqavit"
                    target="_blank"
                    className="ml-4 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-base border border-white/20 hover:border-white/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                  >
                    <FaBullseye className="mr-2" />
                    View Project Page
                  </a>
                </div>
              </div>
            </div>

            {/* AQAvit Verification Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mt-24">
              <div>
                <span className="bg-pink-900/50 text-pink-200 text-xs font-semibold px-3 py-1 rounded-full border border-pink-500/50 shadow-sm">
                  VERIFICATION
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
                  AQAvit Verification
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  The AQAvit project was created to "make quality certain to
                  happen." AQAvit verification is achieved through the process
                  of running and passing a prescribed and versioned set of tests
                  in the AQAvit test suite.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  By running these tests, you can ensure your Java runtime meets
                  the high-quality standards required for production
                  environments.
                </p>
                <div className="mt-6">
                  <Link
                    to="/docs/aqavit-verification/"
                    className="group px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center w-fit"
                  >
                    <FaRocket className="text-xl mr-2 group-hover:animate-bounce" />
                    <span>Learn how to run AQAvit</span>
                    <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-40 animate-pulse"></div>
                <div className="relative bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20">
                  <div className="space-y-6 relative z-10">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/5 rounded-full filter blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-xl"></div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/60 ring-2 ring-pink-300/40">
                          <FaCheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          Functional Testing
                        </h3>
                        <p className="mt-2 text-base text-gray-300">
                          Validates core API functionality and behavior across
                          platforms
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/60 ring-2 ring-purple-300/40">
                          <FaCheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          Performance Testing
                        </h3>
                        <p className="mt-2 text-base text-gray-300">
                          Ensures runtime meets performance expectations under
                          various workloads
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/60 ring-2 ring-blue-300/40">
                          <FaCheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          Security Verification
                        </h3>
                        <p className="mt-2 text-base text-gray-300">
                          Tests security features and protections against common
                          vulnerabilities
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/60 ring-2 ring-green-300/40">
                          <FaCheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          Compatibility Verification
                        </h3>
                        <p className="mt-2 text-base text-gray-300">
                          Confirms compatibility with popular frameworks and
                          applications
                        </p>
                      </div>
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
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Start ensuring your Java runtime quality today
                    </h2>
                    <p className="text-lg text-white/80">
                      Join the community of developers and organizations who
                      rely on AQAvit to verify the quality and reliability of
                      their Java runtimes.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/docs/aqavit-verification/"
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                    >
                      <FaRocket className="mr-2" />
                      Run AQAvit
                    </Link>

                    <a
                      href="https://github.com/adoptium/aqa-tests"
                      target="_blank"
                      className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg border border-white/20 hover:border-white/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                    >
                      <FaCode className="mr-2" />
                      Explore Code
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#3E3355] opacity-50"></div>
    </Layout>
  )
}
export default AQAvit

export const Head = () => <Seo title="Eclipse AQAvit" />

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
