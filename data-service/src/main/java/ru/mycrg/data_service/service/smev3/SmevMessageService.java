package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.detached.DetachedBaseDao;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.detached.DetachedSchemaDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.reestrs.ReestrIncoming;
import ru.mycrg.data_service.entity.reestrs.ReestrOutgoing;
import ru.mycrg.data_service.entity.smev.SmevMessageMetaEntity;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.mappers.SchemaMapper;
import ru.mycrg.data_service.service.reestrs.ReestrIncomingService;
import ru.mycrg.data_service.service.reestrs.ReestrOutgoingService;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.smev3.fields.FieldsSmevMessageMetaEntity;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.ReestrStatus;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.util.JsonConverter;

import java.time.LocalDateTime;
import java.util.UUID;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevMessageService {
    private static final Logger log = LoggerFactory.getLogger(SmevMessageService.class);
    private static final ResourceQualifier resourceQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, FieldsSmevMessageMetaEntity.TABLE);
    private final Smev3Config smev3Config;
    private final ReestrIncomingService incomingService;
    private final ReestrOutgoingService outgoingService;
    private final DetachedBaseDao detachedBaseDao;
    private final DetachedSchemaDao detachedSchemaDao;
    private final DetachedRecordsDao detachedRecordsDao;
    private final BaseDao baseDao;

    public SmevMessageService(Smev3Config smev3Config, ReestrIncomingService incomingService,
                              ReestrOutgoingService outgoingService,
                              DetachedBaseDao detachedBaseDao,
                              DetachedSchemaDao detachedSchemaDao,
                              DetachedRecordsDao detachedRecordsDao,
                              BaseDao baseDao) {
        this.smev3Config = smev3Config;
        this.incomingService = incomingService;
        this.outgoingService = outgoingService;
        this.detachedBaseDao = detachedBaseDao;
        this.detachedSchemaDao = detachedSchemaDao;
        this.detachedRecordsDao = detachedRecordsDao;
        this.baseDao = baseDao;
    }

    public void saveIncoming(ProcessAdapterMessageResult processResult, IRecord originalMessageRecord) {
        try {
            var reestrMessage = new ReestrIncoming();
            reestrMessage.setId(UUID.randomUUID());
            reestrMessage.setResponseTo(originalMessageRecord.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_REFERENCE_REESTR_OUTGOING));
            reestrMessage.setBody(processResult.getXmlBuildMeta().getXmlString());
            reestrMessage.setDateOut(LocalDateTime.now());
            reestrMessage.setStatus(processResult.getStatus());
            reestrMessage.setSystem(Systems.GISOGR_RK);
            if (processResult.getXmlBuildMeta().getXmlString().contains("RRTR02")) {
                reestrMessage.setUserFrom(Systems.FGIS_EGRN);
            } else {
                reestrMessage.setUserFrom(Systems.EIS_JS);
            }
            incomingService.save(reestrMessage);

            var smevMessage = SmevMessageMetaEntity.createIncoming(
                            processResult.getXmlBuildMeta().getMnemonic(),
                            processResult.getXmlBuildMeta().getMnemonicVersion(),
                            processResult.getXmlBuildMeta().getClientId(),
                            processResult.getXmlBuildMeta().getReferenceClientId(),
                            reestrMessage.getId(),
                            processResult.getXmlBuildMeta().getXmlObject(),
                            processResult.getXmlBuildMeta().getXmlString()
                    )
                    .setRecords(processResult.getXmlBuildMeta().getSources())
                    .setAttachments(processResult.getXmlBuildMeta().getAttachments())
                    .setCreatedAt(reestrMessage.getDateOut());

            saveMessage(smevMessage);
            log.info("save smev message. id:{}", smevMessage.getId());
        } catch (Exception e) {
            throw new SmevRequestException("saveIncoming error :" + e.getMessage());
        }
    }

    public void saveOutgoing(XmlBuildMeta buildMeta, String userTo) {
        try {
            var reestrMessage = new ReestrOutgoing();
            reestrMessage.setId(UUID.randomUUID());
            reestrMessage.setBody(buildMeta.getXmlString());
            reestrMessage.setDateOut(LocalDateTime.now());
            reestrMessage.setStatus(ReestrStatus.SEND_QUEUE.getTitle());
            reestrMessage.setSystem(Systems.GISOGR_RK);
            reestrMessage.setUserTo(userTo);
            outgoingService.save(reestrMessage);

            var smevMessage = SmevMessageMetaEntity.createOutgoing(
                            buildMeta.getMnemonic(),
                            buildMeta.getMnemonicVersion(),
                            buildMeta.getClientId(),
                            reestrMessage.getId(),
                            buildMeta.getXmlObject(),
                            buildMeta.getXmlString()
                    )
                    .setRecords(buildMeta.getSources())
                    .setAttachments(buildMeta.getAttachments())
                    .setCreatedAt(reestrMessage.getDateOut());

            saveMessage(smevMessage);
            log.info("save smev message. id:{}", smevMessage.getId());
        } catch (Exception e) {
            throw new SmevRequestException("saveOutgoing error :" + e.getMessage());
        }
    }

    public IRecord getByClientId(UUID clientId) {
        var byClientId = "client_id = '" + clientId.toString() + "'";
        return detachedBaseDao.baseData(smev3Config.getTargetDb())
                .findBy(resourceQualifier, byClientId)
                .orElseThrow(() -> new SmevRequestException("record not found"));
    }

    @Transactional
    public XmlBuildMeta getMeta(UUID id) {
        log.debug("get meta by {}", id);

        var message = baseDao.findById(new ResourceQualifier(resourceQualifier, id, ResourceType.TABLE))
                .orElseThrow(() -> new SmevRequestException("record not found"));

        return new XmlBuildMeta(
                message.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_MNEMONIC),
                message.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_MNEMONIC_VERSION),
                UUID.fromString(message.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_CLIENT_ID)),
                null,
                JsonConverter.toJsonNodeFromString(message.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_XML_OBJECT)),
                message.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_XML_STRING),
                JsonConverter.toJsonNodeFromString(message.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_RECORDS)),
                JsonConverter.toJsonNodeFromString(message.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_ATTACHMENTS))
        );
    }

    private void saveMessage(SmevMessageMetaEntity smevMessage) throws CrgDaoException {
        var schema = detachedSchemaDao.schemaDao(smev3Config.getTargetDb())
                .find(FieldsSmevMessageMetaEntity.SCHEMA_NAME);
        detachedRecordsDao.addRecordsAsBatch(
                resourceQualifier,
                smevMessage,
                SchemaMapper.mapToDto(schema),
                smev3Config.getTargetDb()
        );
    }
}
