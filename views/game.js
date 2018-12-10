var GinRummy = (function() {

	function Card(rank, suit) {
		this.rank = rank;
		this.suit = suit;
	}

	Card.prototype.getRank = function() {
		return this.rank;
	}

	Card.prototype.getSuit = function() {
		return this.suit;
	}

	Card.prototype.showCard = function(i) {
		var suitUnicodes = {
				'CLUBS' : '&#9827;',
				'HEARTS' : '&#9829;',
				'DIAMONDS' : '&#9830;',
				'SPADES' : '&#9824;'
			}
		// console.log(this.suit);
		// console.log(suitUnicodes);

		// append <div class="discard"></div>
		return `<div><button id="discard" type="button" value="` + i + `" disabled>Discard</button>
			<div class="card ` + this.suit + `">
			<div class="rank">` + this.rank + `</div>
			<div class="suit">`+ suitUnicodes[this.suit] + `</div>
			</div></div>`;
	}

	function Player(hand, element) {
		this.hand = hand;
		this.element = element;
	}

	Player.prototype.getHand = function() {
		return this.hand;
	}

	Player.prototype.getElement = function() {
		return this.element
	}

	Player.prototype.addCard = function (card) {
		this.hand.push(card);
	}

	Player.prototype.discardCard = function (i) {
		this.hand.splice(i, 1);
	}

	Player.prototype.sortHand = function () {

	}

	Player.prototype.getScore = function() {

	}

	Player.prototype.showHand = function() {
		var hand = "";
		if( this.element == 'player') {
			for(var i = 0; i < this.hand.length; i++) {
				hand += this.hand[i].showCard(i);
			}
			return hand;
		} else {
			return hand;
		}
	}

	Player.prototype.checkHandSize = function() {
		if (this.hand.length > 10) {
			return true;
		} else {
			return false;
		}
	}

	Player.prototype.checkTrips = function(hand) {
		function filterHand(array, rank) {
			return array.filter((value) => rank === value);
		}

		var temp = [];
		for(var i = 0; i < hand.length; i++) {
			temp.push(filterHand(hand, hand[i]));
		}
		
		var tripFlag = false;
		for(var i = 0; i < temp.length; i++) {
			if( temp[i].length == 3) {
				tripFlag = true;
			}
		}
		console.log("trips: " + tripFlag);
	}

	Player.prototype.checkQuads = function(hand) {
		function filterHand(array, rank) {
			return array.filter((value) => rank === value);
		}

		var temp = [];
		for(var i = 0; i < hand.length; i++) {
			temp.push(filterHand(hand, hand[i]));
		}
		
		var tripFlag = false;
		for(var i = 0; i < temp.length; i++) {
			if( temp[i].length == 4) {
				tripFlag = true;
			}
		}
		console.log("quads: "+ tripFlag);
	}

	Player.prototype.checkStraight = function() {

	}

	var Trash = new function() {
		this.trash = [];
		this.init = function() {
			this.trash = [];
		}
	}

	var Deck = new function() {
		this.deck = [];

		this.init = function() {
			this.deck = [];
			this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
			for (var i=0; i < 4; i++) {
			
				for (var j = 0; j < 13; j++) {

					if (i === 0) {
						 
						var suit = "SPADES"
						var card = new Card(this.ranks[j], suit)
						this.deck.push(card)
					}

					if (i === 1) {
						 
						var suit = "DIAMONDS"
						var card = new Card(this.ranks[j], suit)
						this.deck.push(card)

					}

					if (i === 2) {
						var suit = "HEARTS"
						var card = new Card(this.ranks[j], suit)
						this.deck.push(card)

					}

					if (i === 3) {
						var suit = "CLUBS"
						var card = new Card(this.ranks[j], suit)
						this.deck.push(card)
					}
				}
			}
		}

		this.shuffleDeck = function() {
			var random = 0;
			var x = 0;
			var i;
			
			for( i = this.deck.length; i; i--) {
				random = Math.floor(Math.random() * i);
				x = this.deck[i-1];
				// console.log(x);
				this.deck[i-1] = this.deck[random];
				this.deck[random] = x;
			}
		}

		this.dealHand = function() {
			var hand = [];
			for ( var i = 0; i < 10; i++) {
				var temp = this.deck.pop();
				// console.log("Your hand:" + temp);
				hand.push(temp);
			}
			return hand;
		}
	}

	var Game = new function() {
		this.gameStarted = false;

		this.startHandler = function() {
			Game.startGame();
			this.startButton.disabled = true
			this.sortButton.disabled = false
			this.pickupButton.disabled = false
			this.drawButton.disabled = false
			this.knockButton.disabled = true
		}

		this.sortHandler = function() {
			this.player.checkTrips(this.player.getHand());
			this.player.checkQuads(this.player.getHand());
		}

		this.drawHandler = function() {
			var card = Deck.deck.pop()
			this.player.addCard(card)

			document.getElementById(this.player.element).innerHTML += card.showCard(this.player.hand.length-1);

			if(this.player.checkHandSize()) {
				var discardButtons = document.querySelectorAll('[id^="discard"]');

				for( var i = 0; i < discardButtons.length; i++) {
					discardButtons[i].disabled = false;
					discardButtons[i].addEventListener('click', this.discardEvent.bind(this, i))
				}


			}
		}

		this.pickupHandler = function() {
			var card = Trash.trash.pop()
			this.player.addCard(card)
		}

		this.knockHandler = function() {
			this.drawButton.disabled = true
			this.pickupButton.disabled = true
			this.sortButton.disabled = true
		}

		// Event when card is drawn, player
		// must discard a card 
		this.discardEvent = function(i) {
			// 1. Append discard buttons to div's of each card 
			// 2. Discard Button has onclick function to remove card from hand
			// 3. Removed card is pushed to Trash Pile

			this.player.discardCard(i)
			document.getElementById(this.player.element).innerHTML = this.player.showHand();
		}

		this.init = function() {
			this.startButton = document.getElementById('start')
			this.sortButton = document.getElementById('sort')
			this.knockButton = document.getElementById('knock')
			this.drawButton = document.getElementById('draw')
			this.pickupButton = document.getElementById('pickup')

			this.startButton.addEventListener('click', this.startHandler.bind(this))
			this.sortButton.addEventListener('click', this.sortHandler.bind(this))
			this.knockButton.addEventListener('click', this.knockHandler.bind(this))
			this.drawButton.addEventListener('click', this.drawHandler.bind(this))
			this.pickupButton.addEventListener('click', this.pickupHandler.bind(this))
		}

		this.startGame = function() {

			Deck.init();
			Deck.shuffleDeck();

			this.opponent = new Player(Deck.dealHand() , 'opponent');

			this.player = new Player( Deck.dealHand(), 'player');

			document.getElementById(this.opponent.element).innerHTML = this.opponent.showHand();
			document.getElementById(this.player.element).innerHTML = this.player.showHand();
			
		}
	}

	return {
		init: Game.init.bind(Game)
	}
})()