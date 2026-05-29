import type { TileData } from "#/game/types";
import { Tile } from "./Tile";

type RowProps = {
	tiles: TileData[];
	shake?: boolean;
	reveal?: boolean;
};

export function Row({ tiles, shake, reveal }: RowProps) {
	return (
		<div className={`row${shake ? " row-shake" : ""}`}>
			{tiles.map((tile, index) => (
				<Tile
					key={`${index}-${tile.letter}-${tile.state}`}
					letter={tile.letter}
					state={tile.state}
					animate={reveal && tile.state !== "empty" && tile.state !== "tbd"}
					delayMs={index * 400}
				/>
			))}
		</div>
	);
}
