// array of deck images
const deckCards = [
    "bulbasaur.png", 
    "bulbasaur.png", 
    "charmander.png", 
    "charmander.png", 
    "clefairy.png", 
    "clefairy.png", 
    "ditto.png", 
    "ditto.png", 
    "eevee.png", 
    "eevee.png", 
    "meowth.png", 
    "meowth.png", 
    "psyduck.png", 
    "psyduck.png", 
    "rattata.png", 
    "rattata.png",
    "slowpoke.png",
    "slowpoke.png",
    "squirtle.png",
    "squirtle.png",
];

// audio togglebutton
var x = document.getElementById("myAudio"); 

function playAudio() { //play button
  x.play(); 
} 
function pauseAudio() { //pause button
  x.pause(); 
} 

// access deck
const deck = document.querySelector(".deck");

// empty array for flipped cards
let flipped = [];

// empty array for matched cards
let matched = [];

// modal
const modal = document.getElementById("modal");

// reset button
const reset = document.querySelector(".reset-btn");

// play again?
const playAgain = document.querySelector(".play-again-btn");

// moves counter variable
const movesCount = document.querySelector(".moves-counter");
let moves = 0;

// timer
const timeCounter = document.querySelector(".timer");
let time;
let minutes = 0;
let seconds = 0;
let timeStart = false;

// deck shuffle function
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

// start game
function startGame() {
	// shuffle deck
	const shuffledDeck = shuffle(deckCards); 
	// Iterate over deck of cards array
	for (let i = 0; i < shuffledDeck.length; i++) {
		// Create the <li> tags
		const liTag = document.createElement('LI');
		// Give <li> class of card
		liTag.classList.add('card');
		// Create the <img> tags
		const addImage = document.createElement("IMG");
		// Append <img> to <li>
		liTag.appendChild(addImage);
		// Set the img src path with the shuffled deck
		addImage.setAttribute("src", "./images/" + shuffledDeck[i] + "?raw=true");
		// Update the new <li> to the deck <ul>
		deck.appendChild(liTag);
	}
}
startGame();

// remove card
function removeCard() {
	while (deck.hasChildNodes()) {
		deck.removeChild(deck.firstChild);
	}
}

// update timer when game starts
function timer() {
	// Update the count every 1 second
	time = setInterval(function() {
		seconds++;
			if (seconds === 60) {
				minutes++;
				seconds = 0;
			}
		timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer: " + minutes + " Mins " + seconds + " Secs" ;
	}, 1000);
}

// stop timer when all cards are matched
function stopTime() {
	clearInterval(time);
}

// reset everything
function resetEverything() {
	// reset time
	stopTime();
	timeStart = false;
	seconds = 0;
	minutes = 0;
	timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer: 00:00";
	// reset moves
	moves = 0;
	movesCount.innerHTML = 0;
	// Clear arrays
	matched = [];
	flipped = [];
	// Clear the deck
	removeCard();
	// new deck
	startGame();
}

// moves counter
function movesCounter() {
	// Update the html for the moves counter
	movesCount.innerHTML ++;
	// Keep track of the number of moves for every pair checked
	moves ++;
}

//card matcher
function compareTwo() {
	// if there are two flipped cards...
	if (flipped.length === 2) {
  		// disable mouse
  		document.body.style.pointerEvents = "none";
  }
	// check cards
	if (flipped.length === 2 && flipped[0].src === flipped[1].src) {
		// if they match...
		match();
	} else if (flipped.length === 2 && flipped[0].src != flipped[1].src) {
        // if they don't match...
		noMatch();
	}
}

//matched card function
function match() {
	setTimeout(function() {
		flipped[0].parentElement.classList.add("match");
		flipped[1].parentElement.classList.add("match");
		// push matched cards to matched array
		matched.push(...flipped);
		// enable mouse again
		document.body.style.pointerEvents = "auto";
		// check to see if flipped cards has reached 20
		winGame();
		// Clear flipped array
		flipped = [];
	}, 600);
	// increment moves by 1
	movesCounter();
}

//no match function
function noMatch() {
	setTimeout(function() {
		// take off flip, reset back to face down
		flipped[0].parentElement.classList.remove("flip");
		flipped[1].parentElement.classList.remove("flip");
		// enable mouse again
		document.body.style.pointerEvents = "auto";
		// Remove cards from flipped tray
		flipped = [];
	}, 700);
	// increment moves by 1
	movesCounter();
}

// update modal with time and moves
function AddStats() {
	const stats = document.querySelector(".modal-content");
	for (let i = 1; i <= 3; i++) {
		const statsElement = document.createElement("p");
		statsElement.classList.add("stats");
		stats.appendChild(statsElement);
	}
	let p = stats.querySelectorAll("p.stats");
		p[0].innerHTML = "Completed in: " + minutes + " Mins " + seconds + " Secs";
		p[1].innerHTML = "Moves made: " + moves;
}

// modal
function displayModal() {
const modalClose = document.getElementsByClassName("close")[0];
	// set modal to show
	modal.style.display= "block";
	// close modal on 'x'
	modalClose.onclick = function() {
		modal.style.display = "none";
	};
}

// winning the game
function winGame() {
	if (matched.length === 20) {
		stopTime();
		AddStats();
		displayModal();
	}
}


// game behavior
deck.addEventListener("click", function(evt) {
	if (evt.target.nodeName === "LI") {
		if (timeStart === false) {
			timeStart = true; //start timer
			timer();
		}
        flipCard(); // flip card
	}

	//Flip the card
	function flipCard() {
		evt.target.classList.add("flip");
		// Call addToFlipped() function
		addToFlipped();
	}
	 
	//Add flipped cards to array
	function addToFlipped() {
		if (flipped.length === 0 || flipped.length === 1) {
			flipped.push(evt.target.firstElementChild);
		}
		// look at both flipped cards
		compareTwo();
	}
}); 

// reset button
reset.addEventListener('click', resetEverything);

// play again button
playAgain.addEventListener('click',function() {
	modal.style.display = "none";
	resetEverything();
});