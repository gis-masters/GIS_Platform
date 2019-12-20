package ru.mycrg.geoserver_client.services.rule;

public enum ServiceKeys {

    COMMON("*.*"),
    WMS_RULE_KEY("wms.*"),
    WFS_RULE_KEY("wfs.*");

    private String ruleKey;

    ServiceKeys(String ruleKey) {
        this.ruleKey = ruleKey;
    }

    public String getRuleKey() {
        return ruleKey;
    }

    public void setRuleKey(String ruleKey) {
        this.ruleKey = ruleKey;
    }
}
