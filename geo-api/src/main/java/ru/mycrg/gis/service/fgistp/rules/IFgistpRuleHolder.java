package ru.mycrg.gis.service.fgistp.rules;

import ru.mycrg.gis.service.fgistp.FeatureDescription;

import java.util.List;

public interface IFgistpRuleHolder {

    FgistpRules getAllRules();

    List<FeatureDescription> getFewRules(List<String> featureNames);

    FeatureDescription getRuleByName(String name);

    boolean isXsdRulesEmpty();

    boolean isCacheEmpty();

}
