package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.reestrs.ReestrIncoming;
import ru.mycrg.data_service.entity.reestrs.ReestrOutgoing;
import ru.mycrg.data_service.entity.smev.SmevMessageMetaEntity;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.repository.SmevMessageMetaRepository;
import ru.mycrg.data_service.service.reestrs.ReestrIncomingService;
import ru.mycrg.data_service.service.reestrs.ReestrOutgoingService;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.ReestrStatus;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevMessageService {
    private static final Logger log = LoggerFactory.getLogger(SmevMessageService.class);
    private final ReestrIncomingService incomingService;
    private final ReestrOutgoingService outgoingService;
    private final SmevMessageMetaRepository messageMetaRp;

    public SmevMessageService(ReestrIncomingService incomingService,
                              ReestrOutgoingService outgoingService,
                              SmevMessageMetaRepository messageMetaRp) {
        this.incomingService = incomingService;
        this.outgoingService = outgoingService;
        this.messageMetaRp = messageMetaRp;
    }

    @Transactional
    public void saveIncoming(ProcessAdapterMessageResult processResult, SmevMessageMetaEntity originalMessageRecord) {
        try {
            var reestrMessage = new ReestrIncoming();
            reestrMessage.setId(UUID.randomUUID());
            reestrMessage.setResponseTo(originalMessageRecord.getReferenceReestrOutgoing().toString());
            reestrMessage.setBody(processResult.getXmlBuildMeta().getXmlString());
            reestrMessage.setDateIn(LocalDateTime.now());
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
                            processResult.getXmlBuildMeta().getClientId(),
                            processResult.getXmlBuildMeta().getReferenceClientId(),
                            reestrMessage.getId(),
                            processResult.getXmlBuildMeta().getXmlObject(),
                            processResult.getXmlBuildMeta().getXmlString()
                    )
                    .setRecords(processResult.getXmlBuildMeta().getSources())
                    .setAttachments(processResult.getXmlBuildMeta().getAttachments())
                    .setCreatedAt(reestrMessage.getDateIn());

            messageMetaRp.save(smevMessage);

            log.info("save smev message. id:{}", smevMessage.getId());
        } catch (Exception e) {
            throw new SmevRequestException("saveIncoming error :" + e.getMessage());
        }
    }

    @Transactional
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
                            buildMeta.getClientId(),
                            reestrMessage.getId(),
                            buildMeta.getXmlObject(),
                            buildMeta.getXmlString()
                    )
                    .setRecords(buildMeta.getSources())
                    .setAttachments(buildMeta.getAttachments())
                    .setCreatedAt(reestrMessage.getDateOut());

            messageMetaRp.save(smevMessage);

            log.info("save smev message. id:{}", smevMessage.getId());
        } catch (Exception e) {
            throw new SmevRequestException("saveOutgoing error :" + e.getMessage());
        }
    }

    @Transactional
    public SmevMessageMetaEntity getByClientId(UUID clientId) {
        return messageMetaRp.findByClientId(clientId)
                .orElseThrow(() -> new SmevRequestException("record not found"));
    }

    @Transactional
    public XmlBuildMeta getMeta(UUID id) {
        log.debug("get meta by {}", id);
        var message = messageMetaRp.findById(id)
                .orElseThrow(() -> new SmevRequestException("record not found"));
        return new XmlBuildMeta(
                message.mnemonicEnum(),
                message.getClientId(),
                null,
                message.getXmlObject(),
                message.getXmlString(),
                message.getRecords(),
                message.getAttachments()
        );
    }
}
