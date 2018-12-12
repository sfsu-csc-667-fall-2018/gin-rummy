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

		return `<button id="discard" type="button" value="` + i + `" disabled>
			<div class="card ` + this.suit + `">
			<div class="rank">` + this.rank + `</div>
			<div class="suit">`+ suitUnicodes[this.suit] + `</div>
			</div></button>`;
	}

	Card.prototype.showOpCard = function(i) {
		return `<div class="cardback" value"` + i + `"></div>`;
	}

	Card.prototype.showOp2Card = function(i) {				
		return `<div class="cardback-side" value"` + i + `"></div>`;
	}

	Card.prototype.showTrashCard = function(i) {
		var suitUnicodes = {
				'CLUBS' : '&#9827;',
				'HEARTS' : '&#9829;',
				'DIAMONDS' : '&#9830;',
				'SPADES' : '&#9824;'
			}

		return `<button id="trashpile" value="`+ i + `">
			<div class="card ` + this.suit + `">
			<div class="rank">` + this.rank + `</div>
			<div class="suit">`+ suitUnicodes[this.suit] + `</div>
			</button>`;
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
		var temp = this.hand.splice(i, 1);		
		return(temp.pop());
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
		} 
		else if( this.element == 'opponent') {
			for(var i = 0; i < this.hand.length; i++) {
				hand += this.hand[i].showOpCard(i);
			}
			return hand;
		}
		else if( this.element == 'opponent2') {
			for(var i = 0; i < this.hand.length; i++) {
				hand += this.hand[i].showOp2Card(i);
			}
			return hand;
		}
		else {
			for(var i = 0; i < this.hand.length; i++) {
				hand += this.hand[i].showOp2Card(i);
			}
			return hand;
		}

	}

	Player.prototype.checkHandSize = function() {
		if (this.hand.length > 7) {
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
		
		var quadFlag = false;
		for(var i = 0; i < temp.length; i++) {
			if( temp[i].length == 4) {
				quadFlag = true;
			}
		}
		console.log("quads: "+ quadFlag);
	}

	function Trash(trash, oldTrash) {
		this.trash = trash;
		this.oldTrash = oldTrash;
	}

	Trash.prototype.addTrash = function(card) {
		this.trash.push(card);
	}

	Trash.prototype.popTrash = function() {
		return(this.trash.pop());
	}

	Trash.prototype.showTrash = function() {
		var trash = "";

		if (this.trash.length > 1) {
			this.oldTrash.push(this.trash[0]);
			this.trash.shift();
		}

		if (this.trash.length == 0 && this.oldTrash.length > 0) {
			this.trash.push(this.oldTrash.pop());
		}
		for(var i = 0; i < this.trash.length; i++) {
			trash += this.trash[i].showTrashCard(i);
		}
		return trash;
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
			for ( var i = 0; i < 7; i++) {
				var temp = this.deck.pop();
				// console.log("Your hand:" + temp);
				hand.push(temp);
			}
			return hand;
		}

		this.popTop = function() {
			return this.deck.pop();
		}
	}

	var Game = new function() {
		this.gameStarted = false;

		this.startHandler = function() {
			Game.startGame();
			this.startButton.disabled = true
			this.sortButton.disabled = false
			// this.pickupButton.disabled = false
			this.drawButton.disabled = false
			this.knockButton.disabled = true
		}

		this.sortHandler = function() {
			this.player.checkTrips(this.player.getHand());
			this.player.checkQuads(this.player.getHand());
		}

		this.drawHandler = function() {
			this.drawButton.disabled = true;
			this.sortButton.disabled = true;

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
			var card = this.trash.popTrash();
			this.player.addCard(card)

			document.getElementById(this.player.element).innerHTML = this.player.showHand();
			document.getElementById('trash').innerHTML = this.trash.showTrash();

			if(this.player.checkHandSize()) {
				this.drawButton.disabled = true;
				this.sortButton.disabled = true;
				var discardButtons = document.querySelectorAll('[id^="discard"]');

				for( var i = 0; i < discardButtons.length; i++) {
					discardButtons[i].disabled = false;
					discardButtons[i].addEventListener('click', this.discardEvent.bind(this, i))
				}


			}
		}

		this.knockHandler = function() {
			this.drawButton.disabled = true
			// this.pickupButton.disabled = true
			this.sortButton.disabled = true
		}

		// Event when card is drawn, player
		// must discard a card 
		this.discardEvent = function(i) {
			// 1. Append discard buttons to div's of each card 
			// 2. Discard Button has onclick function to remove card from hand
			// 3. Removed card is pushed to Trash Pile

			this.trash.addTrash(this.player.discardCard(i));

			document.getElementById(this.player.element).innerHTML = this.player.showHand();
			document.getElementById('trash').innerHTML = this.trash.showTrash();

			this.pickupButton = document.getElementById('trashpile');
			this.pickupButton.addEventListener('click', this.pickupHandler.bind(this));

			this.drawButton.disabled = false
			this.sortButton.disabled = false
		}

		this.init = function() {
			this.startButton = document.getElementById('start')
			this.sortButton = document.getElementById('sort')
			this.knockButton = document.getElementById('knock')
			this.drawButton = document.getElementById('draw')
			// this.pickupButton = document.getElementById('pickup')

			this.startButton.addEventListener('click', this.startHandler.bind(this))
			this.sortButton.addEventListener('click', this.sortHandler.bind(this))
			this.knockButton.addEventListener('click', this.knockHandler.bind(this))
			this.drawButton.addEventListener('click', this.drawHandler.bind(this))
			// this.pickupButton.addEventListener('click', this.pickupHandler.bind(this))
		}

		this.startGame = function() {

			Deck.init();
			Deck.shuffleDeck();

			this.opponent = new Player(Deck.dealHand() , 'opponent');

			this.opponent2 = new Player(Deck.dealHand(), 'opponent2');

			this.opponent3 = new Player(Deck.dealHand(), 'opponent3');

			this.player = new Player( Deck.dealHand(), 'player');

			var tempTrash = [];
			var tempOldTrash = [];
			this.trash = new Trash( tempTrash, tempOldTrash ); 

			this.trash.addTrash(Deck.popTop());

			document.getElementById(this.opponent.element).innerHTML = this.opponent.showHand();
			document.getElementById(this.opponent2.element).innerHTML = this.opponent2.showHand();
			document.getElementById(this.opponent3.element).innerHTML = this.opponent3.showHand();
			document.getElementById(this.player.element).innerHTML = this.player.showHand();
			document.getElementById("trash").innerHTML = this.trash.showTrash();

			this.pickupButton = document.getElementById('trashpile');

			this.pickupButton.addEventListener('click', this.pickupHandler.bind(this));
		}
	}

	return {
		init: Game.init.bind(Game)
	}
})()