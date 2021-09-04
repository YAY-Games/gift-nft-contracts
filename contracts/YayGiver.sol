// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "./YayGiftNFT.sol";
import "./interfaces/IYayGiftNFT.sol";

// solhint-disable not-rely-on-time

contract YayGiver {

    // contract settings
    bytes32 public immutable mercleRoot;
    uint256 public immutable startTimestamp;

    // claim state
    address public token;
    mapping(address => bool) public isClaimed;

    event DeployNFT(
        address indexed nftAddress
    );
    event Claim(
        address indexed target,
        bytes32[] merkleProof,
        uint256 tokenId,
        uint256 timestamp
    );

    constructor(bytes32 _mercleRoot, uint256 _startTimestamp) public {
        require(_mercleRoot != bytes32(0), "YayGiver: zero mercle root");
        require(_startTimestamp >= block.timestamp, "YayGiver: wrong start timestamp");

        mercleRoot = _mercleRoot;
        startTimestamp = _startTimestamp;

        // deploy nft contract
        token = address(new YayGiftNFT());

        emit DeployNFT(token);
    }

    function checkVerify(address _target, bytes32[] calldata _merkleProof) external view returns(bool) {
        return (_verify(_target, _merkleProof));
    }

    function claim(bytes32[] calldata _merkleProof) external returns(uint256 tokenId) {
        require(_verify(msg.sender, _merkleProof), "YayGiver: invalid proof or wrong data");
        require(block.timestamp >= startTimestamp, "YayGiver: giver has not started yet");
        require(!isClaimed[msg.sender], "YayGiver: already received the gift");

        isClaimed[msg.sender] = true;

        tokenId = IYayGiftNFT(token).mint(msg.sender);

        emit Claim(msg.sender, _merkleProof, tokenId, block.timestamp);
    }

    function _verify(address _target, bytes32[] memory _merkleProof) internal view returns(bool) {
        bytes32 node = keccak256(abi.encodePacked(_target));
        return(MerkleProof.verify(_merkleProof, mercleRoot, node));
    }
}
