"use client";
// pages/page.tsx
import Link from 'next/link';
import Image from "next/image";
import styles from "./page.module.css";
import React from 'react';


import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isSignIn, setSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const getSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const endpoint = `/api/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    router.push("/chat");
    console.log("Sign-in successful:", data); 
    
    router.push("/chat")
    
  } catch (error) {
    console.log("Error sign in failed");
  }
};const postSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null); // Clear previous errors

  // These values are for demonstration; they're also set by default on the backend if omitted.
  const kyberPub = "1";  
  const kyberPriv = "2"; 
  const signPub = "3";   
  const signPriv = "4";  

  // Point directly to the backend running on port 3001
  //const endpoint = "http://localhost:3001/api/users";
  const endpoint = "/api/users";
  const payload = { username, email, password, kyberPub, kyberPriv, signPub, signPriv };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username, email, password}),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to sign up");
    }

    console.log("Sign-up successful:", data);
    alert("Sign-up successful! You can now log in.");
  } catch (error) {
    console.log("Error sign-up failed:", error);
  }
};

  return (
    <div className={styles.page}>
      {/* Animated Background */}
      <div className={styles.animatedGrid}></div>
      
      {/* Navbar */}
      <nav className={styles.navbar}>
        {/* Add your own links or content here */}
      </nav>

      {/* Login box */}
      <div className={styles["login-container"]}>
        <div className={styles["login-shadow"]}></div>
       <div>
  {
    isSignIn ? (
      <button className={styles['toggle-button']} onClick={() => setSignIn(false)}> Sign Up </button>
    ) : (
      <button className={styles['toggle-button']} onClick={() => setSignIn(true)}> Sign In </button>
    )
  }
</div>

        <div className={styles["login-box"]}>
          {
            isSignIn ? (
              <form onSubmit={getSubmit}>
              <h2 className={styles["login-title"]}>Login</h2>
              <input 
              className={styles["login-input"]} 
              type="text" 
              required 
              onChange={(e) => setUsername(e.target.value)} 
              value={username} 
              placeholder="Username" 
              />
              <input 
              className={styles["login-input"]} 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Password" 
              />
            <button className={styles["toggle-button"]}>Submit</button>
                </form>
                
            ) : (
                <form onSubmit={postSubmit}>
                <h2 className={styles["login-title"]}>Sign Up</h2>
              
                  <input 
              className={styles["login-input"]} 
              type="text" 
              required 
              onChange={(e) => setUsername(e.target.value)} 
              value={username} 
              placeholder="Username" 
                  />
                  <input 
              className={styles["login-input"]} 
              type="text" 
              required 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              placeholder="Email" 
              />
              <input 
              className={styles["login-input"]} 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Password" 
              />
            <button className={styles["toggle-button"]}>Submit</button>
            </form>
            )
          }
        </div>
      </div>

      {/* Navigation link to the chat page */}
      <div className={styles["chat-link-container"]}>
        <Link href="/chat">
          <button className={styles['toggle-button']}>Go to Chat (Temp)</button>
        </Link>
      </div>
    </div>
  );
}