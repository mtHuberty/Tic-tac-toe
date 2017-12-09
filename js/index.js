'use strict'
const chooseX = document.getElementById("chooseX");
const chooseO = document.getElementById("chooseO");
const newGame = document.getElementById("newGame");
const modal = document.getElementById("startModalBG");
const endModal = document.getElementById("endModalBG");
let gameOver = false;
let board = document.getElementById("board");
let taken = [];
let available = [1,2,3,4,5,6,7,8,9];
let playerSquares  = [];
let cpuSquares = [];
let playerChoice = "";
let pTurn;
let cpuChoice = "";
let winMsg = "";
let winSets = [  [1,2,3],
                 [1,4,7],
                 [1,5,9],
                 [3,6,9],
                 [7,8,9],
                 [3,5,7],
                 [2,5,8],
                 [4,5,6]  ];

function startGame(){
  $("div.square").html("");
  $("div.square").css("cursor", "pointer");
  modal.style.display = "none";
  board.style.visibility = "visible";
  console.log("started! player chose " + playerChoice);
  if (!pTurn){
    setTimeout(function(){
      cpuTurn();
    }, 200);
  }
}

chooseX.onclick = function(){
  playerChoice = "X";
  cpuChoice = "O";
  pTurn = true;
  startGame();
}

chooseO.onclick = function(){
  playerChoice = "O";
  cpuChoice = "X";
  pTurn = false;
  startGame();
}

newGame.onclick = function(){
  reInitVars();
  modal.style.display = "block";
  board.style.visibility = "hidden";
  endModal.style.display = "none";
}

//This function checks if the next 2 squares in the winSet are in the available array. If so, 
//returns an available square. The cpu will use this to determine it's next move;
//assuming it's not on its first move AND it cannot win this move
function nextSquaresFree(winSetInd, sqInd){
  console.log("nextSquaresFree ran with " + winSetInd + " and " + sqInd);
  let tempWinSet = winSets[winSetInd].slice();
  tempWinSet.splice(sqInd, 1);
    if(available.indexOf(tempWinSet[0]) > -1 && available.indexOf(tempWinSet[1]) > -1){
      console.log("Square " + tempWinSet[0] + " and " + tempWinSet[1] + " are open! ");
      return tempWinSet[0];
    } else {
      return false;
    }
  }

//Should only be available on the player's turn
function pClick(e){
  if(pTurn && available.indexOf(parseInt(e.target.id)) > -1 ){
    let square = parseInt(e.target.id);
    if (taken.indexOf(square) === -1){
      taken.push(square);
      available.splice(available.indexOf(square), 1);
      playerSquares.push(square);
      document.getElementById(e.target.id).innerHTML = playerChoice;
      document.getElementById(e.target.id).style.cursor = "auto";
      $('#'+e.target.id).removeClass("highlight");
    }
    playerSquares.sort(function(a,b){return a-b;});
    console.log(playerSquares);
    winCheck();
    pTurn = false;
    setTimeout(function(){
      cpuTurn();
    }, 400);
  }
}

function cpuClick(squareID){
  if(winMsg){ return null; }
  let ID = squareID.toString();
  taken.push(squareID);
  available.splice(available.indexOf(squareID), 1);
  cpuSquares.push(squareID);
  document.getElementById(ID).innerHTML = cpuChoice;
  document.getElementById(ID).style.cursor = "auto";
  $('#'+ID).removeClass("highlight");
  console.log("I just clicked on square " + squareID + ". Remaining open squares: " + available);
  pTurn = true;
  winCheck();
}

