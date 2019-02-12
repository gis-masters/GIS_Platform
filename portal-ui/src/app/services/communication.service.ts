import {EventEmitter, Injectable, Output} from '@angular/core';
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  @Output() layerObjectsWindow = new EventEmitter<boolean>();
  @Output() gotoObject = new EventEmitter<string>();

  constructor(private logger: NGXLogger) {

  }

  public openLayerObjectsWindow() {
    this.layerObjectsWindow.emit(true);
  }

  public layerObjectsWindowListener() {
    return this.layerObjectsWindow;
  }

  public gotoObjectListener() {
    return this.gotoObject;
  }
}
