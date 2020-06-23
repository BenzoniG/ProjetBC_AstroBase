App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      ethereum.enable();

     // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');

      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      ethereum.enable();

      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("AstroVote_Base.json", function(astroVote_Base) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.AstroVote_Base = TruffleContract(astroVote_Base);
      // Connect provider to interact with contract
      App.contracts.AstroVote_Base.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var astroVote_BaseInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.AstroVote_Base.deployed().then(function(instance) {
      astroVote_BaseInstance = instance;
      return astroVote_BaseInstance.artistsCount();
    }).then(function(artistsCount) {
      var artistsResults = $("#artistsResults");
      artistsResults.empty();

      var artistsSelect = $('#artistsSelect');
      artistsSelect.empty();

      for (var i = 1; i <= artistsCount; i++) {
        astroVote_BaseInstance.artists(i).then(function(artist) {
          var id = artist[0];
          var name = artist[1];
          var voteCount = artist[2];

          // Render artist Result
          var artistTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          artistsResults.append(artistTemplate);

          // Render artist ballot option
          var artistOption = "<option value='" + id + "' >" + name + "</ option>"
          artistsSelect.append(artistOption);
        });
      }
      return astroVote_BaseInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var artistId = $('#artistsSelect').val();
    App.contracts.AstroVote_Base.deployed().then(function(instance) {
      return instance.vote(artistId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
