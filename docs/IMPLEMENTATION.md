# Secure Message Application - Implementation Documentation

## Overview

This document describes the implementation of the Secure Message Application (SMA), a full-stack application that provides cryptographic operations for secure message management. The application consists of a NestJS backend API and a React + Vite frontend.

## Architecture

The application follows a client-server architecture:

- **Backend**: NestJS REST API running on port 3000
- **Frontend**: React + Vite application running on port 5173
- **Communication**: HTTP REST API with JSON payloads

## Backend Implementation

### Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer
- **Cryptography**: Node.js built-in `crypto` module

### Project Structure

```
backend/
├── src/
│   ├── crypto/
│   │   ├── crypto.module.ts
│   │   ├── crypto.service.ts
│   │   ├── crypto.controller.ts
│   │   └── dto/
│   │       ├── encrypt-request.dto.ts
│   │       ├── decrypt-request.dto.ts
│   │       ├── sign-request.dto.ts
│   │       ├── verify-request.dto.ts
│   │       └── hash-request.dto.ts
│   ├── messages/
│   │   ├── messages.module.ts
│   │   ├── messages.service.ts
│   │   ├── messages.controller.ts
│   │   └── dto/
│   │       └── create-message.dto.ts
│   ├── app.module.ts
│   └── main.ts
```

### Crypto Module

The crypto module provides all cryptographic operations:

#### CryptoService

**Encryption Algorithm**: AES-256-GCM (Advanced Encryption Standard with Galois/Counter Mode)
- **Key Length**: 256 bits (32 bytes)
- **IV Length**: 12 bytes (96 bits) - standard for GCM mode
- **Key Derivation**: SHA-256 hash of environment variable `AES_SECRET_KEY` or default fallback
- **Output Format**: Base64-encoded ciphertext, IV, and authentication tag

**Digital Signature Algorithm**: RSA-2048 with SHA-256
- **Key Length**: 2048 bits (meets security requirements)
- **Padding**: PKCS#1 v1.5 (default for RSA-SHA256)
- **Key Generation**: RSA key pair generated at service initialization
- **Output Format**: Base64-encoded signature

**Hashing Algorithm**: SHA-256 (Secure Hash Algorithm 256-bit)
- **Algorithm**: SHA-256
- **Output Format**: Hexadecimal string (64 characters)
- **Properties**: Collision-resistant, one-way function

#### API Endpoints

1. **POST /crypto/encrypt**
   - Request: `{ message: string }`
   - Response: `{ ciphertext: string, iv: string, authTag: string }`

2. **POST /crypto/decrypt**
   - Request: `{ ciphertext: string, iv: string, authTag: string }`
   - Response: `{ plaintext: string }`

3. **POST /crypto/sign**
   - Request: `{ message: string }`
   - Response: `{ signature: string }`

4. **POST /crypto/verify**
   - Request: `{ message: string, signature: string }`
   - Response: `{ isValid: boolean }`

5. **POST /crypto/hash**
   - Request: `{ message: string }`
   - Response: `{ hash: string }`

6. **GET /crypto/public-key**
   - Response: `{ publicKey: string }`

### Messages Module

The messages module handles secure message storage and retrieval:

#### MessagesService

- **Storage**: In-memory array (messages persist for the lifetime of the server)
- **Operations**: 
  - Creates messages with encryption, signing, and hashing
  - Retrieves all stored messages

#### Message Record Structure

```typescript
{
  id: string;
  sender: string;
  recipient: string;
  message: string; // Original plaintext (for demo purposes)
  encrypted: {
    ciphertext: string;
    iv: string;
    authTag: string;
  };
  signature: string;
  hash: string;
  createdAt: Date;
}
```

#### API Endpoints

1. **POST /messages**
   - Request: `{ sender: string, recipient: string, message: string }`
   - Response: Complete message record with cryptographic data

2. **GET /messages**
   - Response: Array of all stored message records

### Security Features

1. **CORS**: Enabled for frontend origin (http://localhost:5173)
2. **Validation**: All DTOs validated using class-validator
3. **Key Management**: 
   - AES key derived from environment variable or fallback
   - RSA key pair generated at startup (same keys for all operations)
4. **Authentication Tag**: GCM mode provides authentication, preventing tampering

## Frontend Implementation

### Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API

### Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts
│   ├── components/
│   │   ├── MessageForm.tsx
│   │   ├── MessagesList.tsx
│   │   └── UtilityCard.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

### Components

#### App.tsx
Main application component that orchestrates all features:
- Message sending form
- Messages list display
- Cryptographic utility cards

#### MessageForm.tsx
Form component for sending secure messages:
- Input fields for sender, recipient, and message
- Form validation
- Success/error feedback
- Calls API to create and store messages

#### MessagesList.tsx
Displays all stored messages:
- Auto-refreshes every 2 seconds
- Shows message metadata (sender, recipient, timestamp)
- Displays cryptographic data (hash, signature, encrypted payload)
- Responsive grid layout

#### UtilityCard.tsx
Reusable component for cryptographic operations:
- Generic input/output interface
- Loading states
- Error handling
- Supports multiple operations (hash, encrypt, decrypt, sign, verify)

### API Client

Centralized API client (`src/api/client.ts`) provides typed functions for all backend endpoints:
- Type-safe request/response interfaces
- Error handling
- Consistent fetch configuration

## Cryptographic Algorithms Summary

### Hashing Algorithm: SHA-256

**Selection**: SHA-256 was chosen as the hashing algorithm.

**Rationale**:
- Industry-standard secure hash algorithm
- Part of the SHA-2 family, widely adopted and trusted
- Produces 256-bit (32-byte) hash values
- Collision-resistant and cryptographically secure
- Supported natively by Node.js crypto module
- Meets project requirements for secure hash functions

**Implementation**:
```typescript
hash(message: string): string {
  return createHash('sha256').update(message).digest('hex');
}
```

**Usage**: Applied to all messages for integrity verification and quick comparison.

### Encryption Algorithm: AES-256-GCM

- Symmetric encryption
- 256-bit key length
- Authenticated encryption (prevents tampering)
- IV-based (nonce) for uniqueness

### Digital Signature Algorithm: RSA-2048

- Asymmetric cryptography
- 2048-bit key length (meets security requirements)
- SHA-256 for message digest
- Provides non-repudiation

## Running the Application

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Features Implemented

✅ Message Encryption (AES-256-GCM)
✅ Message Decryption (AES-256-GCM)
✅ Digital Signing (RSA-2048)
✅ Signature Verification (RSA-2048)
✅ Message Hashing (SHA-256)
✅ Message Storage and Retrieval
✅ Web-based User Interface
✅ Multi-line Message Support
✅ Real-time Message Updates

## Security Considerations

1. **Key Management**: In production, implement proper key management (HSM, key rotation)
2. **Storage**: Current implementation uses in-memory storage; consider persistent database with encryption
3. **HTTPS**: Use HTTPS in production to protect data in transit
4. **Key Derivation**: AES key derivation from environment variable is acceptable for demo; use proper key derivation (PBKDF2, Argon2) in production
5. **RSA Key Storage**: Current implementation generates keys at startup; in production, store keys securely and rotate regularly

## Future Enhancements

- Persistent database storage
- User authentication and authorization
- Key management system
- Message expiration
- End-to-end encryption between users
- Message search and filtering
- Export/import functionality

