package ru.mycrg.data_service_contract.dto;

public class TypeUrlData extends TypeDocumentData {

    private String url;
    private String text;

    public TypeUrlData() {
        // Required
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
