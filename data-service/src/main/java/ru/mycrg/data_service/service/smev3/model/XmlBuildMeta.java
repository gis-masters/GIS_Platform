package ru.mycrg.data_service.service.smev3.model;

import ru.mycrg.data_service.entity.IRecord;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Мета информация по запросу
 */
public class XmlBuildMeta {
    private UUID clientId;
    private Object xmlObject;
    private String xmlRequest;
    private Map<RecordData, Map<String, Object>> sourceRecords;
    private List<SmevAttachment> attachments;

    public XmlBuildMeta(
            UUID clientId,
            Object xmlObject,
            String xmlRequest,
            Map<RecordData, IRecord> sourceRecords,
            Map<String, SmevAttachment> attachmentsMap
    ) {
        this.clientId = clientId;
        this.xmlObject = xmlObject;
        this.xmlRequest = xmlRequest;
        if (sourceRecords != null) {
            this.sourceRecords = sourceRecords.entrySet()
                    .stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().getContent()));
        }
        if (attachmentsMap != null) {
            this.attachments = new ArrayList<>(attachmentsMap.values());
        }
    }

    public UUID getClientId() {
        return clientId;
    }

    public Object getXmlObject() {
        return xmlObject;
    }

    public String getXmlRequest() {
        return xmlRequest;
    }

    public Map<RecordData, Map<String, Object>> getSourceRecords() {
        return sourceRecords;
    }

    public List<SmevAttachment> getAttachments() {
        return attachments;
    }
}
