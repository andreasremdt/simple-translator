import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import * as styles from './sidebar.module.css';

const TUTORIAL = 'sidebar.tutorial.open';
const EXAMPLES = 'sidebar.examples.open';

const Sidebar = () => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);

  useEffect(() => {
    setIsTutorialOpen(Boolean(Number(localStorage.getItem(TUTORIAL))));
    setIsExamplesOpen(Boolean(Number(localStorage.getItem(EXAMPLES))));
  }, []);

  return (
    <nav className={styles.container}>
      <span className={styles.title}>Simple Translator</span>

      <Link className={styles.link} activeClassName={styles.active} to="/">
        Home
      </Link>
      <Link
        className={styles.link}
        activeClassName={styles.active}
        to="/quickstart/"
      >
        Quickstart
      </Link>
      <details className={styles.details} open={isTutorialOpen}>
        <summary
          className={styles.summary}
          onClick={() => {
            localStorage.setItem(TUTORIAL, isTutorialOpen ? '0' : '1');
          }}
        >
          Tutorial
        </summary>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/tutorial/01/"
        >
          01 - Introduction
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/tutorial/02/"
        >
          02 - Preparing the HTML
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/tutorial/03/"
        >
          03 - Configuration
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/tutorial/04/"
        >
          04 - Preparing Translations
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/tutorial/05/"
        >
          05 - Translation in HTML
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/tutorial/06/"
        >
          06 - Translation in JavaScript
        </Link>
      </details>
      <details className={styles.details} open={isExamplesOpen}>
        <summary
          className={styles.summary}
          onClick={() => {
            localStorage.setItem(EXAMPLES, isExamplesOpen ? '0' : '1');
          }}
        >
          Examples
        </summary>

        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/examples/react/"
        >
          React
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/examples/vue/"
        >
          Vue
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/examples/vanilla/"
        >
          Vanilla JavaScript
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/examples/web-components/"
        >
          Web Components
        </Link>
        <Link
          className={styles.link}
          activeClassName={styles.active}
          to="/examples/node/"
        >
          Node.js
        </Link>
      </details>
      <Link className={styles.link} activeClassName={styles.active} to="/api/">
        API Reference
      </Link>
      <Link
        className={styles.link}
        activeClassName={styles.active}
        to="/errors/"
      >
        Error Reference
      </Link>
    </nav>
  );
};

export default Sidebar;
