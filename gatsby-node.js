const path = require('path')
const fs = require('fs')
const { pipeline } = require('stream')
const { promisify } = require('util')
const { createFilePath } = require('gatsby-source-filesystem')
const locales = require('./locales/i18n')

const { localizedSlug, findKey, removeTrailingSlash } = require('./src/util/gatsby-node-helpers')

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  // First delete the incoming page that was automatically created by Gatsby
  // So everything in src/pages/
  // Don't do anything to the page if context has a language already set
  if (page.component.includes('mdx-docs') && page.context.locale === 'en') {
    // Grab the keys ('en' & 'de') of locales and map over them
    // eslint-disable-next-line array-callback-return
    Object.keys(locales).map(lang => {
      if (lang !== 'en' && !fs.existsSync(`./content/mdx-docs${page.path}index.${lang}.md`)) {
        // Use the values defined in "locales" to construct the path
        const localizedPath = locales[lang].default
          ? page.path
          : `${locales[lang].path}${page.path}`

        return createPage({
          // Pass on everything from the original page
          ...page,
          // Since page.path returns with a trailing slash (e.g. "/de/")
          // We want to remove that
          path: removeTrailingSlash(localizedPath),
          // Pass in the locale as context to every page
          // This context also gets passed to the src/components/layout file
          // This should ensure that the locale is available on every page
          context: {
            ...page.context,
            locale: 'en',
            language: lang,
            i18n: {
              ...page.context.i18n,
              routed: true,
              originalPath: page.path,
              path: removeTrailingSlash(localizedPath),
              language: lang
            }
          }
        })
      }
    })
  } else {
    deletePage(page)
  }

  return createPage({
    // Pass on everything from the original page
    ...page,
    // Pass in the locale as context to every page
    // This context also gets passed to the src/components/layout file
    // This should ensure that the locale is available on every page
    context: {
      ...page.context
    }
  })
}

exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    // Use path.basename
    // https://nodejs.org/api/path.html#path_path_basename_path_ext
    const name = path.basename(node.internal.contentFilePath, '.md')

    // Check if post.name is "index" -- because that's the file for default language
    // (In this case "en")
    const isDefault = name === 'index'

    // Find the key that has "default: true" set (in this case it returns "en")
    const defaultKey = findKey(locales, o => o.default === true)

    // Files are defined with "name-with-dashes.lang.md"
    // name returns "name-with-dashes.lang"
    // So grab the lang from that string
    // If it's the default language, pass the locale for that
    const lang = isDefault ? defaultKey : name.split('.')[1]

    createNodeField({ node, name: 'locale', value: lang })
    createNodeField({ node, name: 'isDefault', value: isDefault })

    const slug = createFilePath({ node, getNode })
    const date = new Date(node.frontmatter.date)
    const year = date.getFullYear()
    const zeroPaddedMonth = `${date.getMonth() + 1}`.padStart(2, '0')

    createNodeField({
      name: 'slug',
      node,
      value: slug
    })
    createNodeField({
      name: 'postPath',
      node,
      value: `/blog/${year}/${zeroPaddedMonth}${slug}`
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const templates = path.resolve(__dirname, './src/templates/')
  const authorPage = `${templates}/authorPage.tsx`
  const tagTemplate = `${templates}/tagPage.tsx`
  const blogPost = `${templates}/blogPost.tsx`
  const mdxdocTemplate = `${templates}/docsPage.tsx`

  // Create author pages
  const authorJson = require('./src/json/authors.json')

  for (const author of Object.keys(authorJson)) {
    fs.open(`./static/images/authors/${author}.jpg`, 'r', async function (err, fd) {
      if (err) {
        const githubUsername = authorJson[author].github
        const streamPipeline = promisify(pipeline)
        const response = await fetch(`https://github.com/${githubUsername}.png?size=250`)
        if (!response.ok) {
          throw new Error(`Unexpected response: ${response.statusText}`)
        }
        await streamPipeline(response.body, fs.createWriteStream(`./static/images/authors/${author}.jpg`))
      }
    })

    createPage({
      path: `/blog/author/${author}`,
      component: authorPage,
      context: {
        author,
        limit: 10
      }
    })
  }

  // Create MDX docs pages.
  const docsResults = await graphql(`
    {
      docs: allFile(filter: {
        sourceInstanceName: { eq: "mdx-docs" },
        childMdx: { internal: { type: { eq: "Mdx" } } }
      }) {
        edges {
          node {
            relativeDirectory
            relativePath
            childMdx {
              fields {
                locale
                isDefault
              }
              frontmatter {
                title
              }
              internal {
                contentFilePath
              }
            }
          }
        }
      }
    }
  `)

  if (docsResults.errors) {
    throw docsResults.errors
  }

  const docs = docsResults.data.docs.edges

  docs.forEach(({ node: doc }) => {
    const title = doc.childMdx.frontmatter.title
    const slug = doc.relativeDirectory
    const relativePath = doc.relativePath

    // Use the fields created in exports.onCreateNode
    const locale = doc.childMdx.fields.locale
    const isDefault = doc.childMdx.fields.isDefault

    createPage({
      path: localizedSlug({ isDefault, locale, slug }),
      component: `${mdxdocTemplate}?__contentFilePath=${doc.childMdx.internal.contentFilePath}`,
      context: {
        // Pass both the "title" and "locale" to find a unique file
        // Only the title would not have been sufficient as articles could have the same title
        // in different languages, e.g. because an english phrase is also common in german
        locale,
        title,
        relativePath
      }
    })
  })

  // Create blog posts pages.
  const blogPostResults = await graphql(
    `
      {
        allMdx(
          filter: {internal: {contentFilePath: { regex: "/blog/" }}}
          sort: {frontmatter: {date: DESC}}
        ) {
          edges {
            node {
              fields {
                slug
                postPath
              }
              frontmatter {
                title
                tags
              }
              internal {
                contentFilePath
              }
            }
          }
        }
        tagsGroup: allMdx(limit: 2000) {
          group(field: {frontmatter: {tags: SELECT}}) {
            fieldValue
          }
        }
      }
    `
  )

  if (blogPostResults.errors) {
    throw blogPostResults.errors
  }

  const posts = blogPostResults.data.allMdx.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: `${post.node.fields.postPath}`,
      component: `${blogPost}?__contentFilePath=${post.node.internal.contentFilePath}`,
      context: {
        slug: post.node.fields.slug,
        postPath: `${post.node.fields.postPath}`,
        previous,
        next
      }
    })
  })

  // Extract tag data from query
  const tags = blogPostResults.data.tagsGroup.group

  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/blog/tags/${tag.fieldValue}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue
      }
    })
  })

  const postsPerPage = 10
  const numPages = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: numPages }).forEach((_, index) => {
    const currentPageNumber = index + 1
    const previousPageNumber =
      currentPageNumber === 1 ? null : currentPageNumber - 1
    const nextPageNumber =
      currentPageNumber === numPages ? null : currentPageNumber + 1

    createPage({
      path: `/blog/page/${index + 1}`,
      component: path.resolve('./src/templates/blogPage.tsx'),
      context: {
        limit: postsPerPage,
        skip: index * postsPerPage,
        numPages,
        currentPageNumber,
        previousPageNumber,
        nextPageNumber
      }
    })
  })
}
