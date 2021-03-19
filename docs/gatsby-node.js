exports.createPages = async ({ actions, graphql, reporter }) => {
  const template = require.resolve("./src/components/layout.jsx");
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              slug
              title
              description
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    if (node.frontmatter?.slug) {
      actions.createPage({
        path: node.frontmatter.slug,
        component: template,
        context: {
          slug: node.frontmatter.slug,
          title: node.frontmatter.title,
          description: node.frontmatter.description,
        },
      });
    }
  });
};
