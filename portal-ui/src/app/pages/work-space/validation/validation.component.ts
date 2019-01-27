import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {filter, flatMap, tap} from "rxjs/operators";
import {MatSnackBar} from "@angular/material";
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ValidationService} from "../../../services/validation.service";
import {NameHrefProjection} from "../../../services/geoserver/projections";
import {DatastoreService} from "../../../services/geoserver/datastore.service";
import {Layer, LayersService} from "../../../services/geoserver/layers.service";

@Component({
  selector: 'crg-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  private layers: NameHrefProjection[] = [
    {
      name: 'functionalZone',
      href: 'http://',
    },
    {
      name: 'Some other layer',
      href: 'http://',
    },
    {
      name: 'Some other layer 2',
      href: 'http://',
    },
    {
      name: 'Electrica',
      href: 'http://',
    }
  ];

  step = 0;
  endLayer = this.layers.length;
  layerName;

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
    // let data = [
    //   {
    //     dbName: 'gis',
    //     schemaName: 'fiz',
    //     tableName: 'electrictransformer'
    //   },
    //   {
    //     dbName: 'gis',
    //     schemaName: 'fiz',
    //     tableName: 'electricline'
    //   },
    // ];
    //
    // this.validationService
    //     .validateLayers(data)
    //     .subscribe(value => {
    //       this.logger.info('---', value);
    //     });

    this.layersService.getAll()
        .pipe(
          flatMap((layers: NameHrefProjection[]) => this.layersService.getLayers(layers)),
          filter((layers: Layer[]) => !!layers),
          flatMap((layers: Layer[]) => this.datastoreService.getByLayersResource(layers)),
        )
        .subscribe((data: any) => {
          this.logger.info(' -1- ', data);
          this.logger.info(' -1- ', data[0].dataStore);
          this.logger.info(' -1- ', data[0].dataStore.connectionParameters);
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

  validButton(index: number) {
    this.layerName = this.layers[index].name;
    console.log(this.layerName);
  }
}
