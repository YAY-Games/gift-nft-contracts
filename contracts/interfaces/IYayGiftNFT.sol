// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

interface IYayGiftNFT {
    function mint(address to) external returns(uint256 tokenId);
}