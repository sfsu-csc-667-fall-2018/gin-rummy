class Deck {
       
    constructor() {
          
        this.deck = []
    }


    addCard(card) {
         
        this.deck.push(card)
    }

    getDeck() {
          
        return this.deck
    }
}


module.exports = Deck