function cpuTurn(){
  
  //if cpu has 2 out of 3, take the third
  for(let i=0; i<winSets.length; i++){
    let cpuScore = 0;
    let missingSquare = 0;
    if(cpuSquares.indexOf(winSets[i][0]) > -1){ cpuScore++ }
    else{missingSquare = winSets[i][0]};
    if(cpuSquares.indexOf(winSets[i][1]) > -1){ cpuScore++ }
    else{missingSquare = winSets[i][1]};
    if(cpuSquares.indexOf(winSets[i][2]) > -1){ cpuScore++ }
    else{missingSquare = winSets[i][2]}
    if(cpuScore === 2 && available.indexOf(missingSquare) > -1){
      console.log("I can win! Gonna go ahead and win now.");
      cpuClick(missingSquare);
      return null;
    }
  }
  
  //If player has 2 out of 3, block his third
  for(let i=0; i<winSets.length; i++){
    let pScore = 0;
    let missingSquare = 0;
    if(playerSquares.indexOf(winSets[i][0]) > -1){ pScore++ }
    else{missingSquare = winSets[i][0]};
    if(playerSquares.indexOf(winSets[i][1]) > -1){ pScore++ }
    else{missingSquare = winSets[i][1]};
    if(playerSquares.indexOf(winSets[i][2]) > -1){ pScore++ }
    else{missingSquare = winSets[i][2]};
    if(pScore === 2 && available.indexOf(missingSquare) > -1){
      console.log("Oh shit, player is gonna win, let's block him.");
      cpuClick(missingSquare);
      return null;
    }
  }
  
  //Otherwise, take a move to further cpu's game
  //If this is the cpu's first move, it will start on a random available square.
  if(cpuSquares.length < 1){
    console.log("It's my first turn...let's pick a random square");
    cpuClick(available[Math.floor(Math.random() * available.length)]);
    return null;
  }
  
  //If the computer can't win this turn, has no moves to block, and it isn't it's first turn, then it needs to mark
  //a square that is adjacent to its already marked square, more specifically, a square that is in the same winSet
  //as the marked square, where the third square is also available. So we setup a loop that iterates through the 
  //cpu current marked squares and checks 
  for(let i=0; i<cpuSquares.length; i++){
    for(let j=0; j<winSets.length; j++){
      let nSF0 = nextSquaresFree(j, 0);
      let nSF1 = nextSquaresFree(j, 1);
      let nSF2 = nextSquaresFree(j, 2);
      
      if(cpuSquares[i] === winSets[j][0] && nSF0 !== false){
        console.log("Trying to click on line 143 because nSF is " + nextSquaresFree(j, 0));
        cpuClick(nextSquaresFree(j, 0));
        return null;
      } else if(cpuSquares[i] === winSets[j][1] && nSF1 !== false){
        console.log("Trying to click on line 147 because nSF is " + nextSquaresFree(j, 1));
        cpuClick(nextSquaresFree(j, 1));
        return null;
      } else if(cpuSquares[i] === winSets[j][2] && nSF2 !== false){
        console.log("Trying to click on line 150 because nSF is " + nextSquaresFree(j, 2));
        cpuClick(nextSquaresFree(j, 2));
        return null;
      }
    }
  }
  winMsg = "It's a draw!"
  endGame();
}

//Should run after each turn.
function winCheck(){
  console.log("Checking for win...");
  
  let pWin = function (arr, item){
    for(let i=0; i<arr.length; i++){
      if(playerSquares.indexOf(arr[i][1]) > -1 && 
         playerSquares.indexOf(arr[i][0]) > -1 && 
         playerSquares.indexOf(arr[i][2]) > -1){
        return true;
      }
    }
  }
  
  let cpuWin = function (arr, item){
    for(let i=0; i<arr.length; i++){
      if(cpuSquares.indexOf(arr[i][1]) > -1 && 
         cpuSquares.indexOf(arr[i][0]) > -1 && 
         cpuSquares.indexOf(arr[i][2]) > -1){
        return true;
      }
    }
  }
  
  if(pWin(winSets, playerSquares)){
    console.log("You win!");
    winMsg = "You win!";
    endGame();
  } else if(cpuWin(winSets, cpuSquares)){
    console.log("CPU wins!");
    winMsg = "CPU wins!";
    endGame();
  } else if(available.length === 0){
    console.log("It's a draw...");
    winMsg = "It's a draw!";
    endGame();
  } else{
    console.log("No winner found")
  }
}

function endGame(){
  if(gameOver){ return null;}
  console.log("Ending game...");
  document.getElementById("endWinner").innerHTML = winMsg;
  endModal.style.display = "block";
  document.getElementById("endModalContent").style.opacity = "1";
  endModal.
  console.log(endModal);
  gameOver = true;
}

function reInitVars(){
  gameOver = false;
  taken = [];
  available = [1,2,3,4,5,6,7,8,9];
  playerSquares  = [];
  cpuSquares = [];
  playerChoice = "";
  pTurn = undefined;
  cpuChoice = "";
  winMsg = "";
  $(".square").addClass("highlight");
}