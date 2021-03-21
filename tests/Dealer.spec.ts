import {expect} from 'chai';
import {Dealer} from '../src/Dealer';

describe('Dealer', function() {
  it('deserializes from serialized', function() {
    const dealer = Dealer.newInstance();
    expect(dealer).to.deep.eq(Dealer.deserialize(dealer.serialize()));
  });
});

