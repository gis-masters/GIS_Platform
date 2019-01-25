import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {filter, flatMap, map, tap} from "rxjs/operators";
import {MatSnackBar} from "@angular/material";
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ValidationService} from "../../../services/validation.service";
import {NameHrefProjection} from "../../../services/geoserver/projections";
import {DatastoreService} from "../../../services/geoserver/datastore.service";
import {Layer, LayersService} from "../../../services/geoserver/layers.service";
import {from, of} from "rxjs";

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

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private datastoreService: DatastoreService,
              private validationService: ValidationService,
              private authService: AuthService,
              private layersService: LayersService) {
    // this.authService.validateAuth();
  }

  ngOnInit() {
    this.layersService.getAll()
        .pipe(
          flatMap((layers: NameHrefProjection[]) => this.layersService.getLayers(layers)),
          tap(console.log),
          filter((layers: Layer[]) => !!layers),
          tap(console.log),
          flatMap((layers: Layer[]) => {
            if (layers && layers[0].resource) {
              return this.datastoreService.getByLayersResource(layers);
            } else {
              this.logger.info('=');
            }
          }),
        )
        .subscribe((layers: any) => {
          this.logger.info(' ++++ ', layers);
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
}
