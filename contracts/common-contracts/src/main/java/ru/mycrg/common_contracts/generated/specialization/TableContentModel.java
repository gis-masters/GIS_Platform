package ru.mycrg.common_contracts.generated.specialization;

import java.util.*;

public class TableContentModel {

    private String datasetIdentifier;
    private String tableIdentifier;
    private List<String> content = new ArrayList<>();
    private Map<String, String> variables = new HashMap<>();

    public TableContentModel() {
        // Required
    }

    public TableContentModel(String datasetIdentifier,
                             String tableIdentifier,
                             List<String> content,
                             Map<String, String> variables) {
        this.datasetIdentifier = datasetIdentifier;
        this.tableIdentifier = tableIdentifier;
        this.content = content;
        this.variables = variables;
    }

    public String getDatasetIdentifier() {
        return datasetIdentifier;
    }

    public void setDatasetIdentifier(String datasetIdentifier) {
        this.datasetIdentifier = datasetIdentifier;
    }

    public String getTableIdentifier() {
        return tableIdentifier;
    }

    public void setTableIdentifier(String tableIdentifier) {
        this.tableIdentifier = tableIdentifier;
    }

    public List<String> getContent() {
        return content;
    }

    public void setContent(List<String> content) {
        this.content = content;
    }

    public Map<String, String> getVariables() {
        return variables;
    }

    public void setVariables(Map<String, String> variables) {
        this.variables = variables;
    }

    @Override
    public String toString() {
        return "{" +
                "\"datasetIdentifier\":" + (datasetIdentifier == null ? "null" : "\"" + datasetIdentifier + "\"") + ", " +
                "\"tableIdentifier\":" + (tableIdentifier == null ? "null" : "\"" + tableIdentifier + "\"") + ", " +
                "\"content\":" + (content == null ? "null" : content) + ", " +
                "\"variables\":" + (variables == null ? "null" : "\"" + variables + "\"") +
                "}";
    }
}
