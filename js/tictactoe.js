//Naming some variables I'll probably use

	var x = 'X';
	var o = 'O';

	var currentPlayer = x;				//first player will be x
	var turn = 0;
	var board = [null, null, null, null, null, null, null, null, null];

	var renderMessage = function(message) {
		$('.message').html(message);
	};

	renderMessage('Current Player: ' + currentPlayer);

	var changePlayer = function() {
		if (currentPlayer === x) {
			currentPlayer = o;
			renderMessage('Current Player: ' + currentPlayer);
		} else {
			currentPlayer = x;
			renderMessage('Current Player: ' + currentPlayer);		}
	};

	var checkMove = function(index) {
		//if I click on a box that already has something, message invalid and don't do anything
		if (board[index] === null) {
			return true;
		} else {
			renderMessage('Try another tile, bud');
			return false;
		}
	};

	var makeMove = function($tile, index) {
		//I want each box on the board when clicked to become an index for 
		//the array and set it to current player
		board[index] = currentPlayer;
		//add 'x' or 'o' to the clicked tile on the html!!!
		$tile.html(currentPlayer);
		turn += 1;
	};

	var playAgain = function () {
		$('.tile').html("");
		board = [null, null, null, null, null, null, null, null, null];
		turn = 0;
		changePlayer();
		renderMessage('Current Player: ' + currentPlayer);
	};

		

// figuring out the winner

	var checkWinner = function() {
		var winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
		winningIndex = -1;

		//using .each to iterate via a given index value
		$.each(winningCombos, function(index, winningCombos) {
			//when index = 0 pass winning combo [0,1,2] to 3ofkind and check all three the same (and !null)
			if (threeOfKind (winningCombos)) {
				winningIndex = index;
				return false;
			}
		});

		if(winningIndex !== -1) {
			return winningCombos[winningIndex];
		//if still no winning index(ie it's still -1), and its been 9 turn, end game (this is the tie)
		} else if (turn === 9) {
			return true;
		} else {
			return false;
		}
	};

	var threeOfKind = function(innerCombo) {
		return (board[innerCombo[0]] !== null) 
			&& (board[innerCombo[0]] === board[innerCombo[1]]) 
			&& (board[innerCombo[0]] === board[innerCombo[2]])
	};

	//function to 
	var endGame = function(endFormation) {
		var endMessage;
		if ($.isArray(endFormation)) {
			endMessage = 'Player ' + currentPlayer + ' wins';
			if (currentPlayer === x) {
				player1.currentWins++;
				player1.render();
			} else {
				player2.currentWins++;
				player2.render();
			}	
			displayWinner(endFormation);
		} else {
			endMessage = 'Ties suck - better play again';
		}

		$('.message').addClass('end-message');
		renderMessage(endMessage);
	};

	//when game ends, turn off click listener in gameboard 
	$('.gameboard').off('click');
	//and reload page on when play again is clicked
	$('.play-again').show().on('click', function() {
		playAgain();
	});

	var displayWinner = function (formation) {
		$.each(formation, function (index, winPosition) {
			$('.tile').eq(winPosition).addClass('winning-tile');
		});
	};

	var init = function($tile) {
		//on click, create index var based on the tile id
		var index = $tile.attr('id');
		if (checkMove(index)) {
			//if checkmove on this tile is true (null spot), the make move
			makeMove($tile, index);
			//depending on who is current player, stick x or o in the tile
			//check for winner >> if winner, then show winner, if not, keep playing
			var winFormation = checkWinner();
			if (winFormation) {
				endGame(winFormation);
			} else {
				changePlayer();
			};
		};
	};

	var player1 = {
		name: prompt("Player X, please enter your first name") || "Walter W.",
		currentWins: 0,
		render: function (){
			
			var $player1 = $('#playerbox1');
			$player1.empty();
			
			var $name1 = $('<div>').text("Player X :  " + this.name).addClass("name1");
			$player1.append($name1);

			var $wins1 = $('<div>').text("Wins :  " + this.currentWins).addClass("wins1");
			$player1.append($wins1);
		}	
	};

	player1.render();

	var player2 = {
		name: prompt("Player O, please enter your first name") || "Jesse P.",
		currentWins: 0,
		render: function (){
			
			var $player2 = $('#playerbox2');
			$player2.empty();
			
			var $name2 = $('<div>').text("Player O :  " + this.name).addClass("name2");
			$player2.append($name2);

			var $wins2 = $('<div>').text("Wins :  " + this.currentWins).addClass("wins2");
			$player2.append($wins2);	
		}
	};	

	player2.render();

$(document).ready(function() {
	$('.gameboard').on('click', '.tile', function() {
		init($(this));
	});
});