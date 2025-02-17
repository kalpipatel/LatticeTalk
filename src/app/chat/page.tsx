import React from 'react';
import styles from './chat.module.css';

const ChatPage = () => {
  return (
    <div className={styles.chatContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarItem}>Search</div>
        <div className={styles.sidebarItem}>Contacts</div>
        <div className={styles.sidebarItem}>Settings</div>
      </div>

      {/* Main Chat Section */}
      <div className={styles.chatRoom}>
        <h2 className={styles.chatHeader}>Chat Room</h2>
        
        {/* Chat Messages */}
        <div className={styles.messages}>
          <div className={styles.friendMessage}>Friend msg</div>
          <div className={styles.friendMessage}>Friend msg</div>
          <div className={styles.friendMessage}>Friend msg</div>
          <div className={styles.myMessage}>My msg</div>
          <div className={styles.myMessage}>My msg</div>
        </div>

        {/* Chat Input */}
        <div className={styles.chatInputContainer}>
          <input className={styles.chatInput} type="text" placeholder="Chatbar: type message here" />
          <button className={styles.sendButton}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
