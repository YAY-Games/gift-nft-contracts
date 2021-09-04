// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IYayGiftNFT.sol";

contract YayGiftNFT is IYayGiftNFT, ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() public ERC721("YayGift", "YAYGIFT") {
        _setBaseURI("ipfs://QmTKZ2ERxYixCdnLsPEwuijWbgf7B9EdKAFpM8uT9oVPz8");
    }

    function mint(address to) external override onlyOwner returns(uint256 tokenId) {
        tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _tokenIdCounter.increment();
    }
}