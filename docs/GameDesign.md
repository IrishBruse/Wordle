# Game design

Design notes for the Wordle variant in this repo. Behavior described here matches the current implementation.

## Overview

- Five-letter words, six guesses per puzzle.
- Guesses must appear in the allowed word list. Answers are drawn from the first 2,315 words of that list (NYT-style answer pool).
- Feedback uses three tile states: correct position, present elsewhere, absent. Keyboard hints merge across guesses (strongest state wins per letter).

## Level progression

| Id | Name | Route | Unlock |
| --- | --- | --- | --- |
| 0 | Classic | `/play` (tutorial) | Always available |
| 1 | Double Agent | `/play/1` | After winning level 0 |

- The home page (`/`) shows a **Play** button until the player wins the tutorial once. After that, it lists numbered puzzles (id 1 and up). Locked puzzles appear grayed out until unlocked.
- Winning a level unlocks the next level id in `localStorage` (`wordle-max-unlocked-level`). There is no separate save of in-progress boards.
- Level-specific rules and color semantics live with each level under `src/levels/{id}/design.md`.

## Seeds and puzzles

Each level keeps its own run seed in `localStorage` (`wordle-seed-{levelId}`).

- The seed picks the secret word deterministically (Mulberry32 RNG over the answer pool).
- The active seed is always shown at the bottom of the play screen as a base62 code (digits, `a-z`, `A-Z`).
- **Loss:** When the player uses all six guesses without winning, the game rolls a new seed immediately and shows the previous answer in the message. The displayed seed updates to the new run.
- **New / Play again:** Starts a fresh board. If the last run ended in a loss, the seed from the loss roll is reused. Otherwise a new seed is rolled (including after a win).

## Input and feedback

- Letters: on-screen keyboard or physical keyboard (`Enter`, `Backspace`, A-Z).
- `Ctrl`/`Cmd` + `Backspace` clears the current row.
- Invalid submit (too few letters or not in the word list) shakes the row and shows a short message; input is not consumed.
- After a valid guess, tiles flip in sequence; input is disabled until the row reveal finishes.
- **Show hint** reveals level-specific guidance (color meanings differ on Double Agent).

## End of run

- **Win:** Success message, guess count, **Play again**, and **Continue** to the next level when it is unlocked.
- **Loss:** Message includes the answer; **Play again** uses the new seed from the loss roll.

## Out of scope (not implemented)

- Daily puzzle / shared global word
- Account sync or server-side progress
- Levels beyond id 1 (config may add more; routes and home list follow `LEVELS` in code)
