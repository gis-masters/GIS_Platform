import {Component, Input, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Violations} from "../bugs-table/bugs-table.component";

@Component({
  selector: 'crg-violations-view',
  templateUrl: './violations-view.component.html',
  styleUrls: ['./violations-view.component.css']
})
export class ViolationsViewComponent implements OnInit {

  @Input() data: string;

  parsedData: Violations;

  constructor(private logger: NGXLogger) { }

  ngOnInit() {
  }

}
