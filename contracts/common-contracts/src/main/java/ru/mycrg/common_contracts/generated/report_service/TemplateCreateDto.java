package ru.mycrg.common_contracts.generated.report_service;

import com.fasterxml.jackson.databind.JsonNode;

public class TemplateCreateDto extends TemplateShortInfo {

    private JsonNode printFormSchemaOverrides;

    public TemplateCreateDto() {
    }

    public TemplateCreateDto(String name, String title, JsonNode printFormSchemaOverrides) {
        super(name, title);
        this.printFormSchemaOverrides = printFormSchemaOverrides;
    }

    public JsonNode getPrintFormSchemaOverrides() {
        return printFormSchemaOverrides;
    }

    public void setPrintFormSchemaOverrides(JsonNode printFormSchemaOverrides) {
        this.printFormSchemaOverrides = printFormSchemaOverrides;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":\"" + (getName() == null ? "null" : getName()) + "\"," +
                "\"title\":\"" + (getTitle() == null ? "null" : getTitle()) + "\"," +
                "\"printFormSchemaOverrides\":" + (printFormSchemaOverrides == null ? "null" : printFormSchemaOverrides) +
                "}";
    }
}
