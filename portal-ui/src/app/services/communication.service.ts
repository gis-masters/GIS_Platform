import {EventEmitter, Injectable, Output} from '@angular/core';
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  @Output() layerObjectsSidebar = new EventEmitter<boolean>();
  @Output() bugReportSidebar = new EventEmitter<boolean>();

  @Output() gotoObject = new EventEmitter<ObjectDto>();

  constructor(private logger: NGXLogger) {

  }

  public layerObjectsSidebarListener() {
    return this.layerObjectsSidebar;
  }

  public bugReportSidebarListener() {
    return this.bugReportSidebar;
  }

  public gotoObjectListener() {
    return this.gotoObject;
  }
}

export interface ObjectDto {
  id: string;
  layerName: string;
}
