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
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.AcceptKptService;

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
    private final SmevMessageMetaRepository smevMsgRepository;
    private final AcceptKptService acceptKptService;

    public SmevMessageService(ReestrIncomingService incomingService,
                              ReestrOutgoingService outgoingService,
                              SmevMessageMetaRepository smevMsgRepository,
                              AcceptKptService acceptKptService) {
        this.incomingService = incomingService;
        this.outgoingService = outgoingService;
        this.smevMsgRepository = smevMsgRepository;
        this.acceptKptService = acceptKptService;
    }

    @Transactional
    public void saveIncoming(ProcessAdapterMessageResult processResult,
                             SmevMessageMetaEntity originalMessageRecord) {
        try {
            var incomingMessage = new ReestrIncoming();
            incomingMessage.setId(UUID.randomUUID());
            incomingMessage.setResponseTo(originalMessageRecord.getReferenceReestrOutgoing().toString());
            incomingMessage.setBody(processResult.getXmlBuildMeta().getRequestXmlString());
            incomingMessage.setDateIn(LocalDateTime.now());
            incomingMessage.setStatus(processResult.getStatus().name());
            incomingMessage.setSystem(Systems.GISOGD_RK);
            if (processResult.isFgisEgrnMessage()) {
                incomingMessage.setUserFrom(Systems.FGIS_EGRN);
                acceptKptService.acceptKpt(processResult);
            } else {
                incomingMessage.setUserFrom(Systems.EIS_JS);
            }
            incomingService.save(incomingMessage);

            var smevMessage = SmevMessageMetaEntity.createIncoming(
                                                           processResult.getXmlBuildMeta().getMnemonic(),
                                                           processResult.getXmlBuildMeta().getClientId(),
                                                           processResult.getXmlBuildMeta().getReferenceClientId(),
                                                           incomingMessage.getId(),
                                                           processResult.getXmlBuildMeta().getRequestJson(),
                                                           processResult.getXmlBuildMeta().getRequestXmlString()
                                                   )
                                                   .setRecords(processResult.getXmlBuildMeta().getSources())
                                                   .setAttachments(processResult.getXmlBuildMeta().getAttachments())
                                                   .setCreatedAt(incomingMessage.getDateIn());

            smevMsgRepository.save(smevMessage);

            log.info("Сохранено входящее сообщение. id: {}", smevMessage.getId());
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка при сохранении :" + e.getMessage());
        }
    }

    @Transactional
    public void saveIncoming(String message) {
        try {
            ReestrIncoming incomingMessage = new ReestrIncoming();
            incomingMessage.setId(UUID.randomUUID());
            incomingMessage.setBody(message);
            incomingMessage.setDateIn(LocalDateTime.now());
            incomingMessage.setStatus("В работе");
            incomingMessage.setSystem(Systems.GISOGD_RK);
            incomingMessage.setUserFrom(Systems.EPGU);
            incomingService.save(incomingMessage);
            log.info("Сохранено входящее сообщение. id: {}", incomingMessage.getId());
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка при сохранении :" + e.getMessage());
        }
    }

    @Transactional
    public void saveOutgoing(SmevRequestMeta requestMeta, String userTo) {
        try {
            ReestrOutgoing reestrMessage = new ReestrOutgoing();
            reestrMessage.setId(UUID.randomUUID());
            reestrMessage.setBody(requestMeta.getRequestXmlString());
            reestrMessage.setDateOut(LocalDateTime.now());
            reestrMessage.setStatus(ReestrStatus.SEND_QUEUE.getTitle());
            reestrMessage.setSystem(Systems.GISOGD_RK);
            reestrMessage.setUserTo(userTo);
            outgoingService.save(reestrMessage);

            SmevMessageMetaEntity smevMessage = SmevMessageMetaEntity
                    .createOutgoing(requestMeta.getMnemonic(),
                                    requestMeta.getClientId(),
                                    reestrMessage.getId(),
                                    requestMeta.getRequestJson(),
                                    requestMeta.getRequestXmlString())
                    .setRecords(requestMeta.getSources())
                    .setAttachments(requestMeta.getAttachments())
                    .setCreatedAt(reestrMessage.getDateOut());

            smevMsgRepository.save(smevMessage);

            log.info("Сохранено исходящее сообщение. id: {}", smevMessage.getId());
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка при сохранении :" + e.getMessage());
        }
    }

    public SmevMessageMetaEntity getByClientId(UUID clientId) {
        return smevMsgRepository
                .findByClientId(clientId)
                .orElseThrow(() -> new SmevRequestException("Не найдена СМЭВ запись по clientId: " + clientId));
    }

    public SmevRequestMeta getMeta(UUID id) {
        SmevMessageMetaEntity message = smevMsgRepository
                .findById(id)
                .orElseThrow(() -> new SmevRequestException("Не найдена СМЭВ запись по id: " + id));

        return new SmevRequestMeta(
                message.mnemonicEnum(),
                message.getClientId(),
                null,
                message.getXmlString(),
                message.getXmlObject(),
                message.getRecords(),
                message.getAttachments()
        );
    }
}
