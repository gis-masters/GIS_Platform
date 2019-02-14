import {NGXLogger} from "ngx-logger";
import {Component, Input, OnInit} from '@angular/core';
import {WmsService} from '../../services/geoserver/wms.service';
import {FgistpRulesService} from "../../services/gis/fgistp-rules.service";

@Component({
  selector: 'crg-layer-list-item',
  templateUrl: './layer-list-item.component.html',
  styleUrls: ['./layer-list-item.component.css']
})
export class LayerListItemComponent implements OnInit {

  @Input() complexLayerName: string;

  private layerTitle: string;
  imageToShow: any;
  isImageLoaded = false;

  constructor(private wmsService: WmsService,
              private ruleService: FgistpRulesService,
              private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.wmsService
        .getLegend(this.complexLayerName)
        .subscribe(data => {
          this.createImageFromBlob(data);
        });

    this.layerTitle = this.ruleService.getLayerTitle(this.complexLayerName.split(':')[1]);
  }

  private createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageToShow = reader.result;
      this.isImageLoaded = true;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
