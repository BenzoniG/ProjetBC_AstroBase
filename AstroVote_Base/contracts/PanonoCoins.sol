pragma solidity ^0.4.24;

// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
contract SafeMath {
    function safeAdd(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Cap.sol";

contract PanonoCoin is ERC20, ERC20Detailed, ERC20Cap {

    string private name = 'PanonoCoin';
    string private symbol = 'PNC';
    uint private precision = 18;
    uint private totalSupplyCap = 1000000;

    mapping(address => bool) public initialOfferGranted;

    constructor() ERC20Detailed(name, symbol, precision) ERC20Cap(totalSupplyCap) public {}

    function getInitialOffer() public{
        require(!initialOfferGranted[msg.sender]);
        _mint(msg.sender, 1000);
        initialOfferGranted[msg.sender] = true;
    }
}

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';

contract PanonoCard is ERC721Full, ERC721Mintable{

    struct Player
    {
        //address[] owners;
        string playerName;
        string playerTeam;
        string season;
        bool forSale;
        uint price;
    }

    mapping(uint256 => Player) public players;
    mapping(uint256 => bool) public playerExists;

    constructor() ERC721Full('PanonoPlayer', 'PNP') ERC721Mintable() public{
    }

    function generateReference() private view returns (uint256) {
      uint256 random = 1000000+uint256(keccak256(block.timestamp, block.difficulty))%8999999;
      require(!players[random]);
       return random;
   }

    function createCard(string name, string team, string season){
      uint256 ref = generateReference();
      players[ref] = Player(name, team, season);
      _mint(msg.sender, ref);
    }
}
