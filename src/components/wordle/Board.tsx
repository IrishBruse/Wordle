import type { TileData } from '#/game/types'
import { Row } from './Row'

type BoardProps = {
  rows: TileData[][]
  revealingRow: number | null
  shakeRow: number | null
}

export function Board({ rows, revealingRow, shakeRow }: BoardProps) {
  return (
    <div className="board" role="group" aria-label="Guess grid">
      {rows.map((tiles, rowIndex) => (
        <Row
          key={rowIndex}
          tiles={tiles}
          reveal={revealingRow === rowIndex}
          shake={shakeRow === rowIndex}
        />
      ))}
    </div>
  )
}
