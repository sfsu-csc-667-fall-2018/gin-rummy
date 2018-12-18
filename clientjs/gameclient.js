var { PLAYER_JOINED, WELCOME, WITHDRAW_CARD, TRANSFER_TO_HAND, STARTGAME, WAIT, UPDATE_SERVER, UPDATE_CLIENT, CARDS_MELDED , WITHDRAW_CARD, SUCCESS, DISCARD_CARD, SUCCESSFUL_MELD, FAILED_MELD, PICKED_MELD_CARD, PICKED_MELD_SUCCESS, CARDS_LAYOFF, WIN, TIE, GAME_MESSAGE } = require('../constants/events')
var gameMessages = require('../constants/gameMessages')
var socket = io('/game');

initChat(socket);

var uri = window.location.pathname;

var game = {
  gameId : gameId = uri.split("/")[2],
}

var gameJSON
var tempMeldCards = [] 
const NUM_CARDS_IN_SUIT = 13;

const intializeSocket = () => {
  socket.on( WAIT, displayWait )
}

const displayWait = (data) => {
  $('#gameArea').hide();
  $('#waitingArea').show();
  $('#waitMessage').html(data.msg);
  
}

const displayWin = (data) => {

  if(parseInt(data.playerId) == game.playerId) {
    $('#waitMessage').html(gameMessages.MSG_WIN);
  }
  else {
    $('#waitMessage').html(gameMessages.MSG_LOST);
  }

  $('#gameArea').hide();
  $('#waitingArea').show();

}


$(document).ready(function() {
 
  bindEvents()
  intializeSocket()

  socket.emit( PLAYER_JOINED, {gameId: game.gameId} )

  socket.on( WELCOME, (data) => {
    game.playerId = data.playerId;
  })

  socket.on(STARTGAME, (json) => {
    gameJSON = json
    updateGame(json);
  })

  socket.on(UPDATE_SERVER, updateGame);
  socket.on(SUCCESS, success);
  socket.on(SUCCESSFUL_MELD, onSuccessfulMeld);
  socket.on(FAILED_MELD, onFailedMeld);
  socket.on(PICKED_MELD_SUCCESS, onSuccessfulMeldPick)
  socket.on(WIN, displayWin)
  socket.on(TIE, displayWait)
  socket.on(GAME_MESSAGE, changeMessage)
})

const bindEvents = () => {
  $('#Deck a:not(.bound)').addClass('bound').on('click', takeDeckCard);
  $('#DiscardPile a:not(.bound)').addClass('bound').on('click', takeDiscardPileCard);
  $('#meldToggle:not(.bound)').addClass('bound').on('click', toggleMeld);

  if($('#meldToggle').attr('value') == 'meld_off') {
    $('#PlayerHand div:not(.bound)').addClass('bound').on('click', discardCard);
    $('#meld_area div').off();
  }
  else if($('#meldToggle').attr('value') == 'meld_on') {
    $('#PlayerHand div:not(.bound)').addClass('bound').on('click', pickMeldCards);
    $('#meld_area div:not(.bound)').addClass('bound').on('click', layoffMeldCards);
  }
}

const toggleMeld = () => {
 
  $('#PlayerHand div').removeClass('bound');
  $('#PlayerHand div').off();

  if($('#meldToggle').attr('value') == 'meld_off') {
    $('#meldToggle').attr('value', 'meld_on');
    $('#meldToggle').html('Stop Meld');
    $('#meld_area *').prop('disabled', false);
  }
  else if($('#meldToggle').attr('value') == 'meld_on') {
    $('#meldToggle').attr('value', 'meld_off');
    $('#meldToggle').html('Start Meld');
    $('#meld_area *').prop('disabled', true);

    stopMeldingCards();
  }

  bindEvents();
}

const takeDiscardPileCard = (event) => {
  if ($('#DiscardPile').hasClass('disabled')) return;

  var card = $(event.target).attr('cardvalue');

  var cardId = gameJSON.discard_pile.pop()

  gameJSON.playerHands[game.playerId].push(cardId)

  socket.emit(WITHDRAW_CARD, gameJSON)
  bindEvents();
}

const takeDeckCard = (event) => {
  if ($('#Deck').hasClass('disabled')) return;

  var card = $(event.target).attr('cardvalue');

  var cardId = gameJSON.deck.pop()

  gameJSON.playerHands[game.playerId].push(cardId)

  socket.emit(WITHDRAW_CARD, gameJSON)
  bindEvents();
}

const success = (json) => {
  var turn = json.turn.toString();
  if(turn.localeCompare(game.playerId) == 0)
  {
    $('#Deck').removeClass('enabled').addClass('disabled');
    $('#DiscardPile').removeClass('enabled').addClass('disabled');
    $('#PlayerHand').removeClass('disabled').addClass('enabled');
    $('#meldToggle').prop( "disabled", false );
  }
}

const discardCard = (event) => {

  if ($('#PlayerHand').hasClass('disabled')) return;
  var card = parseInt($(event.target).attr('cardvalue'));

  if(card >=1 && card <= 52) {
    var indexOfCardToRemove = gameJSON.playerHands[game.playerId].indexOf(parseInt(card));
  }

  gameJSON.playerHands[game.playerId].splice(indexOfCardToRemove, 1);
  gameJSON.discard_pile.push(card);

  socket.emit( DISCARD_CARD, gameJSON)
  bindEvents();
}

