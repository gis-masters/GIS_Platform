import {Observable, Subject, throwError} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {catchError} from 'rxjs/operators';
import {EventService} from '../../services/event.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FgistpRulesService} from '../../services/gis/fgistp-rules.service';
import {CrgLayer, LayersService} from '../../services/geoserver/layers.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {ActionType, CommunicationService, SidebarType} from '../../services/communication.service';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'crg-layers-sidebar',
  templateUrl: './layers-sidebar.component.html',
  styleUrls: ['./layers-sidebar.component.css']
})
export class LayersSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive;

  layers$: Observable<CrgLayer[]>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private eventService: EventService,
              private layersService: LayersService,
              private openLayers: OpenLayersService,
              private ruleService: FgistpRulesService,
              private storageService: LocalStorageService,
              private communicationService: CommunicationService) {

  }

  ngOnInit() {
    const projectModel = this.storageService.getProject();
    this.layers$ = this.layersService.fizFetchingLayers(projectModel.crgProject)
        .pipe(
          catchError(err => {
            this.logger.error('layers-sidebar layers error', err);
            return throwError(err);
          })
        );
  }

  ngOnDestroy(): void {
    this.logger.info('+++ sidebar');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  drop(event: CdkDragDrop<string[]>) {
    // moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
    //
    // this.layers$.forEach((layer, index) => {
    //   this.openLayers.set_ZIndex(layer.name, this.layers.length - index);
    // });
  }

  handleSelection(selectionList: MatSelectionList) {
    let nameOfSelectedLayers: string[];
    nameOfSelectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => selectedOption.value)
      .map((layer: CrgLayer) => layer.name);

    this.openLayers.changeLayersVisibility(nameOfSelectedLayers);
  }

  closeMe() {
    this.communicationService.sidebarManager.emit({action: ActionType.CLOSE, target: SidebarType.LAYERS});
  }
}
