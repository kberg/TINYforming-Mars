import {ISpace, SpaceId} from './ISpace';
import {Player, PlayerId} from '../Player';
import {SpaceType} from '../SpaceType';
import {TileType} from '../TileType';
import {SerializedBoard, SerializedSpace} from './SerializedBoard';

/**
 * A representation of any hex board. This is normally Mars (Tharsis, Hellas, Elysium) but can also be The Moon.
 *
 * It also includes additional spaces, known as Colonies, that are not adjacent to other spaces.
 */
export abstract class Board {
  private maxX: number = 0;
  private maxY: number = 0;

  // stores adjacent spaces in clockwise order starting from the top left
  private readonly adjacentSpaces = new Map<SpaceId, Array<ISpace>>();

  protected constructor(public spaces: Array<ISpace>) {
    this.maxX = Math.max(...spaces.map((s) => s.x));
    this.maxY = Math.max(...spaces.map((s) => s.y));
    spaces.forEach((space) => {
      this.adjacentSpaces.set(space.id, this.computeAdjacentSpaces(space));
    });
  };

  /* Returns the space given a Space ID. */
  public getSpace(id: string): ISpace {
    const space = this.spaces.find((space) => space.id === id);
    if (space === undefined) {
      throw new Error(`Can't find space with id ${id}`);
    }
    return space;
  }

  protected computeAdjacentSpaces(space: ISpace): Array<ISpace> {
    // Expects an odd number of rows. If a funny shape appears, it can be addressed.
    const middleRow = this.maxY / 2;
    if (space.y < 0 || space.y > this.maxY) {
      throw new Error('Unexpected space y value: ' + space.y);
    }
    if (space.x < 0 || space.x > this.maxX) {
      throw new Error('Unexpected space x value: ' + space.x);
    }
    const leftSpace: Array<number> = [space.x - 1, space.y];
    const rightSpace: Array<number> = [space.x + 1, space.y];
    const topLeftSpace: Array<number> = [space.x, space.y - 1];
    const topRightSpace: Array<number> = [space.x, space.y - 1];
    const bottomLeftSpace: Array<number> = [space.x, space.y + 1];
    const bottomRightSpace: Array<number> = [space.x, space.y + 1];
    if (space.y < middleRow) {
      bottomLeftSpace[0]--;
      topRightSpace[0]++;
    } else if (space.y === middleRow) {
      bottomRightSpace[0]++;
      topRightSpace[0]++;
    } else {
      bottomRightSpace[0]++;
      topLeftSpace[0]--;
    }
    // Coordinates are in clockwise order. Order only ever matters during solo game set-up when
    // placing starting forests. Since that is the only case where ordering matters, it is
    // adopted here.
    const coords = [
      topLeftSpace,
      topRightSpace,
      rightSpace,
      bottomRightSpace,
      bottomLeftSpace,
      leftSpace,
    ];
    const spaces: Array<ISpace> = [];
    for (const [x, y] of coords) {
      const adj = this.spaces.find((adj) =>
        space !== adj && adj.x === x && adj.y === y,
      );
      if (adj !== undefined) {
        spaces.push(adj);
      }
    }
    return spaces;
  }

  // Returns adjacent spaces in clockwise order starting from the top left.
  public getAdjacentSpaces(space: ISpace): Array<ISpace> {
    const spaces = this.adjacentSpaces.get(space.id);
    if (spaces === undefined) {
      throw new Error(`Unexpected space ID ${space.id}`);
    }
    // Clone so that callers can't mutate our arrays
    return [...spaces];
  }

  public getWaterCubes(): Array<ISpace> {
    return this.spaces.filter((space) => space.tile?.tileType === TileType.WATER);
  }

  public getGreeneryCubes(): Array<ISpace> {
    return this.spaces.filter((space) => space.tile?.tileType === TileType.GREENERY);
  }

  public getSpaces(spaceType: SpaceType): Array<ISpace> {
    return this.spaces.filter((space) => space.spaceType === spaceType);
  }

  public getEmptySpaces(): Array<ISpace> {
    return this.spaces.filter((space) => space.tile === undefined);
  }

  public getAvailableSpacesForCity(): Array<ISpace> {
    // A city cannot be adjacent to another city
    return this.getAvailableSpacesOnLand().filter(
      (space) => this.getAdjacentSpaces(space).some((adjacentSpace) => Board.hasCity(adjacentSpace)) === false,
    );
  }

  public getAvailableSpacesForWaterCubes(): Array<ISpace> {
    return this.getSpaces(SpaceType.WATER).filter((space) => space.tile === undefined);
  }

  public getAvailableSpacesOnLand(): Array<ISpace> {
    return this.getSpaces(SpaceType.LAND).filter((space) => space.tile === undefined);
  }

  // |distance| represents the number of eligible spaces from the top left (or bottom right)
  // to count. So distance 0 means the first available space.
  // If |direction| is 1, count from the top left. If -1, count from the other end of the map.
  // |player| will be an additional space filter (which basically supports Land Claim)
  // |predicate| allows callers to provide additional filtering of eligible spaces.
  public getNthAvailableLandSpace(
    distance: number,
    direction: -1 | 1,
    player: Player | undefined = undefined,
    predicate: (value: ISpace) => boolean = (_x) => true) {
    const spaces = this.spaces.filter((space) => {
      return this.canPlaceTile(space) && (space.player === undefined || space.player === player);
    }).filter(predicate);
    let idx = (direction === 1) ? distance : (spaces.length - (distance + 1));
    if (spaces.length === 0) {
      throw new Error('no spaces available');
    }
    while (idx < 0) {
      idx += spaces.length;
    }
    while (idx >= spaces.length) {
      idx -= spaces.length;
    }
    return spaces[idx];
  }

  public getNonReservedLandSpaces(): Array<ISpace> {
    return this.spaces.filter((space) => {
      return space.spaceType === SpaceType.LAND &&
        space.tile === undefined &&
        space.player === undefined;
    });
  }

  public canPlaceTile(space: ISpace): boolean {
    return space.tile === undefined && space.spaceType === SpaceType.LAND;
  }

  public static hasCity(space: ISpace): boolean {
    return space.tile?.tileType === TileType.CITY;
  }

  public static hasWaterCube(space: ISpace): boolean {
    return space.tile?.tileType === TileType.WATER;
  }

  public serialize(): SerializedBoard {
    return {
      spaces: this.spaces.map((space) => {
        return {
          id: space.id,
          spaceType: space.spaceType,
          tile: space.tile,
          player: space.player?.id,
          tag: space.tag,
          x: space.x,
          y: space.y,
        };
      }),
    };
  }

  public static deserializeSpace(serialized: SerializedSpace, players: Array<Player>): ISpace {
    const playerId: PlayerId | undefined = serialized.player;
    const player = players.find((p) => p.id === playerId);
    const space: ISpace = {
      id: serialized.id,
      spaceType: serialized.spaceType,
      tag: serialized.tag,
      x: serialized.x,
      y: serialized.y,
    };

    if (serialized.tile !== undefined) {
      space.tile = serialized.tile;
    }
    if (player !== undefined) {
      space.player = player;
    }

    return space;
  }

  public static deserializeSpaces(spaces: Array<SerializedSpace>, players: Array<Player>): Array<ISpace> {
    return spaces.map((space) => Board.deserializeSpace(space, players));
  }
}
