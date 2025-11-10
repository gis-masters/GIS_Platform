package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class GpkgImportedStyles extends GpkgImportBaseDto implements Serializable {

    private Long createdTableId;
    private String name;
    private String body;
    private List<GpkgImportedSvg> svgs = new ArrayList<>();

    public GpkgImportedStyles() {
    }

    public Long getCreatedTableId() {
        return createdTableId;
    }

    public void setCreatedTableId(Long createdTableId) {
        this.createdTableId = createdTableId;
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

    public List<GpkgImportedSvg> getSvgs() {
        return svgs != null ? svgs : new ArrayList<>();
    }

    public void setSvgs(List<GpkgImportedSvg> svgs) {
        this.svgs = svgs;
    }

    @Override
    public String toString() {
        return "{" +
                "\"createdTableId\":" + (createdTableId == null ? "null" : "\"" + createdTableId + "\"") + ", " +
                "\"styleName\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"styleBody\":" + (body == null ? "null" : "\"" + body + "\"") + ", " +
                "\"svgs\":" + (svgs == null ? "null" : "\"" + svgs + "\"") + ", " +
                "\"name\":" + (getTitle() == null ? "null" : "\"" + getTitle() + "\"") + ", " +
                "\"status\":" + (getStatus() == null ? "null" : "\"" + getStatus() + "\"") + ", " +
                "\"messages\":" + (getMessages() == null ? "null" : "\"" + getMessages() + "\"") + ", " +
                "}";
    }
}
