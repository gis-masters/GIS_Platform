import { Root } from 'react-dom/client';
import { Feature, Overlay } from 'ol';

export interface MeasureItem {
  id: symbol;
  feature: Feature;
  tooltipRoot: Root;
  tooltipNode: HTMLElement;
  tooltipOverlay: Overlay;
}
