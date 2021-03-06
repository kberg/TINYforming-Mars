import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, setPlayerProductionForTest, TestPlayers} from '../../TestingUtils';
import {GeodesicTents} from '../../../src/cards/moon/GeodesicTents';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {PlaceMoonColonyTile} from '../../../src/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('GeodesicTents', () => {
  let player: Player;
  let card: GeodesicTents;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new GeodesicTents();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    setPlayerProductionForTest(player, {energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    setPlayerProductionForTest(player, {energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    setPlayerProductionForTest(player, {energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    setPlayerProductionForTest(player, {energy: 1});

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.PLANTS)).eq(1);

    expect(player.game.deferredActions.next()!).is.instanceOf(PlaceMoonColonyTile);
  });
});

