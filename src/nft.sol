pragma solidity 0.8.0;

import "https://github.com/0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";
import "https://github.com/0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFTAssert is NFTokenMetadata, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() {
        nftName = "NFTAssert";
        nftSymbol = "NFT";
    }

    function addItem(string memory tokenURI) external returns (uint256){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        super._mint(msg.sender, newItemId);
        super._setTokenUri(newItemId, tokenURI);
        return newItemId;
    }

}
