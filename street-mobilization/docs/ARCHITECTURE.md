# Street Mobilization Platform Documentation

## System Architecture

The Street Mobilization platform is a decentralized, biometric-backed identity and intervention management system for street-connected children. It is built on a modular, full-stack architecture designed for security, scalability, and transparency.

### Core Components

1.  **Frontend (React + TypeScript + Tailwind CSS)**:
    -   Provides the user interface for field workers, NGOs, and government administrators.
    -   Includes modules for child registration, biometric capture, intervention tracking, and analytics.
    -   Features role-based UI permissions (RBAC) and real-time dashboard updates.

2.  **Backend (Node.js + Express + TypeScript)**:
    -   Acts as the coordination layer between the frontend, database, and blockchain.
    -   Modular service architecture (Auth, Child Registry, Biometrics, Intervention, Aid, Blockchain).
    -   Secured via JWT authentication and role-based access middleware.

3.  **Smart Contracts (Solidity ^0.8.20)**:
    -   The immutable source of truth for child identities and aid history.
    -   **StreetMobilizationRegistry**: Prevents duplicate biometric IDs and stores off-chain data pointers.
    -   **InterventionTracker**: Maintains a verifiable audit trail of all support activities.
    -   **AccessControlManager**: Manages platform roles and hardware device authorizations.
    -   **ChildIdentityToken**: Soulbound (non-transferable) ERC721 tokens representing permanent identities.

4.  **Database (PostgreSQL + Prisma)**:
    -   Stores detailed off-chain child records, organizational data, and user accounts.
    -   Used for high-speed indexing and reporting.

5.  **Biometric Service**:
    -   Processes raw biometric templates (fingerprints/iris) into SHA256 hashes.
    -   Ensures that sensitive biometric data never leaves the local device in its raw form.

6.  **IPFS (InterPlanetary File System)**:
    -   Stores large media files (photos, document scans, reports) in a decentralized manner.
    -   The cryptographic CID (Content ID) is stored on the blockchain for verification.

## Data Flow

### 1. Child Registration Flow
- **Capture**: Field worker captures child details and biometric template on a secure device.
- **Hashing**: Local device generates a SHA256 biometric hash.
- **Upload**: Photos and documents are uploaded to IPFS; CID is returned.
- **Backend Sync**: Details and hashes are sent to the backend API.
- **Blockchain Commit**: Backend submits a transaction to the `StreetMobilizationRegistry` with the `childId`, `biometricHash`, and `dataHash` (IPFS CID).
- **ID Issuance**: `ChildIdentityToken` is minted for the new ID.

### 2. Biometric Verification Flow
- **Scan**: Field worker scans the child's biometric template.
- **Query**: System generates the hash and queries the `verifyChild` function on the blockchain.
- **Match**: If a match is found, the system retrieves the linked `childId` and fetches the full profile from the off-chain database.

## Security Features
- **AES-256 Encryption**: For sensitive data stored off-chain.
- **JWT Authentication**: Secure API access for authorized personnel.
- **Audit Logging**: Every on-chain and off-chain action is logged with a timestamp and actor ID.
- **Non-Transferability**: Identity tokens cannot be moved, preventing identity theft.

## Deployment Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Hardhat (for contract deployment)
- IPFS Node (Infura or local)

### Backend Setup
1. `cd street-mobilization/backend`
2. `npm install`
3. Configure `.env` with database and blockchain provider details.
4. `npm run dev`

### Smart Contract Deployment
1. `cd street-mobilization/smart-contracts`
2. `npx hardhat compile`
3. `npx hardhat run scripts/deploy.js --network <network_name>`

### Frontend Setup
1. `cd street-mobilization/frontend`
2. `npm install`
3. `npm start`
