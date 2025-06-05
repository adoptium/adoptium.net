import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Link } from "../../Link"
import RelatedArticleCard from "./RelatedArticleCard"

const RelatedArticle = () => {
  const data = useStaticQuery(graphql`
    {
      allMdx(limit: 3, sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            excerpt
            frontmatter {
              title
              description
              tags
              date(formatString: "MMMM DD, YYYY")
              featuredImage {
              childImageSharp {
                gatsbyImageData(layout: FIXED)
              }
            }
            }
            fields {
              postPath
              generatedFeaturedImage
            }
          }
        }
      }
    }
  `)
  return (
    <div className="max-w-[1264px] px-6 mx-auto py-8 md:py-16">
      <div className="max-w-[670px] mx-auto flex flex-col items-center justify-center">
        <div className="text-5xl leading-[116%] text-white text-center font-semibold">
          Related Articles
        </div>
        <div className="text-lightgrey mt-6 tab-button-text text-center">
          Eclipse Temurin offers high-performance, cross-platform, open-source
          Java runtime binaries that are enterprise-ready and Java SE TCK-tested
          for general use in the Java ecosystem.
        </div>
        <Link to="/news">
          <button className="rounded-2xl bg-transparent gradient-border mt-10 border-2 border-pink-500/0 text-white text-base leading-6 font-bold w-[160px] h-[48px] block ">
            See all articles
          </button>
        </Link>
      </div>

      <div className="flex justify-center flex-wrap items-center gap-5 pt-16">
        {data.allMdx.edges.map((card, index) => (
          <RelatedArticleCard
            key={index}
            data={card}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedArticle