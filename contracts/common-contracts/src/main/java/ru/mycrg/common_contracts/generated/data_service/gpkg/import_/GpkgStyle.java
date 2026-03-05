package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GpkgStyle extends GpkgReportBaseDto implements Serializable {

    private Long createdTableId;
    private String name;
    private String body;
    private List<GpkgSvg> svgs = new ArrayList<>();

    public GpkgStyle() {
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

    public List<GpkgSvg> getSvgs() {
        return svgs != null ? svgs : new ArrayList<>();
    }

    public void setSvgs(List<GpkgSvg> svgs) {
        this.svgs = svgs;
    }

    @Override
    public String toString() {
        return "{" +
                "\"title\":" + (getTitle() == null ? "null" : "\"" + getTitle() + "\"") + ", " +
                "\"status\":" + (getStatus() == null ? "null" : getStatus()) + ", " +
                "\"messages\":" + (getMessages() == null ? "null" : Arrays.toString(getMessages().toArray())) + ", " +
                "\"createdTableId\":" + (createdTableId == null ? "null" : "\"" + createdTableId + "\"") + ", " +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"body\":" + (body == null ? "null" : "\"" + body + "\"") + ", " +
                "\"svgs\":" + (svgs == null ? "null" : Arrays.toString(svgs.toArray())) +
                "}";
    }
}
