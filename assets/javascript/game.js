
function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}

function isLetter(inputChr) {
    let letters = /^[a-zA-Z]+$/;
    if (inputChr.length == 1 && inputChr.match(letters)) {
        return true;
    }
    else { 
        return false; 
    }
}

let game = {
    wordBank: [
        "Cameron Frye", 
        "Sloane Peterson", 
        "Jeanie Bueller", 
        "Edward Rooney", 
        "Grace", 
        "Abe Froman, the Sausage King of Chicago", 
        "Ferris Bueller", 
        "Economics Teacher"
    ],
    imageBank: [
        "cameron.png", 
        "sloane-peterson.jpg", 
        "", 
        "edward-rooney.jpg",
        "",
        "",
        "ferris-bueller.jpg",
        ""
    ],
    songBank: [
        "Danke-Schoen.mp3",
        "Oh-Yeah.mp3",
        "Twist-and-Shout.mp3"
    ],
    currentWord: "", // chosen from the word bank
    currentImage: "", // corresponds to the mystery word
    currentSong: "", // plays when the player wins the game
    displayedWord: "", // only showing the letters that have been guessed
    started: false,
    guessesAllowed: 10,
    guessesRemaining: 0,
    wrongLetters: "",
    numWins: 0,
    audioPlayer: "",
    bigImage: "",

    // variables linked to screen elements
    txtInstructions: "",
    txtDisplayedWord: "",
    txtGuessesRemaining: "",
    txtWrongLetters: "",
    txtNumWins: "",
    
    init: function() {
        console.log("init function");
        this.txtInstructions = document.getElementById('instructions');
        this.txtNumWins = document.getElementById('num-wins');
        this.txtGuessesRemaining = document.getElementById('guesses-remaining');
        this.txtDisplayedWord = document.getElementById('displayed-word');
        this.txtWrongLetters = document.getElementById('wrong-letters');
        this.audioPlayer = document.getElementsByTagName('audio')[0];
        this.bigImage = document.getElementById('big-image');
        for (let i=0; i<this.imageBank.length; i++) {
            if (this.imageBank[i] === "") {
                this.imageBank[i] = "art-museum.png";
            }
        }
        this.bigImage.src = "assets/images/ferris-bueller.jpg";
    },

    start: function() {
        console.log("start function");
        this.started = true;
        this.txtInstructions.textContent = "Type a letter to guess!"; // Clear txtInstructions from screen
        this.chooseWord();
        this.guessesRemaining = this.guessesAllowed;
        this.wrongLetters = "";
        this.updateScreen();
        this.audioPlayer.pause();
        this.audioPlayer.controls = false;
        
    },

    chooseWord: function() {
        let randomIndex  = Math.floor(Math.random() * this.wordBank.length);
        this.currentWord = this.wordBank[randomIndex].toLowerCase();
        this.currentImage = this.imageBank[randomIndex]; // image to show when the puzzle is completed
        console.log("current word: " + this.currentWord);
        this.displayedWord = ('_').repeat(this.currentWord.length);
        if (this.currentWord.includes(' ')) { // show spaces
            let i = 0
            while (this.currentWord.indexOf(' ', i) > -1) {
                this.displayedWord = replaceAt(this.displayedWord, this.currentWord.indexOf(' ', i), ' ');
                i = this.currentWord.indexOf(' ', i) + 1;
            }
            i = 0;
            while (this.currentWord.indexOf(',', i) > -1) {
                this.displayedWord = replaceAt(this.displayedWord, this.currentWord.indexOf(',', i), ',');
                i = this.currentWord.indexOf(',', i) + 1;
            }
        }
        this.currentSong = this.songBank[Math.floor(Math.random() * this.songBank.length)];
    },

    guess: function(letter) {
        console.log("guess: " + letter);
        // Check if key is a letter
        if (isLetter(letter)) {
            if (this.currentWord.includes(letter)) {
                console.log("good guess!");
                let i = 0
                while (this.currentWord.indexOf(letter, i) > -1) {
                    this.displayedWord = replaceAt(this.displayedWord, this.currentWord.indexOf(letter, i), letter);
                    i = this.currentWord.indexOf(letter, i) + 1;
                }
                if (this.displayedWord === this.currentWord) {
                    this.txtInstructions.textContent = "You win! Nice job. Press any key to play again.";
                    this.numWins++;
                    this.started = false;
                }
            } else if (!this.wrongLetters.includes(letter)) { // ignore wrong guesses that have already been made
                console.log("bad guess!");
                this.guessesRemaining--;
                console.log("guesses remaining: " + this.guessesRemaining);
                this.wrongLetters += letter;
            }
            this.updateScreen();

            if (this.guessesRemaining <= 0) {
                this.txtInstructions.textContent = "You lose! The correct answer was" + this.currentWord.toUpperCase() + ". Press any key to play again.";
                this.started = false;
            }
        }           
    },

    playSong: function() {
        this.audioPlayer.src = "assets/audio/" + this.currentSong;
        this.audioPlayer.play();
        this.audioPlayer.controls = true;
        this.bigImage.src = "assets/images/" + this.currentImage;
    },

    updateScreen: function() {
        this.txtDisplayedWord.textContent = this.displayedWord.toUpperCase();
        this.txtGuessesRemaining.textContent = this.guessesRemaining;
        this.txtWrongLetters.textContent = this.wrongLetters.toUpperCase();
        this.txtNumWins.textContent = this.numWins;
    }

};

game.init();

document.onkeyup = function(event) {
    if (!game.started) {
        game.start();
    } else if (isLetter(event.key)) {
        game.guess(event.key);
        if (!game.started) {
            game.playSong();
        }
    }
}


  

