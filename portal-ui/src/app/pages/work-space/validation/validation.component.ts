import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {filter, flatMap, map, tap} from 'rxjs/operators';
import {MatSnackBar} from "@angular/material";
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ValidationRequest, ValidationService} from '../../../services/validation.service';
import {NameHrefProjection} from '../../../services/geoserver/projections';
import {DatastoreService} from '../../../services/geoserver/datastore.service';
import {Layer, LayersService} from "../../../services/geoserver/layers.service";
import {GeoUtil} from "../../../services/util/GeoUtil";

@Component({
  selector: 'crg-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  layers: NameHrefProjection[];

  step = 0;

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private datastoreService: DatastoreService,
              private validationService: ValidationService,
              private authService: AuthService,
              private layersService: LayersService) {
    this.authService.validateAuth();
  }

  ngOnInit() {
    this.layersService
        .getAll()
        .subscribe((layers: NameHrefProjection[]) => this.layers = layers);
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

  validButton(index: number) {
    let projection = this.layers[index];
    this.layersService.getLayer(projection)
      .pipe(
        filter((layer: Layer) => !!layer),
        flatMap((layer: Layer) => this.datastoreService.getByLayerResource(layer)),
        map((data: any) => GeoUtil.getDbInfo(data.dataStore.connectionParameters, projection.name)),
        flatMap((requestInfo: ValidationRequest) => this.validationService.validateLayer(requestInfo)),
      )
      .subscribe((data: any) => {
        this.logger.info(' *********** ', data);
      });
  }
}
