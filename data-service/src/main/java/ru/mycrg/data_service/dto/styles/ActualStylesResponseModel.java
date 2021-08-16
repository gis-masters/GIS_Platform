package ru.mycrg.data_service.dto.styles;

import java.util.ArrayList;
import java.util.List;

public class ActualStylesResponseModel extends ActualStylesModel {

    public List<String> rules = new ArrayList<>();

    public ActualStylesResponseModel() {
        // Required
    }

    public ActualStylesResponseModel(ActualStylesRequestModel requestModel) {
        this.dataset = requestModel.getDataset();
        this.identifier = requestModel.getIdentifier();
    }

    public void addRule(String rule) {
        this.rules.add(rule);
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
