package ru.mycrg.data_service.entity.smev;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.config.CrgCommonConfig;
import ru.mycrg.data_service.service.smev3.Mnemonic;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
@Entity
@Table(name = "smev_message_meta")
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
public class SmevMessageMetaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Enumerated(EnumType.STRING)
    @Column(name = "direction")
    private MessageDirection direction;
    @Column(name = "client_id")
    private UUID clientId;
    @Column(name = "reference_client_id")
    private UUID referenceClientId;
    @Column(name = "mnemonic")
    private String mnemonic;
    @Column(name = "mnemonic_version")
    private String mnemonicVersion;
    @Column(name = "reference_reestr_incoming")
    private UUID referenceReestrIncoming;
    @Column(name = "reference_reestr_outgoing")
    private UUID referenceReestrOutgoing;
    @Type(type = "jsonb-node")
    @Column(columnDefinition = "xml_object")
    private JsonNode xmlObject;
    @Column(columnDefinition = "xml_string")
    private String xmlString;
    @Type(type = "jsonb-node")
    @Column(columnDefinition = "records")
    private JsonNode records;
    @Type(type = "jsonb-node")
    @Column(columnDefinition = "attachments")
    private JsonNode attachments;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = CrgCommonConfig.SYSTEM_DATETIME_PATTERN)
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public UUID getId() {
        return id;
    }

    public SmevMessageMetaEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public MessageDirection getDirection() {
        return direction;
    }

    public SmevMessageMetaEntity setDirection(MessageDirection direction) {
        this.direction = direction;
        return this;
    }

    public UUID getClientId() {
        return clientId;
    }

    public SmevMessageMetaEntity setClientId(UUID clientId) {
        this.clientId = clientId;
        return this;
    }

    public UUID getReferenceClientId() {
        return referenceClientId;
    }

    public SmevMessageMetaEntity setReferenceClientId(UUID referenceClientId) {
        this.referenceClientId = referenceClientId;
        return this;
    }

    public String getMnemonic() {
        return mnemonic;
    }

    public SmevMessageMetaEntity setMnemonic(String mnemonic) {
        this.mnemonic = mnemonic;
        return this;
    }

    public String getMnemonicVersion() {
        return mnemonicVersion;
    }

    public SmevMessageMetaEntity setMnemonicVersion(String mnemonicVersion) {
        this.mnemonicVersion = mnemonicVersion;
        return this;
    }

    public UUID getReferenceReestrIncoming() {
        return referenceReestrIncoming;
    }

    public SmevMessageMetaEntity setReferenceReestrIncoming(UUID referenceReestrIncoming) {
        this.referenceReestrIncoming = referenceReestrIncoming;
        return this;
    }

    public UUID getReferenceReestrOutgoing() {
        return referenceReestrOutgoing;
    }

    public SmevMessageMetaEntity setReferenceReestrOutgoing(UUID referenceReestrOutgoing) {
        this.referenceReestrOutgoing = referenceReestrOutgoing;
        return this;
    }

    public JsonNode getXmlObject() {
        return xmlObject;
    }

    public SmevMessageMetaEntity setXmlObject(JsonNode xmlObject) {
        this.xmlObject = xmlObject;
        return this;
    }

    public String getXmlString() {
        return xmlString;
    }

    public SmevMessageMetaEntity setXmlString(String xmlString) {
        this.xmlString = xmlString;
        return this;
    }

    public JsonNode getRecords() {
        return records;
    }

    public SmevMessageMetaEntity setRecords(JsonNode records) {
        this.records = records;
        return this;
    }

    public JsonNode getAttachments() {
        return attachments;
    }

    public SmevMessageMetaEntity setAttachments(JsonNode attachments) {
        this.attachments = attachments;
        return this;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public SmevMessageMetaEntity setCreatedAt(LocalDateTime sendQueueDateTime) {
        this.createdAt = sendQueueDateTime;
        return this;
    }

    @Nullable
    public Mnemonic mnemonicEnum() {
        return Mnemonic.fromStringPair(mnemonic, mnemonicVersion);
    }

    public static SmevMessageMetaEntity createIncoming(@NotNull Mnemonic mnemonic,
                                                       @NotNull UUID clientId,
                                                       @NotNull UUID referenceClientId,
                                                       @NotNull UUID referenceReestrIncoming,
                                                       @NotNull JsonNode xmlObject,
                                                       @NotNull String xmlString) {
        SmevMessageMetaEntity message = new SmevMessageMetaEntity();
        message.setId(UUID.randomUUID());
        message.setDirection(MessageDirection.INCOMING);
        message.setClientId(clientId);
        message.setReferenceClientId(referenceClientId);
        message.setMnemonic(mnemonic.getMnemonic());
        message.setMnemonicVersion(mnemonic.getVersion());
        message.setReferenceReestrIncoming(referenceReestrIncoming);
        message.setXmlObject(xmlObject);
        message.setXmlString(xmlString);

        return message;
    }

    public static SmevMessageMetaEntity createOutgoing(@NotNull Mnemonic mnemonic,
                                                       @NotNull UUID clientId,
                                                       @NotNull UUID referenceReestrOutgoing,
                                                       @NotNull JsonNode xmlObject,
                                                       @NotNull String xmlString) {
        SmevMessageMetaEntity message = new SmevMessageMetaEntity();
        message.setId(UUID.randomUUID());
        message.setDirection(MessageDirection.OUTGOING);
        message.setClientId(clientId);
        message.setMnemonic(mnemonic.getMnemonic());
        message.setMnemonicVersion(mnemonic.getVersion());
        message.setReferenceReestrOutgoing(referenceReestrOutgoing);
        message.setXmlObject(xmlObject);
        message.setXmlString(xmlString);

        return message;
    }
}
