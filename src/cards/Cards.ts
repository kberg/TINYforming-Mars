import {CabinInTheWoods} from '../awards/CabinInTheWoods';
import {CapitalCity} from '../awards/CapitalCity';
import {DryHeat} from '../awards/DryHeat';
import {IAward} from '../awards/IAward';
import {SouthernCharm} from '../awards/SouthernCharm';
import {WaterfrontProperty} from '../awards/WaterfrontProperty';
import {YankeeDoodle} from '../awards/YankeeDoodle';
import {CardName} from '../CardName';
import {Charger} from '../milestones/Charger';
import {Collector} from '../milestones/Collector';
import {Discounter} from '../milestones/Discounter';
import {Explorer} from '../milestones/Explorer';
import {IMilestone} from '../milestones/IMilestone';
import {JackOfAllTrades} from '../milestones/JackOfAllTrades';
import {Multitasker} from '../milestones/Multitasker';
import {Algae} from './base/Algae';
import {AquiferPumping} from './base/AquiferPumping';
import {ArtificialLake} from './base/ArtificialLake';
import {Asteroid} from './base/Asteroid';
import {AsteroidMining} from './base/AsteroidMining';
import {Bushes} from './base/Bushes';
import {Comet} from './base/Comet';
import {FusionPower} from './base/FusionPower';
import {GeothermalPower} from './base/GeothermalPower';
import {GHGFactories} from './base/GHGFactories';
import {Grass} from './base/Grass';
import {GreatDam} from './base/GreatDam';
import {IceAsteroid} from './base/IceAsteroid';
import {IceCapMelting} from './base/IceCapMelting';
import {Insects} from './base/Insects';
import {LavaFlows} from './base/LavaFlows';
import {Lichen} from './base/Lichen';
import {MethaneFromTitan} from './base/MethaneFromTitan';
import {Moss} from './base/Moss';
import {NuclearPower} from './base/NuclearPower';
import {PowerGrid} from './base/PowerGrid';
import {ProtectedValley} from './base/ProtectedValley';
import {ResearchOutpost} from './base/ResearchOutpost';
import {SolarPower} from './base/SolarPower';
import {SubterraneanReservoir} from './base/SubterraneanReservoir';
import {Trees} from './base/Trees';
import {WaterFromEuropa} from './base/WaterFromEuropa';
import {Windmills} from './base/Windmills';
import {CorporationCard} from './corporation/CorporationCard';
import {CrusoeEnterprise} from './corporation/CrusoeEnterprise';
import {GreenMars} from './corporation/GreenMars';
import {InnovativeSolutions} from './corporation/InnovativeSolutions';
import {MarsBank} from './corporation/MarsBank';
import {MinersUnion} from './corporation/MinersUnion';
import {PhobosFirst} from './corporation/PhobosFirst';
import {SolInvictus} from './corporation/SolInvictus';
import {UNTerraformingProgramme} from './corporation/UNTerraformingProgramme';
import {VeridianIntergalactic} from './corporation/VeridianIntergalactic';
import {ZeusPower} from './corporation/ZeusPower';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';
import {StandardProjectCard} from './StandardProjectCard';

export interface Manifest {
  projectCards: Array<ICardFactory<IProjectCard>>,
  corporationCards: Array<ICardFactory<CorporationCard>>,
  standardProjects: Array<ICardFactory<StandardProjectCard>>,
  awards: Array<ICardFactory<IAward>>,
  milestones: Array<ICardFactory<IMilestone>>,
};

