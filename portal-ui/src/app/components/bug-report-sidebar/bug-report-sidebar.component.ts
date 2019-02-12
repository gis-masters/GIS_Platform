import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {TreeNode} from "primeng/api";
import {CommunicationService} from "../../services/communication.service";
import {LayersService} from "../../services/geoserver/layers.service";
import {NameHrefProjection} from "../../services/geoserver/projections";

@Component({
  selector: 'crg-bug-report-sidebar',
  templateUrl: './bug-report-sidebar.component.html',
  styleUrls: ['./bug-report-sidebar.component.css']
})
export class BugReportSidebarComponent implements OnInit {

  layers: TreeNode[];
  selectedItem: TreeNode[];

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService,
              private layerService: LayersService) {
  }

  ngOnInit() {
    this.layerService
        .getAll()
        .subscribe((layers: NameHrefProjection[]) => {
          layers.forEach((layer: NameHrefProjection) => {
            this.layers.push({
              label: layer.name.split(':')[1],
              expandedIcon: "fa fa-folder-open",
              collapsedIcon: "fa fa-folder",
              "children": []
            });
          });
        });

    this.layers = [
      {
        label: "Backup loooooooooooooong name",
        data: "Backup Folder",
        expandedIcon: "fa fa-folder-open",
        collapsedIcon: "fa fa-folder",
        "children": [
          {"label": "Al Pacino"},
          {"label": "Robert De Niro"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
          {"label": "first"},
        ]
      }
    ];
  }

  nodeSelect(event: any) {
    this.logger.info('nodeSelect', event)
  }

  nodeUnselect(event: any) {
    this.logger.info('nodeUnselect', event)
  }

  closeFiz() {
    this.communicationService.bugReportSidebar.emit(false);
  }
}
