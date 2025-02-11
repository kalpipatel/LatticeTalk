import Link from "next/link";
import styles from "./Navbar.module.css";


export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      {/* LOGO - Top Left */}
      <Link href="/">
        <span className={styles.logo}>
           LatticeTalk
        </span>
      </Link>

      {/* Centered Navigation Links */}
      <div className={styles.navlinks}>
        <Link href="/features">
          <span className={styles.navlink}>Features</span>
        </Link>
        <Link href="/about">
          <span className={styles.navlink}>About Us</span>
        </Link>
      </div>
    </nav>
  );
}
