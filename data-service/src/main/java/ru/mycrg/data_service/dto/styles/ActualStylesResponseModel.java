package ru.mycrg.data_service.dto.styles;

import java.util.HashSet;
import java.util.Set;

public class ActualStylesResponseModel extends ActualStylesModel {

    private final Set<String> rules = new HashSet<>();

    public ActualStylesResponseModel(ActualStylesRequestModel requestModel) {
        this.dataset = requestModel.getDataset();
        this.identifier = requestModel.getIdentifier();
    }

    public void addRule(String rule) {
        this.rules.add(rule);
    }

    public Set<String> getRules() {
        return rules;
    }

    @Override
    public String toString() {
        return "{" +
                "\"dataset\": \"" + dataset + "\"," +
                "\"identifier\": \"" + identifier + "\"," +
                "\"rules\": " + rules +
                '}';
    }
}
