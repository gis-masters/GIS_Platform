import { reaction } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { SnapEvent } from 'ol/events/SnapEvent';
import { Snap } from 'ol/interaction';

import { mapSnapStore } from '../../../stores/MapSnap.store';
import { communicationService } from '../../communication.service';
import { mapDrawService } from '../draw/map-draw.service';
import { mapService } from '../map.service';

class MapSnapService {
  private static _instance: MapSnapService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private currentSnap: Snap | undefined;
  private latestSnapEvent: SnapEvent | undefined;

  constructor() {
    this.currentSnap = undefined;

    reaction(
      () => mapSnapStore.pixelTolerance,
      pixelTolerance => {
        this.createNewSnap(pixelTolerance);
      }
    );
  }

  activate() {
    this.createNewSnap(mapSnapStore.pixelTolerance);
  }

  deactivate() {
    if (this.currentSnap) {
      this.currentSnap.setActive(false);
      mapService.map.removeInteraction(this.currentSnap);
      mapService.map.un('dblclick', this.handleDblClick);
      mapService.updateCursor('default');

      this.currentSnap.un('snap', this.handleSnap);
      this.currentSnap = undefined;
    }
  }

  private createNewSnap(pixelTolerance: number) {
    this.deactivate();

    this.currentSnap = new Snap({
      source: mapDrawService.getDrawSource(),
      pixelTolerance: pixelTolerance
    });
    this.currentSnap.on('snap', this.handleSnap);

    mapService.map.addInteraction(this.currentSnap);
    mapService.map.on('dblclick', this.handleDblClick);
    this.currentSnap.on('snap', function () {
      mapService.updateCursor('pointer');
    });
  }

  @boundMethod
  private handleDblClick() {
    if (this.latestSnapEvent !== null) {
      communicationService.snapDblClick.emit(this.latestSnapEvent);
    }
  }

  @boundMethod
  private handleSnap(event: SnapEvent) {
    this.latestSnapEvent = event;
  }
}

export const mapSnapService = MapSnapService.instance;
