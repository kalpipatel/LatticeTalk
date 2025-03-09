"use client";

import React from "react";
import styles from "./features.module.css";

export default function Features() {
  return (
    <div className={styles.page}>
      {/* Animated Background */}
      <div className={styles.animatedGrid}></div>

      {/* Features Content */}
      <div className={styles.featuresContainer}>
        <div className={styles.featuresPage}>
          <h1 className={styles.featuresTitle}>Why Choose LatticeTalk?</h1>
          <p className={styles.featuresIntro}>
            LatticeTalk is designed with cutting-edge security and ease of use in mind.
            Our platform leverages post-quantum cryptography to ensure your messages remain
            protected from evolving cyber threats.
          </p>

          {/* Features Overview */}
          <div className={styles.featuresOverview}>
           
          </div>

          {/* Features Grid */}
          <div className={styles.featuresWrapper}>
            <div className={styles.featureBox}>
              <h2>🔐 Post-Quantum Encryption</h2>
              <p>
                We use lattice-based cryptography to safeguard your messages even against
                the most advanced quantum computers.
              </p>
            </div>
            <div className={styles.featureBox}>
              <h2>📡 End-to-End Security</h2>
              <p>
                Your conversations are fully encrypted from sender to receiver, ensuring
                absolute privacy.
              </p>
            </div>
            <div className={styles.featureBox}>
              <h2>💬 Speech-to-Text</h2>
              <p>
              LatticeTalk's speech-to-text feature converts spoken words into encrypted text in real time for secure and effortless communication.
              </p>
            </div>
            <div className={styles.featureBox}>
              <h2>⚡ Fast & Efficient</h2>
              <p >
                Our lattice-based encryption system is designed to provide maximum security without slowing you down.
                Enjoy fast messaging without compromising on safety.
              </p>
            </div>
            <div className={styles.featureBox}>
              <h2>⏳ Real-Time Messaging</h2>
              <p>
              Real-time messaging in LatticeTalk enables instant, secure communication using post-quantum encryption for privacy and speed.
              </p>
            </div>
            <div className={styles.featureBox}>
              <h2>🔄 Regular Security Audits</h2>
              <p>
                We continuously audit our cryptographic protocols to ensure they meet the highest standards.
                Your security is our top priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}