package ru.mycrg.data_service_contract.dto.gpkg;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

public class StyleWithIcons implements Serializable {

    private String name;
    private String body;

    private List<SvgIcon> svg = new LinkedList<>();

    public StyleWithIcons() {
        //req
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public List<SvgIcon> getSvg() {
        return svg;
    }

    public void setSvg(List<SvgIcon> svg) {
        this.svg = svg != null ? svg : new LinkedList<>();
    }
}
