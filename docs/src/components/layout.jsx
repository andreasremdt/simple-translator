import React from 'react';
import { Link, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Sidebar from './sidebar';
import PageHeader from './page-header';
import * as styles from './layout.module.css';

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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap"
        />
      </Helmet>
      <Sidebar />
      <main className={styles.main}>
        <PageHeader title={frontmatter.title}>
          {frontmatter.description}
        </PageHeader>
        <div dangerouslySetInnerHTML={{ __html: html }}></div>

        {(frontmatter.prev_link || frontmatter.next_link) && (
          <footer className={styles.footer}>
            {frontmatter.prev_link && (
              <Link to={frontmatter.prev_link} className={styles.button}>
                &laquo; Previous
              </Link>
            )}
            {frontmatter.next_link && (
              <Link to={frontmatter.next_link} className={styles.button}>
                Next &raquo;
              </Link>
            )}
          </footer>
        )}
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
        prev_link
        next_link
      }
    }
  }
`;

export default Layout;
