import React from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Sidebar from "./sidebar";
import PageHeader from "./page-header";
import * as styles from "./layout.module.css";

const Layout = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <meta name="author" content="Andreas Remdt" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400&display=swap"
        />
      </Helmet>
      <Sidebar />
      <main className={styles.main}>
        <PageHeader title={frontmatter.title}>
          {frontmatter.description}
        </PageHeader>
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
      </main>
    </div>
  );
};

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
      }
    }
  }
`;

export default Layout;
