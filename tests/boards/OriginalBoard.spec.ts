import {expect} from 'chai';
import {TharsisBoard} from '../../src/boards/TharsisBoard';
import {Random} from '../../src/Random';
import {SpaceType} from '../../src/SpaceType';

describe('OriginalBoard', function() {
  it('has error with input while calling getAdjacentSpaces', function() {
    const board = TharsisBoard.newInstance(false, new Random(0), false);
    expect(function() {
      board.getAdjacentSpaces({
        x: 0,
        y: 0,
        bonus: [],
        id: 'foobar',
        spaceType: SpaceType.LAND,
      });
    }).to.throw('Unexpected space ID foobar');
  });
});
