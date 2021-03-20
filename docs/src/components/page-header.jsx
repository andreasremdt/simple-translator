import React from 'react';
import * as styles from './page-header.module.css';

const PageHeader = ({ title, children }) => (
  <header>
    <h1>{title}</h1>
    <p className={styles.description}>{children}</p>
  </header>
);

export default PageHeader;
