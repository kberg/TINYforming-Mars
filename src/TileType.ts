export enum TileType {
    GREENERY = 'greenery',
    WATER = 'water',
    CITY = 'city',
    HEAT = 'heat',
}

const TO_STRING_MAP: Map<TileType, string> = new Map([
  [TileType.GREENERY, 'greenery'],
  [TileType.WATER, 'water'],
  [TileType.CITY, 'city'],
]);

export namespace TileType {
  export function toString(tileType: TileType): string {
    return TO_STRING_MAP.get(tileType) || `(unnamed tile, id ${tileType})`;
  }
}
