package ru.mycrg.data_service_contract.dto.gpkg;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

public class SvgIcon implements Serializable {

    @NotEmpty
    private String name;

    @NotEmpty
    private String body;

    public SvgIcon() {
        //req
    }

    public SvgIcon(String name, String body) {
        this.name = name;
        this.body = body;
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
}
