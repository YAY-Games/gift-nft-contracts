# YAY gift NFT contracts
<!-- [![HardhatBuild](https://github.com/YAY-Games/vesting-contract/actions/workflows/testing.yaml/badge.svg)](https://github.com/YAY-Games/vesting-contract/actions/workflows/testing.yaml) -->

- Language: Solidity v0.6.12

- Project framework: hardhat + truffle / web3

- Nodejs: v14.17.0

## Overview

### Deployed

- Coming soon

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

Tip:
```
category id:
1 = SEED
2 = STRATEGIC
3 = PRESALE
4 = PUBLIC
5 = V24MONTH
```

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

More info: ([link](https://docs.google.com/spreadsheets/d/1Dl3pxKKNMflSSM5MUe-cJdQMooIXXRIo/edit?usp=sharing&ouid=111440494197941322385&rtpof=true&sd=true))



## License

[MIT License](./LICENSE)
