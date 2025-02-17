"use client";

import styles from "./features.module.css";

export default function Features() {
  return (
    <div className={styles.featuresPage}> 
      <h1>Features Page</h1>
      <div className={styles.featuresWrapper}>
        <div className={styles.featureBox}>Feature 1: Description about the project.</div>
        <div className={styles.featureBox}>Feature 2: More details about what it does.</div>
        <div className={styles.featureBox}>Feature 3: Final information.</div>
      </div>
    </div>
  );
}

