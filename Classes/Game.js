class Game {
      
    constructor() {
          
        this.players = []
        this.meld = []
        this.stockPile = []
        this.dicardPile = []
    }

    addPlayer(player) {
          
        this.players.push(player)
    }

    getPlayers() {
           
        return this.players
    }

    setMeld(meld) {
          
        this.meld = meld
    }

    setStockPile(stockPile) {
          this.stockPile = stockPile
    }

    setDiscardPile(discardPile) {
          
        this.discardPile = discardPile
    }

    getMeld() {
          
        return this.meld
    }

    getStockPile() {
         
        return this.stockPile
    }

    getDiscardPile() {
        
        return this.discardPile
    }
}

module.exports = Game