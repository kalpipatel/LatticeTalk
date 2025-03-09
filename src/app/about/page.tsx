// import styles from "./about.module.css";
// export default function AboutUs() {
//   return (
//     <div className={styles.aboutUsPage}>
//     <div className={styles.aboutUsWrapper}> 
//       <div className={styles.aboutUsBox}>
//         <h1>About Us</h1>
//         <p>Welcome to LatticeTalks, the next generation of secure communication. In an era where quantum computing threatens traditional encryption, we’re pioneering the future with lattice-based post-quantum encryption—a cutting-edge cryptographic approach designed to withstand even the most powerful quantum attacks.
// Our mission is simple: to ensure absolute privacy in an evolving digital landscape. Whether you're an individual, business, or organization, LatticeTalks provides a seamless and ultra-secure messaging experience, safeguarding your conversations from cyber threats, surveillance, and future technological advancements.
// With end-to-end encryption, zero-knowledge security principles, and state-of-the-art cryptographic protocols, LatticeTalks is more than just a chat app—it’s a guarantee of privacy in the quantum era.
// Join us in shaping the future of secure communication. Because at LatticeTalks, your privacy is unbreakable.</p>
// </div>



// <div className={styles.aboutUsBox}>

// <h1>The Creators</h1>
// <ul >
// <li>Kalpi</li>
// <li>Aadi</li>
// <li>Sehee</li>
// <li>Cameron</li>
// <li>Joshua</li>
// <li>Teja</li>
// </ul>
// </div>

// </div>
//   </div>


//   );
// }

// import styles from "./about.module.css";

// export default function AboutUs() {
//   return (
//     <div className={styles.aboutUsPage}>
//       <div className={styles.aboutUsWrapper}>
//         <div className={styles.aboutUsBox}>
//           <h1>About LatticeTalks</h1>
//           <p>
//             Welcome to <strong>LatticeTalks</strong>, the future of secure communication.
//             In an era where quantum computing threatens traditional encryption,
//             we are pioneering next-generation security with <strong>lattice-based
//             post-quantum encryption</strong>. Our cutting-edge cryptographic
//             approach is designed to withstand even the most advanced quantum
//             attacks.
//           </p>
//           <p>
//             Whether you are an individual, business, or organization, LatticeTalks
//             provides an ultra-secure and seamless messaging experience. Our mission
//             is simple: <strong>to protect your privacy in an evolving digital
//             landscape</strong>. With end-to-end encryption, zero-knowledge
//             security principles, and state-of-the-art cryptographic protocols,
//             LatticeTalks is more than just a chat app—it is a <strong>guarantee
//             of privacy in the quantum era.</strong>
//           </p>
//         </div>

//         <div className={styles.aboutUsBox}>
//           <h1>Why Choose Us?</h1>
//           <ul className={styles.featuresList}>
//             <li>
//               <strong>Post-Quantum Security:</strong> Lattice-based encryption
//               ensures your messages remain secure against future quantum attacks.
//             </li>
//             <li>
//               <strong>End-to-End Encryption:</strong> Only you and your recipient
//               can read your messages—no middleman, no compromises.
//             </li>
//             <li>
//               <strong>Zero-Knowledge Architecture:</strong> We do not store your
//               messages or personal data, ensuring complete privacy.
//             </li>
//             <li>
//               <strong>Open-Source & Transparent:</strong> Our cryptographic
//               protocols are backed by research and open for security audits.
//             </li>
//           </ul>
//         </div>

//         <div className={styles.aboutUsBox}>
//           <h1>Meet the Team</h1>
//           <p>
//             LatticeTalks is built by a passionate team of developers and
//             cryptography enthusiasts, dedicated to creating the most secure
//             communication platform of the future.
//           </p>
//           <div className={styles.teamGrid}>
//             <span>Kalpi</span>
//             <span>Aadi</span>
//             <span>Sehee</span>
//             <span>Cameron</span>
//             <span>Joshua</span>
//             <span>Teja</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// about.tsx
import styles from "./about.module.css";

export default function AboutUs() {
  return (
    <div className={styles.aboutUsPage}>
      {/* Animated Background */}
      <div className={styles.animatedGrid}></div>

      <div className={styles.aboutUsWrapper}>
        <div className={styles.aboutUsBox}>
          <h1>About LatticeTalks</h1>
          <p>
            Welcome to <strong>LatticeTalks</strong>, the future of secure communication.
            In an era where quantum computing threatens traditional encryption,
            we are pioneering next-generation security with <strong>lattice-based
            post-quantum encryption</strong>. Our cutting-edge cryptographic
            approach is designed to withstand even the most advanced quantum
            attacks.
          </p>
          <p>
            Whether you are an individual, business, or organization, LatticeTalks
            provides an ultra-secure and seamless messaging experience. Our mission
            is simple: <strong>to protect your privacy in an evolving digital
            landscape</strong>. With end-to-end encryption and state-of-the-art cryptographic protocols,
            LatticeTalks is more than just a chat app—it is a <strong>guarantee
            of privacy in the quantum era.</strong>
          </p>
        </div>

        <div className={styles.aboutUsBox}>
          <h1>Why Choose Us?</h1>
          <ul className={styles.featuresList}>
            <li>
              <strong>Post-Quantum Security:</strong> Lattice-based encryption
              ensures your messages remain secure against future quantum attacks.
            </li>
            <li>
              <strong>End-to-End Encryption:</strong> Only you and your recipient
              can read your messages—no middleman, no compromises.
            </li>
            <li>
              <strong>Open-Source & Transparent:</strong> Our cryptographic
              protocols are backed by research and open for security audits.
            </li>
          </ul>
        </div>

        <div className={styles.aboutUsBox}>
          <h1>Meet the Team</h1>
          <p>
            LatticeTalks is built by a passionate team of developers and
            cryptography enthusiasts, dedicated to creating the most secure
            communication platform of the future.
          </p>
          <div className={styles.teamGrid}>
            <span>Kalpi</span>
            <span>Aadi</span>
            <span>Sehee</span>
            <span>Cameron</span>
            <span>Joshua</span>
            <span>Teja</span>
          </div>
        </div>
      </div>
    </div>
  );
}
