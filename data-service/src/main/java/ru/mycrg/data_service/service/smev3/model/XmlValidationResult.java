package ru.mycrg.data_service.service.smev3.model;

public class XmlValidationResult {

    private final String failMessage;
    private final Integer numberLine;
    private final String xmlBase64;

    public XmlValidationResult(String failMessage,
                               Integer numberLine,
                               String xmlBase64) {
        this.failMessage = failMessage;
        this.numberLine = numberLine;
        this.xmlBase64 = xmlBase64;
    }

    public String getFailMessage() {
        return failMessage;
    }

    public Integer getNumberLine() {
        return numberLine;
    }

    public String getXmlBase64() {
        return xmlBase64;
    }
}
