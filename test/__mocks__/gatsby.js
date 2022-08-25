const gatsby = jest.requireActual('gatsby')

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  useStaticQuery: jest.fn().mockReturnValue({
    site: {
      siteMetadata: {
        title: 'Sample Title',
        description: 'Sample Description'
      }
    }
  })
}
