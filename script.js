// puzzle menu
var puzzle = document.getElementsByClassName('puzzle');
var cont = document.getElementById('pwrapper');
var footer = document.getElementById('footer');

var score = 0;
var piece;
var pieceList = [];
var shuffled;


for (let i = 0; i < puzzle.length; i++) {
  puzzle[i].onclick = () => {
    if (cont.querySelectorAll('.chosen').length == 0) {
      puzzle[i].style.background = '#fff';
      puzzle[i].style.transform = 'scale(calc(56/27))';
      puzzle[i].style.zIndex = '99';
      // break image into parts
      let img = puzzle[i].getElementsByTagName('img');
      for (let a = 0; a < 16; a++) {
        img[a].style.margin = '0 calc(27px/56) calc(27px/56) 0';
      }
      puzzle[i].style.margin = '0';
      // new piece list
      puzzle[i].classList.add('chosen');
      piece = puzzle[i].getElementsByTagName('img');
      // reset score 
      score = 0;
      updtScore();
      // show shuffle button and score
      footer.style.opacity = '1';
      footer.style.marginTop = '0';

      play();
    }
  }
}

// display score
function updtScore () {
  var scoreDisplay = document.getElementsByClassName('score')[0].getElementsByTagName('span')[0];
  scoreDisplay.innerHTML = score;

}



// call when a puzzle is chosen
function play () {

var chosen = document.getElementsByClassName('chosen')[0];

for (let i = 0; i < 16; i++) {
  pieceList.push(piece[i].src);
} 

/* original order of pieces */
var origOrder = pieceList;

var shuffleBtn = document.getElementsByClassName('shuffle')[0];

function shuffle () {
  /* reset if shuffled again */
  score = 0;
  updtScore();

  var pieceOrder = [];
  var used = [];
  var randomPiece = pieceList[Math.floor(Math.random() * 16)];
  for (var i = 0; i < 16; i++) {
    if (i > 0) {
      randomPiece = pieceList[Math.floor(Math.random() * 16)];
      while(used.includes(randomPiece)) {
        randomPiece = pieceList[Math.floor(Math.random() * 16)];
      }
    }
    pieceOrder.push(randomPiece);
    used.push(randomPiece);
  }
  return pieceOrder;
}

shuffleBtn.onclick = () => {
  pieceList = shuffle();
  /* show shuffled pieceList */
  for (let i = 0; i < 16; i++) {
    piece[i].src = pieceList[i];
  }
  shuffled = true; 
}


// user plays
var clicked1, clicked2;
var counter = 0; /* keeps track of if clicked piece is 1 or 2 */

for (let i = 0; i < 16; i++) {
  piece[i].onclick = () => {
    if ((counter == 0) && shuffled) {
      clicked1 = piece[i].src;
      /* make piece glow */
      piece[i].style.boxShadow = "0 0 8px 8px #cbeeed";
      piece[i].style.zIndex = "9999";
      piece[i].style.filter = "grayscale(0%)";
      score++;
      updtScore();
      counter++;
    } 
    /* click on second image and switch */
    else if ((counter == 1) && shuffled) {
      clicked2 = piece[i].src;
      if (clicked1 !== clicked2) {
        swap();
      } else {
        /* unclick */
        piece[getIndex(clicked1, pieceList)].style.boxShadow = 'none';
      }
      score++;
      updtScore();
      if (gameOver()) {
        popup();
      }
      counter = 0; /* next piece is clicked1 */
    }
  }
}

// grayscale images not clicked on
function grayscale (clickedIndex) {
  for (let i = 0; i < 16; i++) {
    if (i !== clickedIndex) {
      piece[i].style.opacity = "0.9";
      piece[i].style.filter = "grayscale(75%)";
      piece[i].onmouseover = () => {
        piece[i].style.opacity = "1";
        piece[i].style.filter = "grayscale(0%)";
      }
      piece[i].onmouseout = () => {
        piece[i].style.opacity = "0.9";
        piece[i].style.filter = "grayscale(75%)";
      }
    }
  }
}

// swap pieces
function swap () {
  /* insert pieces back into new positions */
  swapItems();
  /* visually swap */
  for (let i = 0; i < 16; i++) {
    piece[i].src = pieceList[i];
  }
  /* remove glow */
  piece[getIndex(clicked2, pieceList)].style.boxShadow = "none";
}


function getIndex (item, array) {
  var index;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == item) {
      index = i;
    }
  }
  return index;
}

function swapItems () {
  counter = 0;
  // get index of clicked pieces
  var index1 = getIndex(clicked1, pieceList);
  var index2 = getIndex(clicked2, pieceList);
  // delete pieces from array
  delete pieceList[getIndex(clicked1, pieceList)];
  delete pieceList[getIndex(clicked2, pieceList)];
  // replace undefined items with the other piece
  for (let i = 0; i < pieceList.length; i++) {
    if (pieceList[i] == undefined) {
      // the second piece is later in the array
      if (index2 > index1) {
        if (counter == 0) {
          pieceList[i] = clicked2;
          counter++;
        } else {
          pieceList[i] = clicked1;
        }
      } // the second piece is earlier in the array
      else if (index2 < index1) {
        if (counter == 0) {
          pieceList[i] = clicked1;
          counter++;
        } else {
          pieceList[i] = clicked2;
        }
      }
    }
  }
}



// reset
function reset () {
  score = 0;
}


// game over 
function gameOver() {
  var count = 0;
  for (let i = 0; i < 16; i++) {
    if (pieceList[i] == origOrder[i]) {
      count++;
    }
  }
  if (count == 16) {
    return true;
  }
  return false;
}

/* popup */
var gopopup = document.getElementsByClassName('gameover')[0];
var overlay = document.getElementsByClassName('overlay')[0];
var finalScore = gopopup.getElementsByTagName('span')[0];

function popup () {
  finalScore.innerHTML = score;
  gopopup.style.animation = "fadeIn 1s";
  overlay.style.animation = "fadeIn 1s";
  gopopup.style.visibility = "visible";
  overlay.style.visibility = "visible";
  gopopup.style.opacity = "1";
  overlay.style.opacity = "1";
}

// return to menu 
var menu = [gopopup.getElementsByTagName('button')[0], footer.getElementsByTagName('button')[1]];

for (let i = 0; i < 2; i++) {
menu[i].onclick = () => {
/* go back to menu */
    chosen.style.transform = 'scale(1)';
    chosen.style.margin = '10px';
    chosen.style.zIndex = '1';
    chosen.style.background = 'none';
    for (let a = 0; a < 16; a++) {
      piece[a].style.margin = '0';
      piece[a].style.boxShadow = 'none'; 
    }
    // unshuffle
    pieceList = origOrder;
    for (let i = 0; i < 16; i++) {
      piece[i].src = pieceList[i];
    }
    /* reset */ 
    pieceList = [];
    shuffled = false;
    /* close popup */
    if (i == 0) {
    gopopup.style.visbility = 'none';
    overlay.style.visibility = "none";
    gopopup.style.opacity = "0";
    overlay.style.opacity = "0";
    gopopup.style.animation = "fadeOut 1s";
    overlay.style.animation = "fadeOut 1s";
    overlay.style.zIndex = '0';
    }
    for (let a = 0; a < puzzle.length; a++) {
      if (puzzle[a].classList.contains('chosen')) {
        puzzle[a].classList.remove('chosen');
        /* hide footer */
        footer.style.opacity = '0';
        footer.style.marginTop = '40px';
      }
    }
  }
}



}  // end wait function 

