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
    console.log("Sign-in successful:", data); 
  } catch (error) {
    console.log("Error sign in failed");
  }
};

 const postSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null); 

  const endpoint = `/api/users`;
  const payload = { username, email, password };

  try {
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
              <button onClick={() => setSignIn(!isSignIn)}> Sign Up ? </button>
            ) : (
              <button onClick={() => setSignIn(!isSignIn)}> Sign In ? </button>
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
            <button className={styles["login-input"]}>Submit</button>
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
            <button className={styles["login-input"]}>Submit</button>
            </form>
            )
          }
        </div>
      </div>

      {/* Navigation link to the chat page */}
      <div className={styles["chat-link-container"]}>
        <Link href="/chat">
          <button className={styles["chat-button"]}>Go to Chat (Temp)</button>
        </Link>
      </div>
    </div>
  );
}
