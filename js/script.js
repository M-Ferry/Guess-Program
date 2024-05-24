  //The unordered list where the player's guessed letters appear
  const guessedLettersElement = document.querySelector(".guessed-letters");
 
  //Button with the text Guess! in it
  const guessLetterButton = document.querySelector(".guess");
  
  ///The text input where the player will guess a letter
  const letterInput = document.querySelector(".letter");
  
  ///The empty paragraph where the word in progress will appear
  const wordInProgress = document.querySelector(".word-in-progress");
  
  ///The paragraph where the remaining guesses will display
  const remainingGuessesElement = document.querySelector(".remaining");
  
  //The span inside the paragraph where the remaining guesses will display
  const remainingGuessesSpan = document.querySelector(".remaining span");
  
  ///The empty paragraph where messages appear when player guesses letter
  const message = document.querySelector(".message");
  
  //The hidden button that will appear prompting the player to play again
  const playAgainButton = document.querySelector(".play-again");
  
  //variable called word given value of Magnolia -- used let instead of const or program doesn't work
  let word = "magnolia";
  let guessedLetters = [];
  let remainingGuesses = 8;
  
  
  /// ASYNC FUNCTION GOES HERE  
  const getWord = async function () {
    const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    placeholder(word);
  };
  
  ///Fire off the game , calling the function
  getWord();            
  
  
  ///Write a Function to Add Placeholders for Each Letter
  ///Display our symbols as placeholders for the chosen word's letters
  const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
     // console.log(letter);
    ///emoji for placeholder   
      placeholderLetters.push("◻️");
    }
    wordInProgress.innerText = placeholderLetters.join("");
  };
  ///call the function
  //placeholder(word); written out of solutions 5 of 6  
  
  ///add an event listener when you click guessButton
  guessLetterButton.addEventListener("click", function (e) {
    //prevent default behavior when clicking button (form submitting and then reloading page)
    e.preventDefault();
    ///empty message paragraph 
  message.innerText = "";
  ///Let's grab what was entered
  const guess = letterInput.value;
  ///Let's make sure that it is a single letter
  const goodGuess = validateInput(guess);
  
  if (goodGuess) {
    ///We've got a letter! Let's guess!!
  makeGuess(guess); // calling inside if loop
  }
  letterInput.value = "";
  });
  
  ////CREATE A FUNCTION TO CHECK PLAYERS INPUT to validate the player's input.
  const validateInput = function (input) {
  ///inside the function, create a variable for the accepted letter sequence
  /// make sure it is only A thru Z
  const acceptedLetter = /[a-zA-Z]/; 
   ///no letter entered
    if (input.length === 0) {
      ////Is the input empty?
      message.innerText = "C'mon, don't be shy, enter a letter.";
   ////more than one letter entered
    } else if (input.length > 1) {
      ///Did you type more than one number???
      message.innerText = "Only one letter at a time, please.";
    ////Did you type a number, a special character or something not a letter?
    } else if (!input.match(acceptedLetter)) {
      message.innerText = "Please enter a letter A to Z.";
    } else {
      ///finally got a single letter calling it.
      return input;
    }
  };
  
  const makeGuess = function (guess) {
    ////make letters capitals
    guess = guess.toUpperCase();
    ///Already guessed that letter
    if (guessedLetters.includes(guess)) {
      message.innerText = "Ooops! You already tried that letter."
    } else {
    ///push letter into guess list  
      guessedLetters.push(guess);
      console.log(guessedLetters);
      updateGuessesRemaining(guess);
      showGuessedLetters();
      updateWordInProgress(guessedLetters);
    
    }
  }; 
  
  const showGuessedLetters = function () {
    ///clear the list first
    guessedLettersElement.innerHTML = "";
  for (const letter of guessedLetters) {
    const li = document.createElement("li");
    li.innerText = letter;
    guessedLettersElement.append(li);
    }
  };
  
  //a function to update the word in progress. will replace placeholders w correct letters guessed.
  const updateWordInProgress = function (guessedLetters) {
    ///change word variable to uppercase
    const wordUpper = word.toUpperCase();
  ///variable to split the word string into an array so that letters can appear in guessedLetters array.
    const wordArray = wordUpper.split("");
    const revealWord = [];
  for (const letter of wordArray) {
    if (guessedLetters.includes(letter)) {
      revealWord.push(letter.toUpperCase());
    } else {
      revealWord.push("◻️");
      }
    }
  //console.log(revealWord);
  
  wordInProgress.innerText = revealWord.join("");
  checkIfWin();
  };
  /////!!!!!  okay up to here 5/9/24
  
  
  const updateGuessesRemaining = function (guess) {
    const upperWord = word.toUpperCase();
  if (!upperWord.includes(guess)) {
    /// bad guess, lose a chance
    message.innerText = `Sorry, the word has no ${guess}.`;
    remainingGuesses -= 1;
  } else {
    message.innerText = `Good guess! The word has the letter ${guess}.`;
  }
  
  if (remainingGuesses === 0) {
    message.innerHTML = `Game over! The word was <span class="highlight">${word}</span>.`;
  startOver();
  } else if (remainingGuesses === 1) {
    remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
  } else {
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
  }
  };
  
  const checkIfWin = function () {
    if (word.toUpperCase() === wordInProgress.innerText) {
      message.classList.add("win");
      message.innerHTML = `<p class="highlight">You guessed the correct word! Congrat!</p>`;
  
      startOver();
    }
  };
  
  const startOver = function () {
    guessLetterButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgainButton.classList.remove("hide");
  };
  
  
  playAgainButton.addEventListener("click", function () {
    ///reset all original values - grab new word
    message.classList.remove("win");
    guessedLetters = [];
    remainingGuesses = 8;
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    guessedLettersElement.innerHTML = "";
    message.innerText = "";
    ///Grab a new word
    getWord();
  
  
    /// show the right UI elements
    guessLetterButton.classList.remove("hide");
    playAgainButton.classList.add("hide");
    remainingGuessesElement.classList.remove("hide");
    guessedLettersElement.classList.remove("hide");
  
  });
  
  ///Gone over code line by line is correct 5/13/24