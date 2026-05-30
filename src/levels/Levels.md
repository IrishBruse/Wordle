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

# Seeds (levels 0-3)

Levels 0-3 pick the secret from the answer pool using a four-digit seed shown at the bottom of the screen. The seed is rerolled when you open a level (including after reload or returning from Home). **New** after a win also rerolls; **Play again** after a loss keeps the same seed until you leave or reload.

Levels 4 and 5 use fixed answers and ignore the seed for word selection.
