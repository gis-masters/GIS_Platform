package ru.mycrg.gis.service.fgistp;

import ru.mycrg.common.EntityType;

public interface IFgistpRuleHolder {

    FgistpRules getRules();

    EntityType getRuleByClassName(String name);

    boolean isXsdRulesEmpty();

}
