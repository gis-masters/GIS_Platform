package ru.mycrg.gis.service.fgistp;

import ru.mycrg.gis.dto.fgistp.EntityType;
import ru.mycrg.gis.dto.fgistp.FgistpRules;

public interface IFgistpRuleHolder {

    FgistpRules getRules();

    EntityType getRuleByClassName(String name);

    boolean isXsdRulesEmpty();

}
