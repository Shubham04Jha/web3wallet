#Preview

## add password
<img width="923" height="529" alt="image" src="https://github.com/user-attachments/assets/44e20d2f-a18d-4388-a233-302fe9fa5046" />
## generate or import seed
<img width="907" height="532" alt="image" src="https://github.com/user-attachments/assets/2fc77648-229e-4c43-ab86-c80a6712ff85" />

<img width="921" height="537" alt="image" src="https://github.com/user-attachments/assets/77a89f0d-9734-4270-9826-b0bab135f783" />

## confirmation before showing sensitive info:
<img width="924" height="531" alt="image" src="https://github.com/user-attachments/assets/a3f3be2d-afc5-4c61-8770-f64b0511a776" />
<img width="910" height="532" alt="image" src="https://github.com/user-attachments/assets/e6c582f4-6ad0-4a0e-8bb1-a18bd1ac0459" />
<img width="918" height="529" alt="image" src="https://github.com/user-attachments/assets/22f0e087-40aa-4867-ba51-c0c83fc464e8" />
<img width="925" height="533" alt="image" src="https://github.com/user-attachments/assets/8a445227-24e1-4003-b6e7-563ba5316786" />

## click to copy: 
<img width="907" height="531" alt="image" src="https://github.com/user-attachments/assets/5499fc51-714f-4a37-90d2-1be81ce6f71d" />

## delete wallet confirmation:
<img width="925" height="534" alt="image" src="https://github.com/user-attachments/assets/89179b5e-26e4-48b5-ad78-cba31ccddc43" />


All the information is stored locally for persistence.
## Used crypto.subtle to handle encryption and decryption using browser's native crypto capabilities.
<img width="921" height="533" alt="image" src="https://github.com/user-attachments/assets/219e399a-0010-47cc-afe1-2dba3b0509fc" />





## Features

- HD wallet generation using BIP39 mnemonics
- Seed phrase import or generation
- Password-protected wallet access
- Encrypted local persistence
- On-demand private key decryption
- Confirmation dialogs before sensitive actions
- Copy-to-clipboard utilities
- Wallet addition and deletion support
- Local-only storage, no backend dependency

---

## Security Model

### Encryption Pipeline
- Password-derived encryption keys using PBKDF2 (SHA-256, 100k iterations)
- AES-GCM encryption for confidentiality and integrity
- Unique IV generated per encryption operation

### Storage Design
Only encrypted information is persisted in `localStorage`:
- Salt
- Initialization Vector (IV)
- Ciphertext

No seed phrases or private keys are stored in plaintext.

### Memory Handling
- Crypto keys remain only in memory during session
- Refresh or logout clears access automatically
- Secrets are decrypted only when explicitly requested

---

## Architecture Overview

### Global Wallet Store
A centralized in-memory store synchronizes encrypted data with `localStorage`.

- Atomic state updates
- Read-only UI access
- Controlled update functions
- Automatic persistence syncing

### Encoding Strategy
- Binary data encoded as Base64 for storage
- Text handled using UTF-8 encoding via `TextEncoder`

---

## Tech Stack

- TypeScript
- Web Crypto API (`crypto.subtle`)
- Browser LocalStorage
- React UI
- BIP39 mnemonic generation

---

## Design Decisions

- Avoided Web Workers since `SubtleCrypto` already runs asynchronously
- Removed multi-password scheme to avoid security theater
- Balanced UX and security by keeping keys in memory only
- Added confirmation flows before revealing sensitive data
- Implemented singleton-style store for centralized wallet state

---

## Future Improvements

- Persistent storage integrity verification (HMAC)
- Multi-account derivation support
- Transaction signing workflow
- Wallet export/import flows
- Hardware wallet integration
- Backup and recovery enhancements

---

## Disclaimer

This wallet is an experimental learning project and has not undergone formal security audits. Use cautiously for real assets.

---
