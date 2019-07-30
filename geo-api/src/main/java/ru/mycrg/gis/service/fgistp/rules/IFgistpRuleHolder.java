package ru.mycrg.gis.service.fgistp.rules;

import ru.mycrg.gis.service.fgistp.FeatureDescription;

public interface IFgistpRuleHolder {

    FgistpRules getRules();

    FeatureDescription getRuleByName(String name);

    boolean isXsdRulesEmpty();

    boolean isCacheEmpty();

}
