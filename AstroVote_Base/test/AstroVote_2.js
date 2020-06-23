var AstroVote_2 = artifacts.require("./AstroVote_2.sol");

contract("AstroVote_2", function(accounts) {
    var astroVote_2Instance;

    it("initializes with two artists", function() {
        return AstroVote_2.deployed().then(function(instance) {
            return instance.artistsCount();
        }).then(function(count) {
            assert.equal(count, 2);
        });
    });

    it("it initializes the artists with the correct values", function() {
        return AstroVote_2.deployed().then(function(instance) {
            astroVote_2Instance = instance;
            return astroVote_2Instance.artists(1);
        }).then(function(artist) {
            assert.equal(artist[0], 1, "contains the correct id");
            assert.equal(artist[1], "Artist 1", "contains the correct name");
            assert.equal(artist[2], 0, "contains the correct votes count");
            return astroVote_2Instance.artists(2);
        }).then(function(artist) {
            assert.equal(artist[0], 2, "contains the correct id");
            assert.equal(artist[1], "Artist 2", "contains the correct name");
            assert.equal(artist[2], 0, "contains the correct votes count");
        });
    });
});
