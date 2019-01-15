import {Component, Input, OnInit} from '@angular/core';
import {WmsService} from '../../services/geoserver/wms.service';

@Component({
  selector: 'crg-layer-list-item',
  templateUrl: './layer-list-item.component.html',
  styleUrls: ['./layer-list-item.component.css']
})
export class LayerListItemComponent implements OnInit {

  @Input() layerName: string;

  imageToShow: any;
  isImageLoaded = false;

  constructor(private wmsService: WmsService) {
  }

  ngOnInit(): void {
    this.wmsService
        .getLegend(this.layerName)
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
