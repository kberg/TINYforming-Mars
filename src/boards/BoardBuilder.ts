import {ISpace, SpaceId} from './ISpace';
import {SpaceName} from '../SpaceName';
import {SpaceType} from '../SpaceType';
import {Random} from '../Random';
import {Tag} from '../cards/Tag';

export class BoardBuilder {
  // This builder assumes the map has nine rows, of tile counts [5,6,7,8,9,8,7,6,5].
  //
  // "Son I am able, " she said "though you scare me."
  // "Watch, " said I
  // "Beloved, " I said "watch me scare you though." said she,
  // "Able am I, Son."

    private waterSpace: Array<boolean> = [];
    private tags: Array<Tag | undefined> = [];
    private spaces: Array<ISpace> = [];
    private unshufflableSpaces: Array<number> = [];

    constructor() {
    }

    water(tag?: Tag | undefined) {
      this.waterSpace.push(true);
      this.tags.push(tag);
      return this;
    }

    land(tag?: Tag | undefined) {
      this.waterSpace.push(false);
      this.tags.push(tag);
      return this;
    }

    doNotShuffleLastSpace() {
      this.unshufflableSpaces.push(this.waterSpace.length - 1);
      return this;
    }


    build(): Array<ISpace> {
      const tilesPerRow = [5, 6, 7, 8, 9, 8, 7, 6, 5];
      const idOffset = this.spaces.length + 1;
      let idx = 0;

      for (let row = 0; row < 9; row++) {
        const tilesInThisRow = tilesPerRow[row];
        const xOffset = 9 - tilesInThisRow;
        for (let i = 0; i < tilesInThisRow; i++) {
          const space = this.newTile(idx + idOffset, xOffset + i, row, this.waterSpace[idx], this.tags[idx]);
          this.spaces.push(space);
          idx++;
        }
      }

      return this.spaces;
    }

    public shuffleArray(rng: Random, array: Array<any>): void {
      this.unshufflableSpaces.sort((a, b) => a < b ? a : b);
      // Reverseing the indexes so the elements are pulled from the right.
      // Revering the result so elements are listed left to right.
      const spliced = this.unshufflableSpaces.reverse().map((idx) => array.splice(idx, 1)[0]).reverse();
      for (let i = array.length - 1; i > 0; i--) {
        const j = rng.nextInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
      }
      for (let idx = 0; idx < this.unshufflableSpaces.length; idx++) {
        array.splice(this.unshufflableSpaces[idx], 0, spliced[idx]);
      }
    }

    // Shuffle the water spaces and bonus spaces. But protect the land spaces supplied by
    // |lands| so that those IDs most definitely have land spaces.
    public shuffle(rng: Random, ...lands: Array<SpaceName>) {
      this.shuffleArray(rng, this.waterSpace);
      this.shuffleArray(rng, this.tags);
      let safety = 0;
      while (safety < 1000) {
        let satisfy = true;
        for (const land of lands) {
          // Why -3?
          const land_id = Number(land) - 3;
          while (this.waterSpace[land_id]) {
            satisfy = false;
            const idx = rng.nextInt(this.waterSpace.length + 1);
            [this.waterSpace[land_id], this.waterSpace[idx]] = [this.waterSpace[idx], this.waterSpace[land_id]];
          }
        }
        if (satisfy) return;
        safety++;
      }
      throw new Error('infinite loop detected');
    }

    private newTile(idx: number, x: number, y: number, isWaterSpace: boolean, tag: Tag | undefined) {
      const id = idx.toString().padStart(2, '0');
      if (isWaterSpace) {
        return Space.water(id, x, y, tag);
      } else {
        return Space.land(id, x, y, tag);
      }
    }
}

class Space implements ISpace {
  private constructor(public id: SpaceId, public spaceType: SpaceType, public tag: Tag | undefined, public x: number, public y: number ) {
  }

  static land(id: string, x: number, y: number, tag: Tag | undefined) {
    return new Space(id, SpaceType.LAND, tag, x, y);
  }

  static water(id: string, x: number, y: number, tag: Tag | undefined) {
    return new Space(id, SpaceType.WATER, tag, x, y);
  }
}
