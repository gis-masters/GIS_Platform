import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnInit} from '@angular/core';
import {ViolationItem} from '../../../services/gis/validation.service';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';

@Component({
  selector: 'crg-violations-view',
  templateUrl: './violations-view.component.html',
  styleUrls: ['./violations-view.component.css']
})
export class ViolationsViewComponent implements OnInit {

  @Input() data: ViolationItem[];
  @Input() layerName: string;

  violationItems: ViolationViewItem[] = [];

  constructor(private logger: NGXLogger,
              private ruleService: FgistpRulesService) {}

  ngOnInit() {
    this.data.forEach((value: ViolationItem) => {
      this.violationItems.push({
        errors: this.ruleService.getErrorsDescription(value.errorTypes),
        propertyName: this.ruleService.getPropertyAlias(this.layerName, value.name)
      });
    });
  }
}

interface ViolationViewItem {
  propertyName: string;
  errors: string[];
}
