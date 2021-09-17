// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IYayGiftNFT.sol";

// solhint-disable no-empty-blocks

contract YayGiftNFT is IYayGiftNFT, ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() public ERC721("Crypto Enthusiast", "CPTE") {}

    function mint(address to) external override onlyOwner returns(uint256 tokenId) {
        tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, "https://gateway.pinata.cloud/ipfs/Qmagbqj8Z5Y5fHX9z9x1EZ79RnMZuXanpXnjgcZ55Rf6eZ");
        _tokenIdCounter.increment();
    }
}