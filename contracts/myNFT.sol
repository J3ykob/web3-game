// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract AlfaAccess is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address _artist;
    uint _feeAmount;
    
    mapping(uint => bool) public excludeList;
    // newidea
    mapping(uint => string) public passcode;

    event NftBought(address _seller, address _buyer, uint256 _price);

    mapping (uint256 => uint256) public tokenIdToPrice;
    mapping (address => uint) public userToTokenCount;

    constructor(
        address artist,
        uint feeAmount
        ) ERC721("AlfaAccess", "AFAC"){

        _artist = artist;
        _feeAmount = feeAmount;
    }

    function getStats(uint16 _tokenId) external view returns (address _owner, uint _price, string memory _passcode) {
        return (ownerOf(_tokenId), tokenIdToPrice[_tokenId], passcode[_tokenId]);
    }
    function getTokenOwnedByUser(address _user) external view returns (uint _tokenId){
        return userToTokenCount[_user];
    }

    function setCharInHash(uint16 _tokenId, string memory _passcode) external {
        require(msg.sender == _artist);
        string memory n = passcode[_tokenId];
        passcode[_tokenId] = string(abi.encodePacked(n, _passcode));
    }

    function getHash(uint16 _tokenId) external view returns (string memory _passcode) {
        return passcode[_tokenId];
    }

    function createToken() public returns (uint) {
        
        _tokenIds.increment();
        uint tokenId = _tokenIds.current();

        excludeList[tokenId] = false;

        tokenIdToPrice[tokenId] = _feeAmount;

        _safeMint(_artist, tokenId);
        // _setTokenURI(tokenId, tokenURI);
        
        return tokenId;

    }

    function setExcluded(uint tokenId, bool status) external {
        require(msg.sender == _artist, 'only the artist can change the exclude value');
        excludeList[tokenId] = status;
    }

    function allowBuy(uint256 _tokenId, uint256 _price) external {
        require(msg.sender == ownerOf(_tokenId), 'Not owner of this token');
        require(_price > 0, 'Price must be greater than zero');
        tokenIdToPrice[_tokenId] = _price;
    }

    function disallowBuy(uint256 _tokenId) external {
        require(msg.sender == ownerOf(_tokenId), 'Not owner of this token');
        tokenIdToPrice[_tokenId] = 0;
    }
    
    function buy(uint256 _tokenId) external payable {
        uint256 price = tokenIdToPrice[_tokenId];
        require(price > 0, 'This token is not for sale');
        require(msg.value >= (price + _feeAmount), "Price incorrect");
        
        address seller = ownerOf(_tokenId);
        tokenIdToPrice[_tokenId] = 0; // not for sale anymore
        if(msg.value / 6 < _feeAmount){
            payable(_artist).transfer(_feeAmount); // send the ETH to the artist
        }else{
            payable(_artist).transfer(msg.value / 6);
        }
        payable(seller).transfer(msg.value - (msg.value / 6)); // send the ETH to the seller
        _transfer(seller, msg.sender, _tokenId);
        
        emit NftBought(seller, msg.sender, msg.value);
    }

    function withdraw() external payable {
        require(msg.sender == _artist, 'only the artist can withdraw!');
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function count() external view returns (uint) {
        return _tokenIds.current();
    }
    function getOwner() external view returns (address _owner) {
        return msg.sender;
    }
    function getPrice(uint _tokenId) external view returns (uint _price) {
        return tokenIdToPrice[_tokenId] + _feeAmount;
    }
}