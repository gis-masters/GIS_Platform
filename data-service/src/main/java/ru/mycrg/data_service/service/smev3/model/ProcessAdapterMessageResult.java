package ru.mycrg.data_service.service.smev3.model;

public class ProcessAdapterMessageResult {

    private XmlBuildMeta xmlBuildMeta;
    private String status;
    private String message;

    public XmlBuildMeta getXmlBuildMeta() {
        return xmlBuildMeta;
    }

    public ProcessAdapterMessageResult setXmlBuildMeta(XmlBuildMeta xmlBuildMeta) {
        this.xmlBuildMeta = xmlBuildMeta;
        return this;
    }

    public String getStatus() {
        return status;
    }

    public ProcessAdapterMessageResult setStatus(String status) {
        this.status = status;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public ProcessAdapterMessageResult setMessage(String message) {
        this.message = message;
        return this;
    }
}
