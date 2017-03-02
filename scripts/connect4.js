(function () { //IIFY
	//TODO feint indication on hover

	var width = 7;
	var height = 6;
	var winLength = 4;
	var players = 2;
	var board;
	var isYellowTurn;
	//var boardHtml;
	var k, l ;
	var maxTurns, turns;
	var gameOver;

	var table = document.getElementById("board");
	var resetButton = document.getElementById("resetBtn");
	var turn = document.getElementById("turn");
	var winMessage = document.getElementById("winMessage");
	var inpWidth = document.getElementsByName('width');
	var inpHeight = document.getElementsByName('height');
	var inpWinLength = document.getElementsByName('winLength');
	var inpPlayers = document.getElementsByName('players');


	resetButton.addEventListener("click", initialize);
	table.addEventListener("click", makeMove);

	//flow
	initialize();

	function initialize() {
		width = Number(inpWidth[0].value); //have to cast to number
		height = Number(inpHeight[0].value);
		winLength = Number(inpWinLength[0].value);
		players = Number(inpPlayers[0].value);
		//need to add checks and error message on these values;

		var boardHtml = "<tbody>";
		var selectorHtml = "<tbody><tr>";
		board = new Array(height);
		for (var i = height-1; i >= 0; i--) {
			boardHtml += "<tr class=\"row" + i + "\">";
			board[i] = new Array(width);
		
			for (var j = 0; j < width; j++) {
				boardHtml += "<td class=\"col" + j + "\"></td>";
				selectorHtml += "<td></td>";
				
			}
			boardHtml += "</tr>";
		}
		boardHtml += "</tbody>";
		selectorHtml += "</tr></tbody>";
		// add selector html to element
		table.innerHTML = boardHtml;

		winMessage.className = "hide";
		gameOver = false;
		maxTurns = height*width;
		turns = 0;
		isYellowTurn = false;
		changeTurn();
	}

	function changeTurn() {
		isYellowTurn = !isYellowTurn;
		if (isYellowTurn) {
			turn.className = "yellow";
			turn.innerHTML = "Yellow";
		}
		else {
			turn.className = "red";
			turn.innerHTML = "Red";			
		}
	}

	function makeMove(e) {
		//find where was clicked
		var target = e.target;
		if (!target.getAttribute("class") || gameOver) 
			return; //if clicked in board but outside of a cell
		

		l = target.getAttribute("class").substring(3,4);
		//k = target.parentElement.getAttribute("class").substring(3,4);
		console.log("l: " + l);

		//check if move is possible
		var i = 0;
		while (i<height){
			console.log("board[i][l]: " + board[i][l]);
			if(!board[i][l]) {
				if(isYellowTurn)
			 		board[i][l] = 'Y';
			 	else
			 		board[i][l] = 'R';

			 	k = i;
			 	console.log("k: " + k);
			 	break;
			}
			i++;
			if(i === height) //both should be integers
				return; //if move not possible
		}

		//play move
		var selector ="tr.row" + k + " td.col" + l;
		console.log(selector);
		var cell = document.querySelector(selector); 
		if (isYellowTurn) {
			cell.className += " yellow";
		}
		else {
			cell.className += " red";
		}
		turns++;
		//check for win & draw
		checkWin(k, l);

		//change sides
		changeTurn();

	}

	function checkWin(row, col){
		//TODO: resolve undefined has won error (worked before inputs)

		var match = board[row][col];
		var count = 0;
		//check horizontal
		for (var i = Math.max(0,col-(winLength-1)); i < Math.min(width,col+(winLength-1)); i++) {
			if(board[row][i] === match) {
				count++;
				if (count === winLength) {
					winner(match);
					return;
				}
			}
			else
				count = 0;
		}
		//check vertical
		count = 0;
		for (var i = Math.max(0,row-(winLength-1)); i < Math.min(height,row+(winLength-1)); i++) {
			if(board[i][col] === match) {
				count++;
				if (count == winLength) {
					winner(match);
					return;
				}
			}
			else
				count = 0;
		}
		//check diagonal
		// checks full diag, could be optimized
		// only go (winLength-1) steps in all directions
		//diag1 left bottom to right top
		count = 0;
		var i = row, j = col;
		while(i > 0 && j > 0) { //goto edge
			i--;
			j--;
		}
		while(i < height && j < width) {
			if(board[i][j] === match) {
				count++;
				if (count >= winLength) {
					winner(match);
					return;
				}
			}
			else
				count = 0;
			i++;
			j++;
		}
		//diag2 left top to right bottom (bug at rightmost top)
		count = 0;
		var i = row, j = col;
		while(i < height-1 && j > 0) {
			i++;
			j--;
		}
		while(i >= 0 && j < width) {
			if(board[i][j] === match) {
				count++;
				if (count >= winLength) {
					winner(match);
					return;
				}
			}
			else
				count = 0;
			i--;
			j++;
		}

		//check if board is full
		if (turns === maxTurns)
			winner("D");

	}

	function winner(arg) { // show different messages on argument
		gameOver = true;
		var winner;
		switch(arg) {
			case "Y":
				winner = "yellow";

				break;
			case "R":
				winner = "red";
				break;
			case "D":
			alert("The game is a DRAW!");
			winMessage.innerHTML = "The game is a DRAW!";
			winMessage.className = "";
			return;
		}

		alert(winner + " has won!!!");
		winMessage.className = "";
		winMessage.innerHTML = "<span class='"+ winner + "'>" + winner + "</span> has won!!!";
		
	}

})();
