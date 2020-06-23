pragma solidity ^0.4.2;

contract AstroVote_Base
{
    //Model a artist
    struct Artist
    {
      uint id;
      string name;
      uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Read.write artists
    mapping (uint => Artist) public artists; // public to have a getter function

    // Store artists count because we can't count an array
    uint public artistsCount;

    // Constructor
    constructor () public
    {
        addArtist("Artist 1");
        addArtist("Artist 2");
        addArtist("Artist 3");
    }

    function addArtist (string _name) private  //private beacause we don't want anyone else to add artist // only the contract will do
    {
      artistsCount ++;
      artists[artistsCount] = Artist(artistsCount, _name, 0);
    }

    function vote (uint _artistId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid artist
        require(_artistId > 0 && _artistId <= artistsCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update artist vote Count
        artists[_artistId].voteCount ++;
    }
}
