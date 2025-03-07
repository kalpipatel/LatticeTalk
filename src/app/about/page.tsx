import styles from "./about.module.css";
export default function AboutUs() {
  return (
    <div className={styles.aboutUsPage}>
    <div className={styles.aboutUsWrapper}> 
      <div className={styles.aboutUsBox}>
        <h1>About Us</h1>
        <p>Welcome to LatticeTalks, the next generation of secure communication. In an era where quantum computing threatens traditional encryption, we’re pioneering the future with lattice-based post-quantum encryption—a cutting-edge cryptographic approach designed to withstand even the most powerful quantum attacks.
Our mission is simple: to ensure absolute privacy in an evolving digital landscape. Whether you're an individual, business, or organization, LatticeTalks provides a seamless and ultra-secure messaging experience, safeguarding your conversations from cyber threats, surveillance, and future technological advancements.
With end-to-end encryption, zero-knowledge security principles, and state-of-the-art cryptographic protocols, LatticeTalks is more than just a chat app—it’s a guarantee of privacy in the quantum era.
Join us in shaping the future of secure communication. Because at LatticeTalks, your privacy is unbreakable.</p>
</div>



<div className={styles.aboutUsBox}>

<h1>The Creators</h1>
<ul >
<li>Kalpi</li>
<li>Aadi</li>
<li>Sehee</li>
<li>Cameron</li>
<li>Joshua</li>
<li>Teja</li>
</ul>
</div>

</div>
  </div>


  );
}