const layoffMeldCards = (event) => {
  var regexDigit = /\d+/;
  var cardsDivid = $(event.target.parentNode).attr('id');
  var meldId = parseInt(cardsDivid.match(regexDigit));

  var layoffJSON = gameJSON;
  layoffJSON.layoffId = meldId;
  tempMeldCards.forEach( (card) => {
    layoffJSON.melds[meldId].push(card);
  });

  socket.emit(CARDS_LAYOFF, { meldJSON:layoffJSON, gameJSON:gameJSON, layoffLength:tempMeldCards.length });

  bindEvents();
  event.stopPropagation();
}

const pickMeldCards = (event) => {

  var card = $(event.target).attr('cardvalue');

  $('#temp_meld').append("<div id='card"+card+"' cardvalue="+card+" />")
  tempMeldCards.push(parseInt(card));

  var indexOfCardToRemove = gameJSON.playerHands[game.playerId].indexOf(parseInt(card));
  gameJSON.playerHands[game.playerId].splice(indexOfCardToRemove, 1);

  socket.emit(PICKED_MELD_CARD, gameJSON);
  bindEvents();
}

const stopMeldingCards = () => {

  meldJSON = gameJSON;
  meldJSON.melds[gameJSON.meldId] = tempMeldCards;

  socket.emit(CARDS_MELDED, gameJSON, meldJSON);

  bindEvents();
}

const changeMessage = (msgJson) => {
  var messageBar = document.getElementById("Message");
  if(msgJson.turn.localeCompare(game.playerId)==0)
  messageBar.innerHTML = msgJson.msg;

}
const emitUpdate = () => {
  socket.emit(UPDATE_CLIENT, gameJSON)
}

const onSuccessfulMeld = (json) => {
  $('#temp_meld').empty();
  tempMeldCards.length = 0;
  updateGame(json);
  success(json);
}

const onFailedMeld = (json) => {

  var playerHand = "";
  var turn = json.turn.toString();

  tempMeldCards.forEach( (card) => {
    json.playerHands[game.playerId].push(card);
  });
  $('#temp_meld').empty();
  tempMeldCards.length = 0;
  updateGame(json);
  success(json);
}

const onSuccessfulMeldPick = (json) => {
  var playerHand = "";
  var turn = json.turn.toString();

  if(game.playerId == turn) {
    json.playerHands[game.playerId].forEach((value)=> {
      playerHand = playerHand + "<div id='card"+value+"' cardvalue="+value+" />";
    })
    $('#PlayerHand').html(playerHand);
  }
  bindEvents();
}

const updateMeldArea = (json) => {
  $('#meld-area').empty();
  gameJSON = json;
  var meldIds = Object.keys(json.melds);
  var meldAreaSets = "";

  meldIds.forEach( (meldId) => {
    meldAreaSets = meldAreaSets + "<div id='meld"+ meldId + "' class='row'>";
    json.melds[meldId].forEach( (card) => {
      meldAreaSets = meldAreaSets + "<div style = width:30% id='card" + card + "' cardvalue=" + card + " />";
    });
    meldAreaSets = meldAreaSets + " </div>";
  });
  $('#meld_area').html(meldAreaSets);
}

const updateGame = (json) => {
  $('#gameArea').show();
  $('#waitingArea').hide();
  gameJSON = json

  var playerHand = ""
  var opponentHand = ""

  var players = Object.keys(json.playerHands)
  players.forEach((p) => {
    if(p.localeCompare(game.playerId)==0){
      json.playerHands[p].forEach((value)=> {
        playerHand = playerHand + "<div id='card"+value+"' cardvalue="+value+" />";
      })
      $('#PlayerHand').html(playerHand)
    }
    else {
      json.playerHands[p].forEach((value)=> {
        opponentHand = opponentHand + "<div id='card53' />";
      })
      $('#OpponentHand').html(opponentHand)
    }
  })

  var deck = ""
  deck = "<a><div id='card53' cardvalue="+json.deck[json.deck.length-1]+" /></a>";
  $('#Deck').html(deck)

  var discardPile = ""
  discardPile = "<a><div id='card"+json.discard_pile[json.discard_pile.length-1]+"' cardvalue="+json.discard_pile[json.discard_pile.length-1]+" /></a>";
  $('#DiscardPile').html(discardPile)

  $('#temp_meld').html("");
  $('#meld-area').empty();
  var meldIds = Object.keys(json.melds);
  var meldAreaSets = "";
  meldIds.forEach( (meldId) => {
    meldAreaSets = meldAreaSets + "<div id='meld"+ meldId + "' class='row'>";
    json.melds[meldId].forEach( (card) => {
      meldAreaSets = meldAreaSets + "<div id='card" + card + "' cardvalue=" + card + " />";
    });
    meldAreaSets = meldAreaSets + " </div>";
  });
  $('#meld_area').html(meldAreaSets);

  checkTurn(json.turn.toString());
  bindEvents();
}

const checkTurn = (turn) => {
  var messageBar = document.getElementById("Message");
  var messageText = '';

  if(turn.localeCompare(game.playerId)==0)
  {
    $('#Deck').removeClass('disabled').addClass('enabled');
    $('#DiscardPile').removeClass('disabled').addClass('enabled');
    $('#PlayerHand').removeClass('enabled').addClass('disabled');
    $('#meldToggle').prop( "disabled", true );

    messageText = "Your turn. Choose a card from deck or discard pile.";
  }
  else {

    $('#Deck').removeClass('enabled').addClass('disabled');
    $('#DiscardPile').removeClass('enabled').addClass('disabled');
    $('#PlayerHand').removeClass('enabled').addClass('disabled');
    $('#meldToggle').prop( "disabled", true );

    messageText = "Opponent's Turn";
  }
  messageBar.innerHTML = messageText;
}
