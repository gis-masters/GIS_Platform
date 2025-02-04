package ru.mycrg.data_service.service.smev3.model;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.data_service.service.smev3.Mnemonic;

import java.util.UUID;

/**
 * Мета информация по запросу
 */
public class SmevRequestMeta {

    private final Mnemonic mnemonic;
    private final UUID clientId;
    private final UUID referenceClientId;
    private final String requestXmlString;
    private final JsonNode requestJson;
    private final JsonNode sources;
    private final JsonNode attachments;

    public SmevRequestMeta(Mnemonic mnemonic,
                           UUID clientId,
                           UUID referenceClientId,
                           String requestXmlString,
                           JsonNode requestJson,
                           JsonNode sources,
                           JsonNode attachments) {
        this.mnemonic = mnemonic;
        this.clientId = clientId;
        this.referenceClientId = referenceClientId;
        this.requestXmlString = requestXmlString;
        this.requestJson = requestJson;
        this.sources = sources;
        this.attachments = attachments;
    }

    public Mnemonic getMnemonic() {
        return mnemonic;
    }

    public UUID getClientId() {
        return clientId;
    }

    public UUID getReferenceClientId() {
        return referenceClientId;
    }

    public String getRequestXmlString() {
        return requestXmlString;
    }

    public JsonNode getRequestJson() {
        return requestJson;
    }

    public JsonNode getSources() {
        return sources;
    }

    public JsonNode getAttachments() {
        return attachments;
    }
}
