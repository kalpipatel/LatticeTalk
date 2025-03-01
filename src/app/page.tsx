// pages/page.tsx
import Link from 'next/link';  // Import the Link component
import Image from "next/image";
import styles from "./page.module.css"; // Importing CSS module

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Animated Background */}
      <div className={styles.animatedGrid}></div>
      
      {/* Navbar (empty or custom content) */}
      <nav className={styles.navbar}>
        {/* You can add your own links or content here */}
      </nav>

      {/* Login box */}
      <div className={styles["login-container"]}>
        <div className={styles["login-shadow"]}></div>
        <div className={styles["login-box"]}>
          <h2 className={styles["login-title"]}>Login</h2>
          <input className={styles["login-input"]} type="text" placeholder="Username" />
          <input className={styles["login-input"]} type="password" placeholder="Password" />
          <button className={styles["login-input"]}>Submit</button>
        </div>
      </div>

      {/* Navigation link to the chat page */}
      <div className={styles["chat-link-container"]}>
        <Link href="/chat">
          <button className={styles["chat-button"]}>
            Go to Chat (Temp)
          </button>
        </Link>
      </div>
    </div>
  );
}
