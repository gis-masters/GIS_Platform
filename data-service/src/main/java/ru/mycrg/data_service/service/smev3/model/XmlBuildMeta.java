package ru.mycrg.data_service.service.smev3.model;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.UUID;

/**
 * Мета информация по запросу
 */
public class XmlBuildMeta {
    private String mnemonic;
    private String mnemonicVersion;
    private UUID clientId;
    private JsonNode xmlObject;
    private String xmlString;
    private JsonNode sources;
    private JsonNode attachments;

    public XmlBuildMeta(
            String mnemonic,
            String mnemonicVersion,
            UUID clientId,
            JsonNode xmlObject,
            String xmlString,
            JsonNode sources,
            JsonNode attachments
    ) {
        this.mnemonic = mnemonic;
        this.mnemonicVersion = mnemonicVersion;
        this.clientId = clientId;
        this.xmlObject = xmlObject;
        this.xmlString = xmlString;
        this.sources = sources;
        this.attachments = attachments;

    }

    public String getMnemonic() {
        return mnemonic;
    }

    public XmlBuildMeta setMnemonic(String mnemonic) {
        this.mnemonic = mnemonic;
        return this;
    }

    public String getMnemonicVersion() {
        return mnemonicVersion;
    }

    public XmlBuildMeta setMnemonicVersion(String mnemonicVersion) {
        this.mnemonicVersion = mnemonicVersion;
        return this;
    }

    public UUID getClientId() {
        return clientId;
    }

    public XmlBuildMeta setClientId(UUID clientId) {
        this.clientId = clientId;
        return this;
    }

    public JsonNode getXmlObject() {
        return xmlObject;
    }

    public XmlBuildMeta setXmlObject(JsonNode xmlObject) {
        this.xmlObject = xmlObject;
        return this;
    }

    public String getXmlString() {
        return xmlString;
    }

    public XmlBuildMeta setXmlString(String xmlString) {
        this.xmlString = xmlString;
        return this;
    }

    public JsonNode getSources() {
        return sources;
    }

    public XmlBuildMeta setSources(JsonNode sources) {
        this.sources = sources;
        return this;
    }

    public JsonNode getAttachments() {
        return attachments;
    }

    public XmlBuildMeta setAttachments(JsonNode attachments) {
        this.attachments = attachments;
        return this;
    }
}
