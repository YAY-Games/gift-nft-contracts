# YAY gift NFT contracts

[![HardhatBuild](https://github.com/YAY-Games/gift-nft-contracts/actions/workflows/testing.yaml/badge.svg)](https://github.com/YAY-Games/gift-nft-contracts/actions/workflows/testing.yaml)
[![codecov](https://codecov.io/gh/YAY-Games/gift-nft-contracts/branch/master/graph/badge.svg?token=sdsAmkTzOF)](https://codecov.io/gh/YAY-Games/gift-nft-contracts)

- Language: Solidity v0.6.12

- Project framework: hardhat + truffle / web3

- Nodejs: v14.17.0

## Overview

### Deployed

[Binance Smart Chain](https://bscscan.com/address/0xd0db7a837db303526F6376c847279b27AE278d87#code)

[Avalanche C-chain](https://cchain.explorer.avax.network/address/0xd4653125Ac7C0C4eE5834541ac5a213a7E4786Fd/contracts)

## Installation & Usage

1. Install packages
```
npm i --save-dev
```

2. Build project
```
npm run build
```

### Testing

```
npm test
```

### Run linter

```
npm run lint
```

### Deploy

1. Edit scripts/mercleTreeData.json

2. Generate mercle tree root
```
npx hardhat run scripts/generate-mercle-root.js
```

3. Setup environment variables:
```
cp .env.example .env
// edit .env
```

4. Edit network in ```hardhat.config.js``` ([docs](https://hardhat.org/config/))

5. Run command:
```
npx hardhat run scripts/deploy-script.js --network <network name>
```

## License

[MIT License](./LICENSE)
