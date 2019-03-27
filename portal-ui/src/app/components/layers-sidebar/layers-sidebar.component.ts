import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {filter, takeUntil} from 'rxjs/operators';
import {EventService} from '../../services/event.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FgistpRulesService} from '../../services/gis/fgistp-rules.service';
import {CrgLayer, LayersService} from '../../services/geoserver/layers.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {ActionType, CommunicationService, SidebarType} from '../../services/communication.service';

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.css']
})
export class LayersSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive;

  layers: CrgLayer[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private eventService: EventService,
              private layersService: LayersService,
              private openLayers: OpenLayersService,
              private ruleService: FgistpRulesService,
              private communicationService: CommunicationService) {

  }

  ngOnInit() {
    this.layersService.layers$
        .pipe(
          filter(value => !!value && !!value.length),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((layers: CrgLayer[]) => {
          this.layers = layers;
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);

    this.layers.forEach((layer, index) => {
      this.openLayers.set_ZIndex(layer.name, this.layers.length - index);
    });
  }

  handleSelection(selectionList: MatSelectionList) {
    let nameOfSelectedLayers: string[];
    nameOfSelectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => selectedOption.value)
      .map((layer: CrgLayer) => layer.name);

    this.logger.info('------------------', nameOfSelectedLayers);

    this.openLayers.changeLayersVisibility(nameOfSelectedLayers);
  }

  closeMe() {
    this.communicationService.sidebarManager.emit({action: ActionType.CLOSE, target: SidebarType.LAYERS});
  }
}
