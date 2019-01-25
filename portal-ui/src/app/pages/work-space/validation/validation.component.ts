import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {AuthService} from "../../../services/auth.service";
import {GeoLayer, LayersService} from "../../../services/geoserver/layers.service";
import {filter} from "rxjs/operators";
import {NameHrefProjection} from "../../../services/geoserver/projections";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'crg-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  private layerNames: string[];

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private layersService: LayersService) {
    this.authService.validateAuth();
  }

  ngOnInit() {
    this.layersService.getAll()
      .pipe(filter(value => value && !!value['layers']))
      .subscribe((geoLayer: GeoLayer) => {

        //TODO: move this filter to service
        this.layerNames = geoLayer.layers.layer
          .map((item: NameHrefProjection) => item.name)
          .filter(layerName => !layerName.includes(environment.scratchWorkspaceName));

        this.logger.info('layersService.getAll: ', this.layerNames);
      });

  }

}
