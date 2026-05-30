# Level 0: Classic

Tutorial puzzle at `/play`. Standard Wordle rules and colors.

- **Objective:** Guess the hidden five-letter word in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary.
- **Feedback:**
  - **Green:** Letter is correct and in the exact position.
  - **Yellow:** Letter is in the word but in a different position.
  - **Gray:** Letter is not in the word.

Winning unlocks level 1 on the home screen.

# Level 1: Double Agent

Layout matches Classic; only the color meanings change.

- **Objective:** Guess the hidden five-letter word in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary.
- **Feedback (inverted colors):**
  - **Yellow:** Letter is correct and in the exact position.
  - **Green:** Letter is in the word but in a different position.
  - **Gray:** Letter is not in the word.

# Level 2: The Blue Herring

Layout matches Classic but introduces a permanent decoy feedback state.

- **Objective:** Guess the hidden five-letter word in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary.
- **Feedback (Standard colors + Blue Decoy):**
  - **Green:** Letter is correct and in the exact position.
  - **Yellow:** Letter is in the word but in a different position.
  - **Gray:** Letter is not in the word.
  - **Blue:** On the first guess, one random column is forced to Blue (establishing the herring letter). Every tile with that letter stays Blue for the rest of the run, on the board and keyboard. Other letters in that column use normal scoring.

# Level 3: Conveyor Belt

Layout matches Classic, but the target word shifts positions after every successful discovery.

* **Objective:** Guess the hidden five-letter word in six attempts or fewer.
* **Word validity:** Each guess must be a valid five-letter word from the dictionary, or any left-rotation of the hidden word (rotated targets are often not dictionary words).
* **Feedback (Shifting Target):**
* **Green:** Letter is correct and in the exact position.
* **Yellow:** Letter is in the word but in a different position.
* **Gray:** Letter is not in the word.
* **The Conveyor Mechanic:** Once the player finds at least one Green letter on a turn, the target word rotates its letters to the left by one position for the next turn (e.g., WAVER becomes AVERW). The game evaluates the next guess against this new rotated word. Subsequent turns continue to rotate the word by one position each turn as long as the active target word is not solved.

# Level 4: Hardcoded

Layout matches Classic, but the game challenges the player to crack a fixed, predefined word with no color hints.

- **Objective:** Guess the hidden five-letter word in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary.
- **Feedback (blind):**
  - **Gray:** Every letter on every non-winning guess (no green or yellow hints).
  - **Green:** All tiles turn green only when the full word is guessed correctly.
- **The Hardcoded Mechanic:** The target word is permanently `shart` for all players and seeds. Unlike other levels, the secret is not chosen from the daily answer pool.

