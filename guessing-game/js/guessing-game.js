/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

const heading = document.querySelector('h1');
const additionMsg = document.querySelector('p');

// user guess and submit button
const inputElement = document.getElementById('guess');
const submitBtn = document.getElementById('submit-btn');

const remainingEle = document.getElementById("numGuesses");
const list = document.getElementsByTagName('li');
const hintBtn = document.getElementById('hint-btn');

function disableBtns() {
    submitBtn.disabled = true;
    hintBtn.disabled = true;

    // this will prevent css styling for hover
    submitBtn.style.pointerEvents = "none";
    hintBtn.style.pointerEvents = "none";

    // styling tp indicate button is disabled
    submitBtn.style.opacity = "0.7";
    hintBtn.style.opacity = "0.7";
}

function enableBtns() {
    submitBtn.disabled = false;
    hintBtn.disabled = false;
    submitBtn.style.pointerEvents = "auto";
    hintBtn.style.pointerEvents = "auto";
    submitBtn.style.opacity = "1";
    hintBtn.style.opacity = "1";
}


class Game {
    constructor()  {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }

    difference() {
        return Math.abs(this.winningNumber - this.playersGuess);
    }

    isLower() {
        return this.playersGuess < this.winningNumber;
    }

    playersGuessSubmission(guess) {
        if (guess < 1 || guess > 100 || isNaN(guess)) throw 'That is an invalid guess.';
        this.playersGuess = guess;

        return this.checkGuess(this.playersGuess);
    }

    checkGuess(guess) {
        let feedback = '';
        let feedbackHint = 'Reset Game to play again!';

        if (guess === this.winningNumber) {
            feedback = `You Win! The winning number is ${this.winningNumber}.`;
            remainingEle.innerHTML = 'Nice job!';

            // User has won - disable the submit and hint buttons
            disableBtns();
            
        } else if (this.pastGuesses.includes(guess)) {
            feedback = 'You have already guessed that number.';
            feedbackHint = 'Guess a number between 1-100';
        } else {
            // update the guess and count of remaining guesses onto the page
            this.pastGuesses.push(guess);

            const index = this.pastGuesses.length;
            list[index - 1].innerHTML = guess;

            const remaining = 5 - index;
            switch (remaining) {
                case 0:
                    remainingEle.innerHTML = 'Better luck next time!';
                    break;
                case 1:
                    remainingEle.innerHTML = 'Only 1 guess remaining...';
                    break;
                default:
                    remainingEle.innerHTML = `${remaining} guesses remaining...`;
            }


            // if user makes 5 wrong guesses
            if (this.pastGuesses.length === 5) {
                feedback = `You Lose... The winning number was ${this.winningNumber}.`;

                // User has lost, disable the submit and hint buttons
                disableBtns();
            } else {
                // provide feedback message to user
                const diff = this.difference();
                
                if (diff < 10) feedback = "You're burning up!";
                else if (diff < 25) feedback = "You're lukewarm.";
                else if (diff < 50) feedback = "You're a bit chilly.";
                else feedback = "You're ice cold!";

                feedbackHint = (this.isLower()) ? 'Guess Higher!' : 'Guess Lower!';
            }
        }

        heading.innerHTML = feedback;
        additionMsg.innerHTML = feedbackHint;
        return feedback;
    }

    provideHint() {
        const hintArr = new Array();
        hintArr.push(this.winningNumber);
        hintArr.push(generateWinningNumber());
        hintArr.push(generateWinningNumber());

        return shuffle(hintArr);
    }
}

// returns an random integer from 1 to 100
function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

// Uses the Fisher-Yates shuffle algorithm
function shuffle(arr) {
    let length = arr.length;
    var currentEle, i;

    // while there are remaining elements to shuffle
    while (length) {
        // randomly select an index of remaining element
        i = Math.floor(Math.random() * length--);

        // perform the swap/shuffle
        currentEle = arr[length];
        arr[length] = arr[i];
        arr[i] = currentEle;
    }

    return arr;
}


function newGame() {
    // clear any old game info from the page
    heading.innerHTML = 'Guessing Game';
    additionMsg.innerHTML = 'Guess a number between 1-100';
    inputElement.value = '';
    Array.from(list).forEach(element => element.innerHTML = '');
    remainingEle.innerHTML = 'You have 5 guesses!';

    // enable the buttons again
    enableBtns();
    
    return new Game();
}


function playGame() {
    let game = newGame();
    // console.log("winning number: ", game.winningNumber);

    // guess button
    submitBtn.addEventListener('click', function() {
        const guess = Number(inputElement.value);
        inputElement.value = '';

        // submit the user's guess and check it
        game.playersGuessSubmission(guess);       
    });


    // hint button
    hintBtn.addEventListener('click', function() {
        const hintArr = game.provideHint();
        heading.innerHTML = `The winning number is ${hintArr[0]}, ${hintArr[1]}, or ${hintArr[2]}`;
    });


    // reset game button
    let resetBtn = document.getElementById('reset-btn');

    resetBtn.addEventListener('click', function() {
        game = newGame();
    });
}

playGame();