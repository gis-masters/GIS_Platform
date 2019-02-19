import {NGXLogger} from "ngx-logger";
import {Component, Input, OnInit} from '@angular/core';
import {WmsService} from '../../services/geoserver/wms.service';
import {CrgLayer} from "../../services/geoserver/layers.service";

@Component({
  selector: 'crg-layer-list-item',
  templateUrl: './layer-list-item.component.html',
  styleUrls: ['./layer-list-item.component.css']
})
export class LayerListItemComponent implements OnInit {

  @Input() layer: CrgLayer;

  imageToShow: any;
  isImageLoaded = false;

  constructor(private wmsService: WmsService,
              private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.wmsService
        .getLegend(this.layer.complexName)
        .subscribe(data => {
          this.createImageFromBlob(data);
        });
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
