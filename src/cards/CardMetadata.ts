import {CardRenderer} from '../cards/render/CardRenderer';
import {ICardRenderDescription} from './render/ICardRenderDescription';

export interface CardMetadata {
  description?: string | ICardRenderDescription;
  renderData?: CardRenderer;
}
