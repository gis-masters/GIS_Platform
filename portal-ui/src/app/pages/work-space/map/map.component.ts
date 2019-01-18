import {NGXLogger} from 'ngx-logger';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services/auth.service';
import {environment} from '../../../../environments/environment';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NameHrefProjection} from '../../../services/geoserver/projections';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {GeoLayer, LayersService} from '../../../services/geoserver/layers.service';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  layerNames = [];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private router: Router,
              private layersService: LayersService,
              private logger: NGXLogger,
              private openLayers: OpenLayersService,
              private authService: AuthService) {
    this.authService.validateAuth();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.openLayers.createMap();

    this.layersService.getAll()
      .pipe(filter(value => value && !!value['layers']))
      .subscribe((geoLayer: GeoLayer) => {
        this.logger.info('layersService.getAll: ', geoLayer.layers);

        this.layerNames = geoLayer.layers.layer
          .map((item: NameHrefProjection) => item.name)
            // Не показываем слои из 'scratch workspace'
          .filter(layerName => !layerName.includes(environment.scratchWorkspaceName));

        this.layerNames.forEach((layerName, index) => {
          this.openLayers
              .addLayer(layerName)
              .setZIndex(geoLayer.layers.layer.length - index);
        });
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layerNames, event.previousIndex, event.currentIndex);

    this.layerNames.forEach((layerName, index) => {
      this.openLayers.set_ZIndex(layerName, this.layerNames.length - index);
    });
  }

  handleSelection(selectionList: MatSelectionList) {
    // Только выбранные галочкой элементы
    const selectedLayers = selectionList.selectedOptions.selected.map((selectedOption: MatListOption) => selectedOption.getLabel());
    this.openLayers.changeLayersVisibility(selectedLayers);
  }

  updateMapSize() {
    setTimeout(() => {
      this.openLayers.getMap().updateSize();
    }, 300);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
