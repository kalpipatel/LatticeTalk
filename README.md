This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview
LatticeTalk is a secure messaging application that leverages lattice-based cryptography to provide post-quantum secure communication. It offers end-to-end encryption that is resistant to quantum attacks, making it future-proof for secure messaging.

## Features

- Post Quantum Security: We use lattice-based cryptography for our encryption system. 
- Real-Time Messaging: LatticeTalk offers secure communication with a responsive UI
- End-to-end Encryption: Ensures message confidentiality
- Digital Signatures: LatticeTalk verifies message authenticity to ensure message integrity


## Tech Stack 

The tech stack LatticeTalk is built with:
- Frontend: Next.js, React, TypeScript
- Backend: Node.js, Socket.io
- Database: MongoDB
- Cryptography: lattice-based encryption (CRYSTALS-Kyber for general encryption, CRYSTALS-Dilithium for digital signing)

## Setup

Running the Project
1. Install dependencies with "npm install"
1. To start server: "npm run start-socket" 
2. "npm run dev"
This will start the application on http://localhost:3000
