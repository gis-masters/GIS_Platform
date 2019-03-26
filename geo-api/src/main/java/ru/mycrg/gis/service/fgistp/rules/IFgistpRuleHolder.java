package ru.mycrg.gis.service.fgistp.rules;

import ru.mycrg.gis.service.fgistp.EntityType;

public interface IFgistpRuleHolder {

    FgistpRules getRules();

    EntityType getRuleByName(String name);

    boolean isXsdRulesEmpty();

    boolean isCacheEmpty();

}
