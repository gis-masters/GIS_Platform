import { type Root } from 'react-dom/client';
import { type Feature, type Overlay } from 'ol';

export interface MeasureItem {
  id: symbol;
  feature: Feature;
  tooltipRoot: Root;
  tooltipNode: HTMLElement;
  tooltipOverlay: Overlay;
}
