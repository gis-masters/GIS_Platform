package ru.mycrg.data_service_contract.dto.smev3;

import java.util.UUID;

public class RequestDto {
    private UUID clientId;
    private String xmlRequest;

    public RequestDto(UUID clientId, String xmlRequest) {
        this.clientId = clientId;
        this.xmlRequest = xmlRequest;
    }

    public UUID getClientId() {
        return clientId;
    }

    public RequestDto setClientId(UUID clientId) {
        this.clientId = clientId;
        return this;
    }

    public String getXmlRequest() {
        return xmlRequest;
    }

    public RequestDto setXmlRequest(String xmlRequest) {
        this.xmlRequest = xmlRequest;
        return this;
    }
}
