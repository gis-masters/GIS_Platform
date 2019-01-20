package ru.mycrg.gis.service.fgistp;

public interface IFgistpRuleHolder {

    FgistpRules getRules();

    EntityType getRuleByClassName(String name);

    boolean isXsdRulesEmpty();

}
