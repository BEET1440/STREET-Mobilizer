# STREET-Mobilizer

Street Mobilization is a blockchain-based WebApp designed to collect, store, and manage data on street children securely. The platform allows authorized personnel to input, manipulate, and retrieve information using biometric authentication on specialized devices. Blockchain technology ensures data immutability, transparency, and traceability.

## Project Structure

- `/frontend`: React.js application with Tailwind CSS and Lucide icons.
- `/backend`: Node.js/Express API with MongoDB integration and mock blockchain support.
- `/blockchain`: Smart contracts (Solidity) and mock blockchain implementation for development.
- `/docs`: Project documentation and architecture details.

## Features

1. **Secure Data Collection**: Register child records with personal and demographic details.
2. **Blockchain Immutability**: Every record is stored as a transaction on a blockchain (mocked for dev).
3. **Biometric Verification**: (Simulated) Scan biometrics to retrieve and verify records against the blockchain.
4. **Analytics Dashboard**: Real-time insights into registered children and system activity.

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (optional, fallback to mock mode if not available)

### Installation

1. Clone the repository
2. Install Backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install Frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Project

1. Start the Backend:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Wiki & Guidelines

Refer to the [Wiki](https://github.com/BEET1440/STREET-Mobilizer/wiki) for detailed implementation guidelines and architecture.
