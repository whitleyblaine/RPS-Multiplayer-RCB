// Chat vars
var playerID;
var chatCounter = 0;

// Player 1 var
var p1LoggedIn = false;
var p1Choice = '';
var p1Name = '';
var p1Wins = 0;
var p1Losses = 0;
var winLossP1 = $("<span id='winLossP1Span'>").html("Wins: " + p1Wins + " Losses: " + p1Losses);

// Player 2 var
var p2Choice = '';
var p2Name = '';
var p2Wins = 0;
var p2Losses = 0;
var winLossP2 = $("<span id='winLossP2Span'>").html("Wins: " + p2Wins + " Losses: " + p2Losses);

// Turn
var turn = 0;

// RPS buttons
var rock = $('<button class="btn btn-success RPSButtons" id="rockBtn">').text('Rock');
var paper = $('<button class="btn btn-success RPSButtons" id="paperBtn">').text('Paper');
var scissors = $('<button class="btn btn-success RPSButtons" id="scissorsBtn">').text('Scissors');

var rock2 = $('<button class="btn btn-success RPSButtons" id="rockBtn">').text('Rock');
var paper2 = $('<button class="btn btn-success RPSButtons" id="paperBtn">').text('Paper');
var scissors2 = $('<button class="btn btn-success RPSButtons" id="scissorsBtn">').text('Scissors');

var rpsDiv1 = $('<div id="rpsDiv1">').append(rock).append(paper).append(scissors);
var rpsDiv2 = $('<div id="rpsDiv2">').append(rock2).append(paper2).append(scissors2);


// Firebase var
var database = new Firebase("https://rcb-rps-multiplayer.firebaseio.com/");
var players = database.child("players");
var chatBox = database.child("chat");
var player1 = players.child('1');
var player2 = players.child('2');

// Reset function w/ time interval

var reset = function() {
  p1Choice = null;
  p2Choice = null;
  turn = 1;
  $('#resultsDiv').html('<h2>Results</h2>');
  if (playerID == 1) {
    $('#rpsDiv1').removeClass('hide');
  };
  player1.update({'choice': p1Choice,});
  player2.update({'choice': p2Choice,});
  database.update({'turn': turn})
}

// Show Results function
var showResults = function() {
  var winner;
  if (p1Choice == p2Choice && p1Choice != null) {
    winner = "SYKE! You tied!";
  }
  else if (p1Choice == "Rock" && p2Choice == "Scissors") {
    winner = p1Name;
    p1Wins++;
    p2Losses++;
  }
  else if (p1Choice == "Paper" && p2Choice == "Rock") {
    winner = p1Name;
    p1Wins++;
    p2Losses++;
  }
  else if (p1Choice == "Scissors" && p2Choice == "Paper") {
    winner = p1Name;
    p1Wins++;
    p2Losses++;
  }
  else if (p1Choice == "Rock" && p2Choice == "Paper") {
    winner = p2Name;
    p2Wins++;
    p1Losses++;
  }
  else if (p1Choice == "Paper" && p2Choice == "Scissors") {
    winner = p2Name;
    p2Wins++;
    p1Losses++;
  }
  else if (p1Choice == "Scissors" && p2Choice == "Rock") {
    winner = p2Name;
    p2Wins++;
    p1Losses++;
  }
  else {winner = "Wait...what? Try that again..."};

  player1.update({'wins': p1Wins, 'losses': p1Losses});
  player2.update({'wins': p2Wins, 'losses': p2Losses});

  winLossP1.html("Wins: " + p1Wins + " Losses: " + p1Losses);
  winLossP2.html("Wins: " + p2Wins + " Losses: " + p2Losses);

  $('#resultsDiv').html(
    '<h2>' + p1Name + ' choice: ' + p1Choice + '</h2>' +
    '<h2>' + p2Name + ' choice: ' + p2Choice + '</h2>' +
    '<h2>And the winner is... ' + winner + '!</h2>'
  );
  setTimeout(function() {reset()}, 5000);
}

