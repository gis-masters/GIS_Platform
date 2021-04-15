import { reaction, IReactionDisposer } from 'mobx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { Coordinate } from 'ol/coordinate';
import '!style-loader!css-loader!sass-loader!ol/ol.css';

import { cn } from '../../services/util/cn';
import { CrgLayerType } from '../../services/crg/projects.models';
import { mapService } from '../../services/map/map.service';
import { getFeaturesByXmlFilter } from '../../services/geoserver/wfs.service';
import { makeXmlPolygonIntersect } from '../../services/util/wfs.util';
import { EditFeatureMode } from '../edit-feature/edit-feature.component';
import { fetchBasemaps } from '../../services/crg/basemaps.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { fromMobx } from '../../services/util/fromMobx';
import { Emitter } from '../../services/util/Emitter';
import { sidebars } from '../../stores/Sidebars.store';

type NamesChunks = { [srsName: string]: string[] };

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  isAttrSidebarActive = false;
  isBugReportSidebarActive = false;
  isFeaturesSidebarActive = false;
  isEditSidebarActive = false;

  cn = cn('map');

  private reactionDisposer: IReactionDisposer;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger) {}

  async ngOnInit() {
    await fetchBasemaps();

    await mapService.createMap();

    // Позиционируемся по BBOX проекта
    if (currentProject.bbox) {
      mapService.fitToBbox(JSON.parse(currentProject.bbox), [0, 0, 0, 0]);
    }

    this.reactionDisposer = reaction(
      () => currentProject.visibleLayersBatched,
      visibleBatches => {
        mapService.hideUserLayers();

        visibleBatches.forEach((batch, i) => {
          const { actualTransparency } = batch[0];

          const layers = batch.map(item => item.payload).reverse();

          mapService.addLayers(
            layers.filter(l => l.type !== CrgLayerType.EXTERNAL),
            visibleBatches.length - i,
            actualTransparency / 100
          );

          mapService.addExternalLayers(
            layers.filter(l => l.type === CrgLayerType.EXTERNAL),
            visibleBatches.length - i
          );
        });
      },
      { fireImmediately: true }
    );

    fromMobx(() => sidebars.leftOpen)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.attributesOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(attributesOpen => {
        this.isAttrSidebarActive = attributesOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.featuresOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(featuresOpen => {
        this.isFeaturesSidebarActive = featuresOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.editOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(editOpen => {
        this.isEditSidebarActive = editOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.bugReportOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(bugReportOpen => {
        this.isBugReportSidebarActive = bugReportOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    mapService.mapClick.on(coordinate => this.showFeaturesInfo(coordinate), this);
    mapService.zoomChanged.on(value => currentProject.changeZoom(value), this);
  }

  ngOnDestroy(): void {
    mapService.destroyMap();
    this.reactionDisposer();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    Emitter.scopeOff(this);
  }

  /**
   * Отобразить информацию об объектах, которые пересекают заданные координаты.
   */
  private async showFeaturesInfo(coordinate: Coordinate) {
    const visibleLayers = currentProject.visibleLayersWithoutRasters.map(({ payload }) => payload);

    if (!visibleLayers.length) {
      this.logger.debug('No visible layers');
      return;
    }

    const visibleLayersComplexNames: NamesChunks = visibleLayers.reduce((acc: NamesChunks, layer) => {
      const { nativeCRS, complexName } = layer;

      if (!acc[nativeCRS]) {
        acc[nativeCRS] = [];
      }

      acc[nativeCRS].push(complexName);

      return acc;
    }, {});

    const buffer = mapService.getBufferByCoordinates(coordinate);

    mapService.showSelectionMarker(buffer.getCoordinates());

    const collections = await Promise.all(
      Object.entries(visibleLayersComplexNames).map(([srsName, complexNames]) => {
        const xml = makeXmlPolygonIntersect(complexNames, buffer, srsName);

        return getFeaturesByXmlFilter(xml);
      })
    );

    const features = collections.map(({ features }) => features || []).flat();

    if (features.length) {
      if (features.length > 1) {
        sidebars.openFeatures(features);
      } else {
        sidebars.openEdit({
          features,
          mode: EditFeatureMode.single
        });
      }
    }
  }
}
