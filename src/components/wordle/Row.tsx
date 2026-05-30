import { TILE_FLIP_STAGGER_MS } from "#/game/timing";
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
					key={index}
					letter={tile.letter}
					state={tile.state}
					animate={reveal}
					delayMs={index * TILE_FLIP_STAGGER_MS}
				/>
			))}
		</div>
	);
}
