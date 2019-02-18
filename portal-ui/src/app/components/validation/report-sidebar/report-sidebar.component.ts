import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {filter, flatMap, map} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from "@angular/material";
import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ValidationRequest, ValidationService} from '../../../services/gis/validation.service';
import {NameHrefProjection} from '../../../services/geoserver/projections';
import {DatastoreService} from '../../../services/geoserver/datastore.service';
import {CrgLayer, Layer, LayersService} from "../../../services/geoserver/layers.service";
import {GeoUtil} from "../../../services/util/GeoUtil";
import {CommunicationService} from "../../../services/communication.service";
import {FgistpRulesService} from "../../../services/gis/fgistp-rules.service";
import {OpenLayersService} from "../../../services/open-layer/open-layers.service";

@Component({
  selector: 'report-sidebar',
  templateUrl: './report-sidebar.component.html',
  styleUrls: ['./report-sidebar.component.css']
})
export class ReportSidebarComponent implements OnInit {

  @Input() isActive: boolean;

  connectionInfo: Map<string, ValidationRequest> = new Map<string, ValidationRequest>();

  layers: CrgLayer[] = [];

  step = 0;
  isValidationInited = false;

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private datastoreService: DatastoreService,
              private validationService: ValidationService,
              private communicationService: CommunicationService,
              private authService: AuthService,
              private dialog: MatDialog,
              private openLayersService: OpenLayersService,
              private ruleService: FgistpRulesService,
              private layersService: LayersService) {
    this.authService.validateAuth();

    this.communicationService
        .selectedForValidationLayers$()
        .subscribe((data: CrgLayer[]) => this.initValidation(data));
  }

  ngOnInit() {
    this.layersService.layers$
        .pipe(filter(value => !!value && !!value.length))
        .subscribe((layers: CrgLayer[]) => {
          this.layers = layers;
          // this.validationService.validationDataHolder.addLayers(layers);
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

  initValidation(layerNames: CrgLayer[]) {
    this.logger.info('66666666666666', layerNames);

    this.isValidationInited = true;
    setTimeout(() => {
      this.isValidationInited = false;
    }, 3000);

    // if (this.connectionInfo.get(layerNames[0].name)) {
    //   this.validationService
    //       .validateLayer(this.connectionInfo.get(layerNames[0].name))
    //       .subscribe((data: any) => this.handleValidationResponse(data));
    // } else {
    //   let projection = this.layers.find(value => value.name === layerNames[0].name);
    //   this.layersService.getLayer(projection)
    //       .pipe(
    //         filter((layer: Layer) => !!layer),
    //         flatMap((layer: Layer) => this.datastoreService.getByLayerResource(layer)),
    //         map((data: any) => GeoUtil.getDbInfo(data.dataStore.connectionParameters, layerNames[0].name)),
    //         flatMap((connectionInfo: ValidationRequest) => {
    //           this.connectionInfo.set(connectionInfo.tableName, connectionInfo);
    //           return this.validationService.validateLayer(connectionInfo);
    //         }),
    //       )
    //       .subscribe((data: any) => this.handleValidationResponse(data));
    // }
  }

  private handleValidationResponse(data: any) {
    this.isValidationInited = false;

    this.logger.info(' * * * * * *', data);
  }

  handleChildEvent(layerIndex: number) {
    if (layerIndex != undefined && this.layers[layerIndex]) {
      this.layersService
          .fetchLayerConnectionInfo(this.layers[layerIndex])
          .subscribe((connectionInfo: ValidationRequest) => {
            this.connectionInfo.set(this.layers[layerIndex].name, connectionInfo);
          })
    } else {
      this.logger.info('Not fetch layer connections');
    }
  }

  closeSidebar() {
    this.openLayersService.removeBugObjectsLayer();
    this.communicationService.bugReportSidebar.emit(false);
  }

  reValidate() {
    let copy = Object.assign([], this.layers);
    this.communicationService.validationDialog.emit({layers: copy});
  }

  isLayerCommonInfoExist(name: string, param: string) {
    let infoByLayerName = this.validationService.validationDataHolder.getInfoByLayerName(name);
    return infoByLayerName ? !!infoByLayerName[param] : undefined;
  }

  getInfo(name: string, param: string) {
    let infoByLayerName = this.validationService.validationDataHolder.getInfoByLayerName(name);

    return infoByLayerName ? infoByLayerName[param] : undefined;
  }

  isValidatedAndSuccess(name: string) {
    let infoByLayerName = this.validationService.validationDataHolder.getInfoByLayerName(name);

    if (!infoByLayerName) {
      return false;
    }

    return infoByLayerName.isValidated && infoByLayerName.totalViolations < 1;
  }
}
