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

Winning unlocks level 2 on the home screen.

# Level 2: The Blue Herring

Layout matches Classic but introduces a permanent decoy feedback state.

- **Objective:** Guess the hidden five-letter word in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary.
- **Feedback (Standard colors + Blue Decoy):**
  - **Green:** Letter is correct and in the exact position.
  - **Yellow:** Letter is in the word but in a different position.
  - **Gray:** Letter is not in the word.
  - **Blue:** On the first guess, one random column is forced to Blue (establishing the herring letter). Every tile with that letter stays Blue for the rest of the run, on the board and keyboard. Other letters in that column use normal scoring.

Winning unlocks level 3 on the home screen.

# Level 3: Conveyor Belt

Layout matches Classic, but the target word shifts positions after every successful discovery.

- **Objective:** Guess the hidden five-letter word in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary, or any left-rotation of the hidden word (rotated targets are often not dictionary words).
- **Feedback (Shifting Target):**
  - **Green:** Letter is correct and in the exact position.
  - **Yellow:** Letter is in the word but in a different position.
  - **Gray:** Letter is not in the word.
- **The Conveyor Mechanic:** Once the player finds at least one Green letter on a turn, the target word rotates its letters to the left by one position for the next turn (e.g., WAVER becomes AVERW). The game evaluates the next guess against this new rotated word. Subsequent turns continue to rotate the word by one position each turn as long as the active target word is not solved.

Winning unlocks level 4 on the home screen.

# Level 4: Hardcoded

Layout matches Classic, but the game challenges the player to crack a fixed, predefined word with no color hints.

- **Objective:** Guess the hidden five-letter word in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary.
- **Feedback (blind):**
  - **Gray:** Every letter on every non-winning guess (no green or yellow hints).
  - **Green:** All tiles turn green only when the full word is guessed correctly.
- **The Hardcoded Mechanic:** The target word is permanently `shart` for all players and seeds. Unlike other levels, the secret is not chosen from the answer pool.

Winning unlocks level 5 on the home screen.

# Level 5: Phantom

Layout matches Classic on the surface: five tiles and six rows. The secret is longer than it looks.

- **Objective:** Guess the hidden word in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary. The full six-letter word `wordle` is also accepted when entered with the hidden letter (see below).
- **Feedback (standard colors on five tiles):**
  - **Green:** Letter is correct and in the exact position.
  - **Yellow:** Letter is in the word but in a different position.
  - **Gray:** Letter is not in the word.
  - Scoring considers the full six-letter answer, including a letter that is never shown on the board. For example, **E** can be yellow in a five-letter guess even though only five tiles are visible.
- **The Phantom Mechanic:**
  - The target is permanently `wordle` (six letters) for all players and seeds.
  - Only five tiles are shown. After the row is full, the player can type one more letter; it is stored but not displayed.
  - **Backspace** removes two letters at a time so the extra slot stays hidden.
  - Only the first five tiles are revealed after each guess. The sixth letter stays hidden even on a win.
  - On a loss, only the first five letters of the answer are shown (`WORDL`), not the full word.
  - To win, submit the complete word `wordle` (type **E** after **WORDL** fills the row, then press Enter).

# Level 6: Almost

Layout matches Classic; guesses use the normal dictionary.

- **Objective:** Guess the hidden five-letter string in six attempts or fewer.
- **Word validity:** Each guess must be a valid five-letter word from the dictionary, or exactly the hidden answer (which is not in the dictionary).
- **Feedback (standard colors):**
  - **Green:** Letter is correct and in the exact position.
  - **Yellow:** Letter is in the word but in a different position.
  - **Gray:** Letter is not in the word.
- **The Almost Mechanic:** The secret is a real answer-pool word with exactly one letter replaced (position and replacement letter come from the seed). The result is not a dictionary word, but you can submit it once you figure it out. Other guesses must be valid words.

Winning unlocks level 7 on the home screen.

# Level 7: Symbols

Layout matches Classic on the board (five tiles), but letters and guesses use symbol substitutions. You get eight guesses.

- **Objective:** Guess the hidden five-character string in eight attempts or fewer.
- **Word validity:** Each guess must be a real five-letter dictionary word written in **leet form**: substitute **A** -> `@`, **I** -> `!`, **O** -> `0`, and **S** -> `$` wherever those letters appear; leave all other letters as normal. Plain spelling is not accepted (e.g. `crane` is invalid, `cr@ne` is valid if `crane` is in the list). Random symbol strings that do not decode to a dictionary word are invalid.
- **Feedback (standard colors):**
  - **Green:** Character is correct and in the exact position.
  - **Yellow:** Character is in the word but in a different position.
  - **Gray:** Character is not in the word.
- **The Symbols Mechanic:**
  - The secret is a seeded answer-pool word with the same four substitutions applied (e.g. `crane` -> `cr@ne`, `audio` -> `@ud!0`).
  - Scoring compares guesses to the encoded secret character for character.
  - Tap **123** on the keyboard to open the numbers and symbols layout; tap **ABC** to return to letters. Mapped symbols (`@`, `!`, `0`, `$`) can also be typed from the letter rows where those keys exist.

This is the final numbered level.

# Seeds (levels 0-3, 6-7)

Levels 0-3, 6, and 7 pick the secret from the answer pool (or a seed-derived variant) using a four-digit seed shown at the bottom of the screen. The seed starts at `0001` and increments when you open a level (including after reload or returning from Home), lose, or press **New** after a win. **Play again** after a loss keeps the same seed until you leave or reload.

Levels 4 and 5 use fixed answers and ignore the seed for word selection.

