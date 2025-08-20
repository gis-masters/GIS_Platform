package ru.mycrg.data_service.dto.styles;

import java.util.ArrayList;
import java.util.List;

public class ActualStylesRequestModel extends ActualStylesModel {

    private SpatialRuleFilter filter;
    private String ecqlFilter;
    private List<StyleRule> rules = new ArrayList<>();

    public ActualStylesRequestModel() {
        // Required
    }

    public List<StyleRule> getRules() {
        return rules;
    }

    public void setRules(List<StyleRule> rules) {
        this.rules = rules;
    }

    public SpatialRuleFilter getFilter() {
        return filter;
    }

    public void setFilter(SpatialRuleFilter filter) {
        this.filter = filter;
    }

    public String getEcqlFilter() {
        return ecqlFilter;
    }

    public void setEcqlFilter(String ecqlFilter) {
        this.ecqlFilter = ecqlFilter;
    }

    @Override
    public String toString() {
        return "{" +
                "\"dataset\": \"" + dataset + "\"," +
                "\"identifier\": \"" + identifier + "\"," +
                "\"ecqlFilter\":" + (ecqlFilter == null ? "null" : "\"" + ecqlFilter + "\"") + ", " +
                "\"rules\": " + rules + "\"," +
                "\"filter\": " + filter +
                '}';
    }
}
