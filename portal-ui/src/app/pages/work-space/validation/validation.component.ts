import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {LayersService} from "../../../services/geoserver/layers.service";
import {NameHrefProjection} from "../../../services/geoserver/projections";

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
              private authService: AuthService,
              private layersService: LayersService) {
    // this.authService.validateAuth();
  }

  ngOnInit() {
    this.layersService.getAll()
        .subscribe((layers: NameHrefProjection[]) => {
          // this.layers = layers;

          this.logger.info('layersService.getAll: ', this.layers);
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