// Reset button
$('#resetButton').on('click', function() {
  database.set({});
  window.location.reload();
});

// Enter Name, Start Game
$('#startGame').on('click', function() {
  if (p1Name == null) {
    p1Name = $('#nameInput').val();
    playerID = 1;
    player1.set({
      'name': p1Name,
      'losses': p1Losses,
      'wins': p1Wins
    });
  } else {
    p2Name = $('#nameInput').val();
    playerID = 2;
    database.update({'turn': turn, 'chatCounter': chatCounter})
    player2.set({
      'name': p2Name,
      'losses': p2Losses,
      'wins': p2Wins
    });
  };
  $('#nameDiv').addClass('hide');
  $('#chatDiv').removeClass('hide');
  $('#chatForm').removeClass('hide');

  return false;
});

$('#chatSubmit').on('click', function() {
  chatCounter++;
  database.update({'chatCounter': chatCounter});

  var message = $('#chatInput').val();
  if (playerID == 1) {
    player1.update({'message': message});
  }
  else if (playerID == 2) {
    player2.update({'message': message});
  }
  return false;
})

player1.child('message').on('value', function(snapshot) {
  var p1Message = snapshot.val();
  if (playerID == 1) {
    var messageDiv = $('<div class="clearfix">').html('<blockquote class="me pull-right">' + p1Message + '</blockquote');
  } else if (playerID == 2) {
    var messageDiv = $('<div class="clearfix">').html('<blockquote class="you pull-left">' + p1Message + '</blockquote');
  };
  $('#chatBody').append(messageDiv);
});

player2.child('message').on('value', function(snapshot) {
  var p2Message = snapshot.val();
  if (playerID == 1) {
    var messageDiv = $('<div class="clearfix">').html('<blockquote class="you pull-left">' + p2Message + '</blockquote');
  } else if (playerID == 2) {
    var messageDiv = $('<div class="clearfix">').html('<blockquote class="me pull-right">' + p2Message + '</blockquote');
  };
  chatCounter++;
  $('#chatBody').append(messageDiv);
});

database.child('chatCounter').on('value', function(snapshot) {
  var chatCounterSynced = snapshot.val();
  if(chatCounterSynced > 15) {
    $('#chatBody').html('');
    chatCounter = 0;
    database.update({'chatCounter': chatCounter});
  }
});



player1.child("name").on('value', function(snapshot) {
  p1Name = snapshot.val();
  if (p1Name != null) {
    $('#player1Div').html('<h2>' + p1Name + '<h2>').append(winLossP1);
  }
});

player2.child("name").on('value', function(snapshot) {
  p2Name = snapshot.val();
  if (p2Name != null) {
    $('#player2Div').html('<h2>' + p2Name + '<h2>').append(winLossP2);
    if (playerID == 1) {
      $('#player1Div').append(rpsDiv1);
    }
    turn = 1;
    database.update({'turn': turn})
  }
});

database.child('turn').on('value', function(snapshot) {
  turn = snapshot.val();
  if (turn == 2) {
    $('#rpsDiv1').addClass('hide');
    if (playerID == 2) {
      $('#rpsDiv2').removeClass('hide');
      $('#player2Div').append(rpsDiv2);
    };
  } else if (turn == 3) {
    $('#rpsDiv2').addClass('hide');
    showResults();
  }
});

player1.on('value', function(snapshot) {
  p1Choice = snapshot.val().choice;
});

player2.on('value', function(snapshot) {
  p2Choice = snapshot.val().choice;
});

$(document).on('click', '.RPSButtons', function() {
  var userChoice = this.innerHTML;
  if (turn == 1) {
    p1Choice = userChoice;
    player1.update({
      'choice': p1Choice
    });
    turn = 2;
    database.update({'turn': turn});
  } else if (turn == 2) {
    p2Choice = userChoice;
    player2.update({
      'choice': p2Choice
    });
    turn = 3;
    database.update({'turn': turn});
  };
})