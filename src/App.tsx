import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  //retrieves a random word from our word dictionary to be guessed
  const [wordToGuess, setWordToGuess] = useState(getWord);

  console.log("WORD: ", wordToGuess);

  //store letters guessed by player
  //right most empty square brackets mean its initialized to an empty array
  //"string<[]>" means its going to be an array of strings
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  //this list includes any letters that do not spell the wordToGuess
  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  //check loser
  //6 body parts = 6 guesses
  const isLoser = incorrectLetters.length >= 6;

  //check winner
  //if every letter in word is in guessedLetters, then we solved it
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;

      //adds letter to the end of aray of current letters
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    //handler: our event listener
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      console.log("Key pressed: ", key);

      //regExpression that checks for a single letter
      //if key pressed does not match a letter from  a-z,
      //then return nothing (return)
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    //enables and removes it appropriately:
    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      console.log("Key pressed: ", key);

      if (key !== "Enter") return;

      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };

    //enables and removes it appropriately:
    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  //style maximizes:
  //the size of screen depending on the proportion
  //centers everything on screen
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column", //items stack on top of eachother
        gap: "2rem", //space out items
        margin: "0 auto", //center everything in size
        alignItems: "center", //center all objects
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner! - Refresh to play again"}
        {isLoser && "Nice try - Refresh to play again"}
      </div>

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div
        style={{
          alignSelf: "stretch",
        }}
      >
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
