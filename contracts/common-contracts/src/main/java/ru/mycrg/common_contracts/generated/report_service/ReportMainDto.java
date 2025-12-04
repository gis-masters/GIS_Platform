package ru.mycrg.common_contracts.generated.report_service;

import java.util.Map;

public class ReportMainDto {

    ReportOutputFormat outputFormat;

    Map<String, String> media;

    Object data;

    public ReportMainDto() {
        //Req
    }

    public ReportMainDto(ReportOutputFormat outputFormat, Map<String, String> media, Object data) {
        this.outputFormat = outputFormat;
        this.media = media;
        this.data = data;
    }

    public ReportOutputFormat getOutputFormat() {
        return outputFormat;
    }

    public void setOutputFormat(ReportOutputFormat outputFormat) {
        this.outputFormat = outputFormat;
    }

    public Map<String, String> getMedia() {
        return media;
    }

    public void setMedia(Map<String, String> media) {
        this.media = media;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