export const MANIFEST: Manifest = {
  projectCards: [
    {cardName: CardName.ICE_CAP_MELTING, Factory: IceCapMelting},
    {cardName: CardName.POWER_GRID, Factory: PowerGrid},
    {cardName: CardName.RESEARCH_OUTPOST, Factory: ResearchOutpost},
    {cardName: CardName.WINDMILLS, Factory: Windmills},
    {cardName: CardName.SUBTERRANEAN_RESERVOIR, Factory: SubterraneanReservoir},
    {cardName: CardName.INSECTS, Factory: Insects},
    {cardName: CardName.LICHEN, Factory: Lichen},
    {cardName: CardName.GREAT_DAM, Factory: GreatDam},
    {cardName: CardName.ICE_ASTEROID, Factory: IceAsteroid},
    {cardName: CardName.FUSION_POWER, Factory: FusionPower},
    {cardName: CardName.BUSHES, Factory: Bushes},
    {cardName: CardName.METHANE_FROM_TITAN, Factory: MethaneFromTitan},
    {cardName: CardName.ALGAE, Factory: Algae},
    {cardName: CardName.COMET, Factory: Comet},
    {cardName: CardName.TREES, Factory: Trees},
    {cardName: CardName.NUCLEAR_POWER, Factory: NuclearPower},
    {cardName: CardName.GHG_FACTORIES, Factory: GHGFactories},
    {cardName: CardName.ASTEROID_MINING, Factory: AsteroidMining},
    {cardName: CardName.WATER_FROM_EUROPA, Factory: WaterFromEuropa},
    {cardName: CardName.LAVA_FLOWS, Factory: LavaFlows},
    {cardName: CardName.ASTEROID, Factory: Asteroid},
    {cardName: CardName.PROTECTED_VALLEY, Factory: ProtectedValley},
    {cardName: CardName.MOSS, Factory: Moss},
    {cardName: CardName.AQUIFER_PUMPING, Factory: AquiferPumping},
    {cardName: CardName.SOLAR_POWER, Factory: SolarPower},
    {cardName: CardName.ARTIFICIAL_LAKE, Factory: ArtificialLake},
    {cardName: CardName.GRASS, Factory: Grass},
    {cardName: CardName.GEOTHERMAL_POWER, Factory: GeothermalPower},
  ],
  corporationCards: [
    {cardName: CardName.GREEN_MARS, Factory: GreenMars},
    {cardName: CardName.MARS_BANK, Factory: MarsBank},
    {cardName: CardName.PHOBOS_FIRST, Factory: PhobosFirst},
    {cardName: CardName.ZEUS_POWER, Factory: ZeusPower},
    {cardName: CardName.MINERS_UNION, Factory: MinersUnion},
    {cardName: CardName.INNOVATIVE_SOLUTIONS, Factory: InnovativeSolutions},
    {cardName: CardName.CRUSOE_ENTERPRISE, Factory: CrusoeEnterprise},
    {cardName: CardName.VERIDIAN_INTERGALACTIC, Factory: VeridianIntergalactic},
    {cardName: CardName.SOL_INVICTUS, Factory: SolInvictus},
    {cardName: CardName.UN_TERRAFORMING_PROGRAMME, Factory: UNTerraformingProgramme},
  ],
  standardProjects: [
    // {cardName: CardName.AQUIFER_STANDARD_PROJECT, Factory: AquiferStandardProject},
    // {cardName: CardName.CITY_STANDARD_PROJECT, Factory: CityStandardProject},
    // {cardName: CardName.POWER_PLANT_STANDARD_PROJECT, Factory: PowerPlantStandardProject},
    // {cardName: CardName.GREENERY_STANDARD_PROJECT, Factory: GreeneryStandardProject},
    // {cardName: CardName.ASTEROID_STANDARD_PROJECT, Factory: AsteroidStandardProject},
    // {cardName: CardName.SELL_PATENTS_STANDARD_PROJECT, Factory: SellPatentsStandardProject},
    // {cardName: CardName.BUFFER_GAS_STANDARD_PROJECT, Factory: BufferGasStandardProject},
  ],
  awards: [
    {cardName: CardName.DRY_HEAT, Factory: DryHeat},
    {cardName: CardName.CAPITAL_CITY, Factory: CapitalCity},
    {cardName: CardName.SOUTHERN_CHARM, Factory: SouthernCharm},
    {cardName: CardName.YANKEE_DOODLE, Factory: YankeeDoodle},
    {cardName: CardName.WATERFRONT_PROPERTY, Factory: WaterfrontProperty},
    {cardName: CardName.CABIN_IN_THE_WOODS, Factory: CabinInTheWoods},
  ],
  milestones: [
    {cardName: CardName.DISCOUNTER, Factory: Discounter},
    {cardName: CardName.JACK_OF_ALL_TRADES, Factory: JackOfAllTrades},
    {cardName: CardName.MUILTITASKER, Factory: Multitasker},
    {cardName: CardName.EXPLORER, Factory: Explorer},
    {cardName: CardName.CHARGER, Factory: Charger},
    {cardName: CardName.COLLECTOR, Factory: Collector},
  ],
};

export const ALL_PROJECT_CARD_NAMES = MANIFEST.projectCards.map((e: {cardName: CardName}) => e.cardName);
export const ALL_CORPORATION_CARD_NAMES = MANIFEST.corporationCards.map((e: {cardName: CardName}) => e.cardName);
export const ALL_STANDARD_PROJECT_CARD_NAMES = MANIFEST.standardProjects.map((e: {cardName: CardName}) => e.cardName);
