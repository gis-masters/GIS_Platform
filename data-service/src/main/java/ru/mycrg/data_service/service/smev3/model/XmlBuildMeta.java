package ru.mycrg.data_service.service.smev3.model;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.data_service.service.smev3.MnemonicEnum;

import java.util.UUID;

/**
 * Мета информация по запросу
 */
public class XmlBuildMeta {
    private MnemonicEnum mnemonic;
    private UUID clientId;
    private UUID referenceClientId;
    private String requestXmlString;
    private JsonNode requestJson;
    private JsonNode sources;
    private JsonNode attachments;

    public XmlBuildMeta(MnemonicEnum mnemonic,
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

    public MnemonicEnum getMnemonic() {
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
