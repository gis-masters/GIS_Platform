package ru.mycrg.gis.service.fgistp.rules;

import ru.mycrg.common.EntityType;

public interface IFgistpRuleHolder {

    FgistpRules getRules();

    EntityType getRuleByClassName(String name);

    boolean isXsdRulesEmpty();

    boolean isCacheEmpty();

}
