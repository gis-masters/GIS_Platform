import {Component, Input, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Violations} from "../test-github/test-github.component";

@Component({
  selector: 'crg-violation-item-view',
  templateUrl: './violation-item-view.component.html',
  styleUrls: ['./violation-item-view.component.css']
})
export class ViolationItemViewComponent implements OnInit {

  @Input() data: string;

  parsedData: Violations;

  constructor(private logger: NGXLogger) { }

  ngOnInit() {
    this.logger.info(' +++ ', this.data);
    if (this.data) {
      this.logger.info('-');
    }

    this.parsedData = JSON.parse(this.data);

  }

}
