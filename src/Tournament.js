/**
 * Class to create a tournament.
 * @param playerClass object Player class with players in it.
 */
var Tournament = function(playerClass) {
  // Check to see if it really is a Player class.
  if (playerClass instanceof Players) {
    if (hasOwnProperty(playerClass, 'players')) {
      this.players = (playerClass.players.length > 0) ? playerClass.players : new Array();
    }
  } else {
    this.players = new Array();
  }
  
  this.matches = new Array();

  // temporary mode
  this.mode = 'roundrobin';

  this.currentRound = 0;

  this.wrapper = document.getElementById('wrapper');

  this.create();
}

Tournament.prototype = {
  /**
   * Create the tournament and add players.
   */
  create: function() {
    var nPlayers = this.players.length;

    if (nPlayers == 0) {
      nPlayers = parseInt(prompt('How many?'));

      // @todo fix better way to check if prompt gives an int.
      if (typeof nPlayers == "number") {
        for (var i = 0; i < nPlayers; i++) {
          var player = {};

          player.id = i;
          player.name = prompt('Name of player ' + (i + 1));

          this.players.push(player);
        } 
      } else {
        console.log('you have to enter an integer.');
        return false;
      }
    }

    if (this.players.length == nPlayers) {
        return this.createMatches();  
      } else {
        return false;
      }
  },
  /**
   * Initialize match setup.
   */
  createMatches: function() {
    if (this.mode == 'roundrobin') {
      if (this.roundrobin()) {
        this.renderMatches();
      }
    }
  },
  /**
   * Render the matches in the DOM.
   */
  renderMatches: function() {
    if (document.getElementById('match-table')) {
      document.getElementById('match-table').remove();
    }

    var matchTable = document.createElement('table');
        matchTable.setAttribute('id', 'match-table');

    var tableHeader = document.createElement('thead');

    var headerPlayer = document.createElement('td');
        headerPlayer.innerHTML = 'Match-up';

    var headerScore = document.createElement('td');
        headerScore.innerHTML = 'Winner';

    tableHeader.appendChild(headerPlayer);
    tableHeader.appendChild(headerScore);

    matchTable.appendChild(tableHeader);

    var tableBody = document.createElement('tbody');

    for (var i = 0; i < this.matches.length; i++) {
      var match = document.createElement('tr');
          match.className = 'match';

      var title = document.createElement('td');
          title.className = 'title';

          title.innerHTML = this.matches[i].title;

      match.appendChild(title);

      var score = document.createElement('td'),
          winner = 'TBD';
          score.className = 'score';
            
      if (this.matches[i].winnerId != null) {
        winner = this.players[this.matches[i].winnerId].name;
        score.className += ' announced';
      }

      score.innerHTML = winner;

      match.appendChild(score);

      tableBody.appendChild(match);
    }

    matchTable.appendChild(tableBody);

    this.wrapper.appendChild(matchTable);

    this.renderScoreboard();
  },
  renderScoreboard: function() {
    var that = this;

    if (document.getElementById('scoreboard-table')) {
      document.getElementById('scoreboard-table').remove();
    }

    var scoreboardTable = document.createElement('table');
        scoreboardTable.id = 'scoreboard-table';

    var scoreboardHeader = document.createElement('thead');

    var playerHeader = document.createElement('td');
        playerHeader.innerHTML = 'Player';

    var scoreHeader = document.createElement('td');
        scoreHeader.innerHTML = 'Score';

    scoreboardHeader.appendChild(playerHeader);
    scoreboardHeader.appendChild(scoreHeader);

    scoreboardTable.appendChild(scoreboardHeader);

    var scoreboardBody = document.createElement('tbody');

    // Calculate scores for each player.
    this.players.map(function(player) {
      var score = 0;

      that.matches.forEach(function(match) {
        if (match.winnerId != null) {
          score += (match.winnerId == player.id) ? 1 : 0;
        } else {
          score += 0;
        }
      });

      return {id: player.id, name: player.name, score: score};
    })
    // Sort by score lowest to highest.
    .sort(function(a, b) {
      return a.score - b.score;
    })
    // Reverse order.
    .reverse()
    // Build elements.
    .forEach(function(player, i) {
      var playerRow = document.createElement('tr');

      var playerName = document.createElement('td');
          playerName.innerHTML = player.name;
      
      var playerScore = document.createElement('td');  
      playerScore.innerHTML = player.score;

      playerRow.appendChild(playerName);
      playerRow.appendChild(playerScore);
      scoreboardBody.appendChild(playerRow);
    });

    scoreboardTable.appendChild(scoreboardBody);

    this.wrapper.appendChild(scoreboardTable);
  },
  /**
   * Set winner for a match
   */
  updateMatch: function(matchObj) {
    if (typeof matchObj == "object") {
      var id = matchObj.id;
      console.log('Updating match with id ' + id);
      for (var prop in matchObj) {
        // Check if the property of the update object exists in the match object.
        if (hasOwnProperty(this.matches[id], prop)) {
          this.matches[id][prop] = matchObj[prop];
        }
      }
      console.log('Updated ', this.matches[id]);

      this.renderMatches();
    } else {
      return false;
    }
  },
  /**
   * Game Modes.
   */
  roundrobin: function() {
    for (var i = 0; i < this.players.length; i++) {
      for (var j = 0; j < this.players.length; j++) {
        if (j == i) continue;

        // Check to see whether to add match depending on if already match exists.
        if (this.matches.length > 0) {
          var matchExists = false;
          for (var k = 0; k < this.matches.length; k++) {
            if (this.matches[k].playerIds.indexOf(i) >= 0 && this.matches[k].playerIds.indexOf(j) >= 0) {
              matchExists = true;
            }
          }

          if (matchExists) continue;
        }

        // Add match settings.
        var match = {};

        match.id        = this.matches.length;
        match.playerIds = shuffle([this.players[i].id, this.players[j].id]);
        match.winnerId  = null;
        match.round     = this.currentRound;
        match.title     = this.players[match.playerIds[0]].name + ' vs. ' + this.players[match.playerIds[1]].name;

        this.matches.push(match);
      }
    }

    this.matches = shuffle(this.matches);

    return true;
  }
}