# 🎨 NFT Marketplace

A full-stack, production-ready NFT marketplace built with Next.js, TypeScript, and blockchain technology. Features real-time indexing, compliance screening, and a seamless user experience for buying and selling NFTs.

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Smart Contracts](#-smart-contracts)
- [Compliance Integration](#-compliance-integration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Marketplace Features

- **🎯 NFT Listing**: List your NFTs for sale with custom pricing in USDC
- **💰 NFT Buying**: Purchase listed NFTs with USDC payments
- **🔍 Real-time Updates**: Automatic indexing of blockchain events
- **📊 Active Listings**: View all currently available NFTs with filtering

### Advanced Features

- **🛡️ Compliance Screening**: Integrated Circle API for address verification
- **🎨 Dynamic NFT Display**: On-chain SVG generation for Cake NFTs
- **💳 Multi-Wallet Support**: Connect with MetaMask, Rainbow, and more via WalletConnect
- **⚡ Gas Optimization**: Uses USDC for payments to reduce gas costs
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS

### Security & Compliance

- **✅ Address Screening**: Pre-transaction compliance checks for buyers and sellers
- **🔐 Smart Contract Security**: Audited marketplace contract with reentrancy protection
- **🔒 Non-Custodial**: Users maintain full control of their NFTs

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
┌────────▼────────┐ ┌──▼──────────────┐
│   Wagmi/Viem    │ │  GraphQL API    │
│  (Web3 Layer)   │ │  (Port 3001)    │
└────────┬────────┘ └──┬──────────────┘
         │              │
         │         ┌────▼──────────┐
         │         │   Rindexer    │
         │         │   (Indexer)   │
         │         └────┬──────────┘
         │              │
    ┌────▼──────────────▼─────┐
    │   Anvil/Ethereum Node   │
    │    (Blockchain Layer)   │
    └────────────────────────┘
```

### Data Flow

1. **Event Emission**: Smart contracts emit events (ItemListed, ItemBought, ItemCanceled)
2. **Indexing**: Rindexer captures events and stores them in PostgreSQL
3. **GraphQL Layer**: Provides queryable API for the frontend
4. **Frontend Display**: React components fetch and display active listings
5. **User Interaction**: Wagmi handles wallet connections and transactions

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.2**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Wagmi 2.x**: React hooks for Ethereum
- **RainbowKit**: Beautiful wallet connection UI
- **TanStack Query**: Data fetching and caching

### Backend & Blockchain

- **Foundry**: Smart contract development and testing
- **Anvil**: Local Ethereum node
- **Rindexer**: Blockchain event indexer
- **PostgreSQL**: Database for indexed data
- **GraphQL**: API for querying blockchain data

### Smart Contracts

- **Solidity 0.8.24**: Contract language
- **OpenZeppelin**: Security-audited contract libraries
- **ERC-721**: NFT standard implementation

### Infrastructure

- **Docker**: Container orchestration for PostgreSQL
- **Circle API**: Compliance screening service
- **USDC**: ERC-20 token for marketplace payments

## 📦 Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0 (`npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com/))
- **Foundry/Anvil** ([Install](https://book.getfoundry.sh/getting-started/installation))
- **Docker** >= 27.0.0 ([Download](https://www.docker.com/get-started/))
- **Rindexer** >= 0.15.2 ([Install](https://github.com/joshstevens19/rindexer))

Verify installations:

```bash
node --version    # v18.0.0 or higher
pnpm --version    # 8.0.0 or higher
anvil --version   # anvil 0.2.0 or higher
docker --version  # Docker version 27.0.0 or higher
rindexer --version # rindexer 0.15.2
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/cyfrin/ts-nft-marketplace-cu.git
cd ts-nft-marketplace-cu
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# WalletConnect Project ID (Required)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# GraphQL API endpoint
GRAPHQL_API_URL=http://localhost:3001/graphql

# Compliance (Optional - set to false if not using Circle)
ENABLE_COMPLIANCE_CHECK=false
CIRCLE_API_KEY=your_circle_api_key_here
```

**Get your WalletConnect Project ID**: [WalletConnect Cloud](https://cloud.walletconnect.com/)

**Get your Circle API Key**: [Circle Developer Portal](https://console.circle.com/api-keys)

### 4. Configure Indexer Database

Create `marketplaceIndexer/.env`:

```bash
DATABASE_URL=postgresql://postgres:rindexer@localhost:5440/postgres
POSTGRES_PASSWORD=rindexer
```

### 5. Setup MetaMask

#### Add Anvil Network

- **Network Name**: Anvil
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency Symbol**: `ETH`

#### Import Test Accounts

Import these private keys into MetaMask for testing:

```bash
# Account 0 (Has NFTs and USDC)
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Account 9 (Has NFTs and USDC)
0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
```

## 🎮 Running the Application

The application requires three components running simultaneously:

### Terminal 1: Start Anvil (Local Blockchain)

```bash
pnpm anvil
```

This starts a local Ethereum node with pre-deployed contracts and test data.

**Deployed Contracts:**

- USDC: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- NFT Marketplace: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- Cake NFT: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- Mood NFT: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`

### Terminal 2: Start Indexer

```bash
pnpm indexer
```

This starts:

1. PostgreSQL database (via Docker)
2. Rindexer event processor
3. GraphQL API server (port 3001)

**Troubleshooting:** If you get a Docker error, ensure Docker Desktop is running.

### Terminal 3: Start Next.js Application

```bash
pnpm run dev
```

Application will be available at: **http://localhost:3000**

## 📁 Project Structure

```
ts-nft-marketplace-cu/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/
│   │   │   └── compliance/       # Circle compliance API route
│   │   ├── buy-nft/              # NFT purchase pages
│   │   ├── cake-nft/             # Cake NFT minting page
│   │   ├── list-nft/             # NFT listing page
│   │   └── page.tsx              # Home page (Recently Listed)
│   ├── components/               # React components
│   │   ├── CakeNft.tsx           # NFT minting interface
│   │   ├── ComplianceChecker.tsx # Address screening UI
│   │   ├── Header.tsx            # Navigation header
│   │   ├── ListNftForm.tsx       # NFT listing form
│   │   ├── NFTBox.tsx            # NFT display card
│   │   └── RecentlyListed.tsx    # Marketplace listings
│   ├── hooks/                    # Custom React hooks
│   │   └── useActiveListings.ts  # Fetch active listings
│   ├── lib/                      # Utility libraries
│   │   └── complianceClient.ts   # Circle API client
│   ├── types/                    # TypeScript type definitions
│   │   └── marketplaceTypes.ts   # Marketplace data types
│   ├── utils/                    # Helper functions
│   │   ├── formatPrice.ts        # Price formatting utilities
│   │   └── graphQL-client.ts     # GraphQL client
│   └── constants.ts              # Contract addresses and ABIs
├── marketplaceIndexer/           # Blockchain indexer
│   ├── abis/                     # Contract ABIs
│   ├── docker-compose.yml        # PostgreSQL configuration
│   └── rindexer.yaml             # Indexer configuration
├── marketplace-anvil.json        # Pre-deployed blockchain state
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 📜 Smart Contracts

### NFT Marketplace Contract

**Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

**Key Functions:**

- `listItem(address nftAddress, uint256 tokenId, uint256 price)`: List an NFT
- `buyItem(address nftAddress, uint256 tokenId)`: Purchase a listed NFT
- `cancelListing(address nftAddress, uint256 tokenId)`: Cancel your listing
- `updateListing(address nftAddress, uint256 tokenId, uint256 newPrice)`: Update price

**Events:**

- `ItemListed`: Emitted when an NFT is listed
- `ItemBought`: Emitted when an NFT is purchased
- `ItemCanceled`: Emitted when a listing is canceled

### Cake NFT Contract

**Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

Dynamic SVG NFT with on-chain generation. Each token has unique colors generated from the token ID seed.

### USDC Token

**Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

Standard ERC-20 token used as marketplace payment currency.

## 🛡️ Compliance Integration

The marketplace integrates Circle's compliance API to screen wallet addresses before transactions.

### Features

- **Pre-transaction Screening**: Check both buyer and seller addresses
- **Risk Assessment**: Low/Medium/High risk scoring
- **Transaction Blocking**: Prevent purchases if compliance fails

### Setup

1. Get API key from [Circle Developer Portal](https://console.circle.com/)
2. Add to `.env.local`:
    ```bash
    ENABLE_COMPLIANCE_CHECK=true
    CIRCLE_API_KEY=your_api_key_here
    ```
3. Compliance checks will automatically run on the buy-nft pages

### API Endpoint

```bash
POST /api/compliance
Content-Type: application/json

{
  "address": "0x..."
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm run dev          # Start Next.js dev server
pnpm anvil            # Start local blockchain
pnpm indexer          # Start blockchain indexer

# Building
pnpm run build        # Build for production
pnpm run start        # Start production server

# Code Quality
pnpm run lint         # Run ESLint
pnpm run format       # Format with Prettier
pnpm run format:check # Check formatting

# Database
pnpm run reset-indexer # Reset indexer database

# Testing
pnpm run test:unit    # Run unit tests
pnpm run test:e2e     # Run E2E tests
```

### Adding New NFT Contracts

1. Add contract address to `src/constants.ts`:

```typescript
export const chainsToContracts: ContractsConfig = {
    31337: {
        // ... existing contracts
        myNewNft: "0x...",
    },
}
```

2. Add contract ABI to `src/constants.ts`
3. Update indexer configuration in `marketplaceIndexer/rindexer.yaml`

### Extending the Indexer

Add new events to track in `marketplaceIndexer/rindexer.yaml`:

```yaml
contracts:
    - name: NftMarketplace
      include_events:
          - name: ItemListed
          - name: ItemBought
          - name: ItemCanceled
          - name: YourNewEvent # Add here
```

## 🧪 Testing

### Unit Tests

```bash
pnpm run test:unit
```

### End-to-End Tests

```bash
# Terminal 1: Start Anvil
pnpm anvil

# Terminal 2: Start Indexer
pnpm indexer

# Terminal 3: Start App
pnpm run dev

# Terminal 4: Run E2E tests
pnpm run test:e2e
```

### Manual Testing Flow

1. **Connect Wallet**: Use imported Anvil account
2. **Mint NFT**: Go to Cake NFT page, mint a new NFT
3. **List NFT**: Go to List NFT page, list your NFT
4. **Verify Listing**: Check Recently Listed page
5. **Buy NFT**: Switch accounts, attempt purchase
6. **Compliance Check**: Verify address screening works

## 🚀 Deployment

### Prerequisites

- Ethereum mainnet/testnet RPC URL
- Deployed smart contracts
- PostgreSQL database (e.g., Railway, Supabase)
- Hosting platform (Vercel, Netlify)

### Environment Variables for Production

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=prod_project_id
GRAPHQL_API_URL=https://your-api.com/graphql
ENABLE_COMPLIANCE_CHECK=true
CIRCLE_API_KEY=prod_api_key
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Indexer Deployment

Deploy rindexer to a VPS or use a managed service:

```bash
# Build indexer
cd marketplaceIndexer
rindexer build

# Run in production
rindexer start all --production
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Format with Prettier before committing
- Write descriptive commit messages

## 📝 Common Issues

### Docker PostgreSQL Won't Start

```bash
# Check if port 5440 is in use
lsof -i :5440

# Clean up Docker
docker-compose down
docker volume rm marketplaceindexer_postgres_data
```

### Rindexer Connection Issues

```bash
# Ensure Anvil is running on port 8545
# Check rindexer.yaml RPC URL matches Anvil

# Restart indexer
pnpm run reset-indexer
pnpm indexer
```

### GraphQL Returns No Data

```bash
# Check if events are being indexed
# View rindexer logs for errors
# Verify contract address in rindexer.yaml

# Test GraphQL directly
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ allItemListeds { totalCount } }"}'
```

### MetaMask Transaction Fails

- Ensure you're connected to Anvil network (Chain ID 31337)
- Check you have enough ETH for gas
- Verify you have USDC for purchases
- Reset MetaMask account nonce if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cyfrin](https://www.cyfrin.io/) - Web3 education and training
- [OpenZeppelin](https://openzeppelin.com/) - Smart contract libraries
- [Foundry](https://getfoundry.sh/) - Ethereum development toolkit
- [Rindexer](https://github.com/joshstevens19/rindexer) - Blockchain indexing
- [Circle](https://www.circle.com/) - Compliance and USDC

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/cyfrin/ts-nft-marketplace-cu/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cyfrin/ts-nft-marketplace-cu/discussions)
- **Cyfrin Discord**: [Join Community](https://discord.gg/cyfrin)

## 🗺️ Roadmap

- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] Auction functionality
- [ ] Collection pages
- [ ] User profiles
- [ ] Favorite/wishlist features
- [ ] Activity feed
- [ ] Advanced filtering and search
- [ ] Gasless transactions with meta-transactions
- [ ] Mobile app

---

Built with ❤️ by the Cyfrin community
