import {expect} from 'chai';
import {DrawCards} from '../../src/deferredActions/DrawCards';
import {TestPlayers} from '../TestPlayers';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {Asteroid} from '../../src/cards/base/Asteroid';
import {Tag} from '../../src/cards/Tag';
import {SelectCard} from '../../src/inputs/SelectCard';
import {Dealer} from '../../src/Dealer';

describe('DrawCards', function() {
  let player: Player; let dealer: Dealer;
  const cards = [new AICentral(), new Asteroid(), new CapitalAres()];

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    dealer = player.game.dealer;
  });


  it('keeps cards', function() {
    DrawCards.keep(player, [cards[0], cards[1]]);
    expect(player.cardsInHand).has.length(2);
    expect(dealer.discarded).has.length(0);
  });

  it('discards cards', function() {
    DrawCards.discard(player, [cards[1]], cards);
    expect(player.cardsInHand).has.length(0);
    expect(dealer.discarded).has.length(2);
  });

  it('draws 3', function() {
    DrawCards.keepAll(player, 3).execute();
    expect(player.cardsInHand).has.length(3);
    expect(dealer.discarded).has.length(0);
  });

  it('draws 3 special', function() {
    DrawCards.keepAll(player, 3, {cardType: 'project', tag: Tag.SPACE}).execute();
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tag.SPACE) && card.cardType === 'project'))
      .has.length(3);
  });

  it('draws 2 from 4', function() {
    const action = DrawCards.keepSome(player, 4, {keepMax: 2}).execute();
    expect(action instanceof SelectCard).is.true;
    expect(action!.minCardsToSelect).to.eq(2);
    expect(action!.maxCardsToSelect).to.eq(2);
    action!.cb([action!.cards[0], action!.cards[2]]);
    expect(player.cardsInHand).has.length(2);
    expect(dealer.discarded).has.length(2);
  });
});
