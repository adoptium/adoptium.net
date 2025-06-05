import React from "react"
import { Link } from "../../Link"
import { capitalize } from "../../../util/capitalize"

const RelatedArticleCard = ({data}) => {
  const title = data.node.frontmatter.title
  const tags = data.node.frontmatter.tags
  const date = data.node.frontmatter.date
  const postPath = data.node.fields.postPath
  return (
    <div className="flex flex-col max-w-[392px] newscard-2 bg-[#200D46] p-6">
      <div className="relative">
        {data.node.frontmatter.featuredImage ? (
            <img className="rounded-3xl" src={data.node.frontmatter.featuredImage.childImageSharp.gatsbyImageData.images.fallback.src} alt="blog banner image" />
        ) : (
            <img className="rounded-3xl" src={data.node.fields.generatedFeaturedImage} alt="blog banner image" />
        )}
        {tags && tags.length > 0 && (
        <button className="text-[12px] font-semibold  leading-[33.333%] bg-[#3E3355] rounded-[80px] px-4 py-4 absolute top-3 right-4">
          {capitalize(tags[0])}
        </button>
        )}
      </div>
      <h2 className="text-[20px] font-semibold text-white leading-[140%] mb-0 pb-5">
        {title}{" "}
      </h2>
      <p>{date}</p>
      <span className="text-sm">{data.node.excerpt}</span>
      <Link
        to={postPath}
        className="py-3 text-base underline font-bold leading-6 text-white mt-4 block border-white w-fit"
      >
        Read More
      </Link>
    </div>
  )
}

export default RelatedArticleCard