import {CardRequirements} from '../../src/cards/CardRequirements';
import {Tag} from '../../src/cards/Tag';
import {expect} from 'chai';

describe('CardRequirement', function() {
  it('ocean: success', function() {
    expect(CardRequirements.builder((b) => b.water(1)).getRequirementsText()).to.equal(
      'Ocean',
    );
  });
  it('oceans: success', function() {
    expect(CardRequirements.builder((b) => b.water(3)).getRequirementsText()).to.equal(
      '3 Oceans',
    );
  });
  it('oceans: success - max', function() {
    expect(CardRequirements.builder((b) => b.water(3).max()).getRequirementsText()).to.equal(
      'max 3 Oceans',
    );
  });
  it('ocean: success - max', function() {
    expect(CardRequirements.builder((b) => b.water(1).max()).getRequirementsText()).to.equal(
      'max 1 Ocean',
    );
  });
  it('ocean: success - max', function() {
    expect(CardRequirements.builder((b) => b.oxygen(3)).getRequirementsText()).to.equal(
      '3% O2',
    );
  });
  it('temperature (+): success', function() {
    expect(CardRequirements.builder((b) => b.heat(2)).getRequirementsText()).to.equal(
      '2° C',
    );
  });
  it('temperature (0): success', function() {
    expect(CardRequirements.builder((b) => b.heat(0)).getRequirementsText()).to.equal(
      '0° C',
    );
  });
  it('temperature (-): success', function() {
    expect(CardRequirements.builder((b) => b.heat(-10)).getRequirementsText()).to.equal(
      '-10° C',
    );
  });
  it('temperature (-): success', function() {
    expect(
      CardRequirements.builder((b) => b.heat(4).max()).getRequirementsText(),
    ).to.equal('max 4° C');
  });
  it('Cities-singular: success', function() {
    expect(CardRequirements.builder((b) => b.cities()).getRequirementsText()).to.equal('City');
  });
  it('Cities-plural: success', function() {
    expect(CardRequirements.builder((b) => b.cities(2)).getRequirementsText()).to.equal(
      '2 Cities',
    );
  });
  it('Any Cities-plural: success', function() {
    expect(CardRequirements.builder((b) => b.cities(2).any()).getRequirementsText()).to.equal(
      'Any 2 Cities',
    );
  });
  it('Cities-max: success', function() {
    expect(CardRequirements.builder((b) => b.cities(4).max()).getRequirementsText()).to.equal(
      'max 4 Cities',
    );
  });
  it('Greenery: success', function() {
    expect(CardRequirements.builder((b) => b.greeneries()).getRequirementsText()).to.equal(
      'Greenery',
    );
  });
  it('Greenerys-max: success', function() {
    expect(CardRequirements.builder((b) => b.greeneries(2).max()).getRequirementsText()).to.equal(
      'max 2 Greeneries',
    );
  });
  it('Tag-science(2): success', function() {
    expect(
      CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 2)).getRequirementsText(),
    ).to.equal('2 Science');
  });
  it('Tag-science: success', function() {
    expect(
      CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 1)).getRequirementsText(),
    ).to.equal('Science');
  });
  it('Tag-science: default - success', function() {
    expect(CardRequirements.builder((b) => b.tag(Tag.SCIENCE)).getRequirementsText()).to.equal(
      'Science',
    );
  });
  it('Throws error on max w/o requirement', function() {
    expect(() => {
      CardRequirements.builder((b) => b.max());
    }).to.throw();
  });
});
