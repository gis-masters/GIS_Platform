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
    private JsonNode xmlObject;
    private String xmlString;
    private JsonNode sources;
    private JsonNode attachments;

    public XmlBuildMeta(
            MnemonicEnum mnemonic,
            UUID clientId,
            UUID referenceClientId,
            JsonNode xmlObject,
            String xmlString,
            JsonNode sources,
            JsonNode attachments) {
        this.mnemonic = mnemonic;
        this.clientId = clientId;
        this.referenceClientId = referenceClientId;
        this.xmlObject = xmlObject;
        this.xmlString = xmlString;
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

    public JsonNode getXmlObject() {
        return xmlObject;
    }

    public String getXmlString() {
        return xmlString;
    }

    public JsonNode getSources() {
        return sources;
    }

    public JsonNode getAttachments() {
        return attachments;
    }
}
