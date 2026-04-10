package ru.mycrg.common_contracts.generated.report_service;

public class TemplateShortInfo implements TemplateShortProjection{

    private String name;
    private String title;

    public TemplateShortInfo() {
        //req
    }

    public TemplateShortInfo(String name, String title) {
        this.name = name;
        this.title = title;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
