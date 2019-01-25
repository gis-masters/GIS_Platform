import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {AuthService} from "../../../services/auth.service";
import {LayersService} from "../../../services/geoserver/layers.service";
import {NameHrefProjection} from "../../../services/geoserver/projections";

@Component({
  selector: 'crg-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  private layers: NameHrefProjection[];

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private layersService: LayersService) {
    this.authService.validateAuth();
  }

  ngOnInit() {
    this.layersService.getAll()
        .subscribe((layers: NameHrefProjection[]) => {
          this.layers = layers;

          this.logger.info('layersService.getAll: ', this.layers);
        });
  }

}
