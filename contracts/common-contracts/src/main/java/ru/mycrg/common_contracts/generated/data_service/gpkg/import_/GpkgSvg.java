package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import java.io.Serializable;

public class GpkgSvg extends GpkgReportBaseDto implements Serializable {

    private String body;

    public GpkgSvg() {
    }

    public GpkgSvg(String title, GpkgProcessStatus status, String body) {
        super(title, status);
        this.body = body;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
