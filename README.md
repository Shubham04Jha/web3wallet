Web Wallet Architecture & Security Model
The Objective
To build a secure, browser-based wallet that handles seed phrases and key-pair derivation without ever storing secrets in plain text. The goal is to leverage the window.crypto.subtle API to ensure that even if someone gains access to the physical device's local storage, the data remains a useless collection of ciphertexts without the master password.

Current Design Pattern
I've settled on a Module-Level Singleton pattern for security and state management.

1. Encryption Strategy
Key Derivation: We use PBKDF2 with 100,000 iterations (SHA-256) to turn a user's password into a high-entropy AES-GCM key.

Storage: Only the Salt, IV, and Ciphertext are stored in localStorage.

In-Memory Security: The CryptoKey is held in a private module-level variable. It is marked as extractable: false, meaning it cannot be exported or "scraped" easily from the console.

Persistence: A central sync() utility ensures the InMemoryStorage object and localStorage are always identical, while the sensitive CryptoKey is lost the moment the tab is closed or refreshed.

2. The Global Store Logic (store.ts)
Instead of scattered localStorage calls, the app uses a centralized inMemoryStorage.

Atomic Updates: Functions like addWalletToStore or resetWalletStore mutate the object and trigger a sync().

Live References: The UI uses a DeepReadOnly version of this store, ensuring components can read data but cannot accidentally mutate it without going through the proper crypto-gated setters.

3. Encoding Standards
Binary to Storage: All Uint8Array data (IVs, Salts, Keys) is converted to Base64 before hitting localStorage.

Text to Binary: Standard string inputs are processed via TextEncoder before encryption to ensure UTF-8 consistency.

The Thought Process (Timeline of Logic)
I didn't start with a clean singleton. Here is how the architecture evolved:

Phase 1: The "Heavy" Realization Initially, I thought about Web Workers for PBKDF2 because it's computationally expensive. However, SubtleCrypto handles this asynchronously on its own thread, making the added complexity of a manual Web Worker unnecessary for the current scope.

Phase 2: The Two-Password Dilemma I considered having a "Master Password" to open the app and a "Private Password" for signing transactions. I eventually realized this was "Security Theater." If a malicious script can read the DOM to steal one password, it can steal two. The bottleneck is the security of the execution environment itself.

Phase 3: Security vs. UX I debated asking for a password on every single decryption. While safer, it makes the wallet unusable. I decided to store the CryptoKey in memory only. It's a compromise: users stay logged in while the tab is open, but a refresh or "Logout" (clearing the reference) wipes the key completely.

Phase 4: Console Access & Physical Threats I accepted that I cannot hide secrets from a process running in the same memory space. If a user leaves their laptop unlocked and an attacker knows how to use the DevTools console to call my internal methods, they can see the keys. My solution is to add On-Demand Decryption—secrets stay encrypted in memory until the exact moment the user clicks "Show Private Key," accompanied by a confirmation dialogue.

Wallet Utilities
[x] Seed Generation: Generates BIP39 mnemonics.

[x] Encryption Wrapper: Passes plain seeds/keys immediately into the AES-GCM flow.

[x] Store Sync: Managed updates to local storage via a unified JSON blob.