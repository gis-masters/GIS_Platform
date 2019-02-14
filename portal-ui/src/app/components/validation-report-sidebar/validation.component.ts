import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {filter, flatMap, map} from 'rxjs/operators';
import {MatSnackBar} from "@angular/material";
import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ValidationRequest, ValidationService} from '../../services/validation.service';
import {NameHrefProjection} from '../../services/geoserver/projections';
import {DatastoreService} from '../../services/geoserver/datastore.service';
import {Layer, LayersService} from "../../services/geoserver/layers.service";
import {GeoUtil} from "../../services/util/GeoUtil";
import {CommunicationService} from "../../services/communication.service";

@Component({
  selector: 'crg-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  @Input() isActive: boolean;

  connectionInfo: ValidationRequest[] = [];

  layers: NameHrefProjection[];

  step = 0;
  isValidationInited: boolean[] = [];

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private datastoreService: DatastoreService,
              private validationService: ValidationService,
              private communicationService: CommunicationService,
              private authService: AuthService,
              private layersService: LayersService) {
    this.authService.validateAuth();
  }

  ngOnInit() {
    this.layersService
        .getAll()
        .subscribe((layers: NameHrefProjection[]) => {
          this.layers = layers;

          this.validationService.validationDataHolder.addLayers(layers);
        });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  initValidation(event, index: number) {
    this.isValidationInited[index] = true;

    event.stopPropagation();

    let projection = this.layers[index];

    if (this.connectionInfo[index]) {
      this.validationService.validateLayer(this.connectionInfo[index])
          .subscribe((data: any) => this.handleValidationResponse(data, index));
    } else {
      this.layersService.getLayer(projection)
          .pipe(
            filter((layer: Layer) => !!layer),
            flatMap((layer: Layer) => this.datastoreService.getByLayerResource(layer)),
            map((data: any) => GeoUtil.getDbInfo(data.dataStore.connectionParameters, projection.name)),
            flatMap((connectionInfo: ValidationRequest) => {
              this.connectionInfo[index] = connectionInfo;
              return this.validationService.validateLayer(connectionInfo);
            }),
          )
          .subscribe((data: any) => this.handleValidationResponse(data, index));
    }
  }

  private handleValidationResponse(data: any, index) {
    this.isValidationInited[index] = false;

    this.logger.info(' * ', data);
  }

  handleChildEvent(layerIndex: number) {
    if (layerIndex != undefined && this.layers[layerIndex]) {
      this.layersService
          .fetchLayerConnectionInfo(this.layers[layerIndex])
          .subscribe((connectionInfo: ValidationRequest) => {
            this.connectionInfo[layerIndex] = connectionInfo;
          })
    } else {
      this.logger.info('Not fetch layer connections');
    }
  }

  prepareLayerName(name: string): string {
    return name.split(':')[1];
  }

  closeSidebar() {
    this.communicationService.bugReportSidebar.emit(false);
  }

  isLayerCommonInfoExist(name: string, param: string) {
    return !!this.validationService.validationDataHolder.getInfoByLayerName(name)[param];
  }

  getInfo(name: string, param: string) {
    return this.validationService.validationDataHolder.getInfoByLayerName(name)[param];
  }
}
