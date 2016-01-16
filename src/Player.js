/**
 * Player class.
 */
var Players = function() {
  this.players = new Array();
}

Players.prototype = {
  /**
   * Create a player.
   */
  create: function(playerObj) {
    if (typeof playerObj == "object") {
      var player = {};

      player.id = this.players.length;
      player.name = null;

      for (var prop in playerObj) {
        if (hasOwnProperty(player, prop)) {
          player[prop] = playerObj[prop];
        }
      }

      this.players.push(player);
    } else {
      console.log('You have to provide an object with information');
    }
  }
}