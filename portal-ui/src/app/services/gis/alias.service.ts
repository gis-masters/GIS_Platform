import {NGXLogger} from "ngx-logger";
import {Injectable} from '@angular/core';
import {FeatureXsdDefinition, FgistpRulesService, XsdFeature} from "./fgistp-rules.service";

/**
 * Сей промежуточный сервис предоставляет методы для поиска алиасов.
 */
@Injectable({
  providedIn: 'root'
})
export class AliasService {

  private xsdFeatures: XsdFeature[] = [];

  constructor(private logger: NGXLogger,
              private ruleService: FgistpRulesService) {
    this.ruleService
        .getRules()
        .subscribe((xsdDefinition: FeatureXsdDefinition) => {
          this.xsdFeatures = xsdDefinition.xsdFeatures;
        });
  }

}
