package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rnv_1_0_9.QueryResult;
import ru.mycrg.data_service.receipt_rnv_1_0_9.Reject;
import ru.mycrg.data_service.receipt_rnv_1_0_9.Status;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.ProcessMessageStatus;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.ResponseProcessor;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import java.util.UUID;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class GetCadastrialPlanResponseService extends ResponseProcessor {

    private final Logger log = LoggerFactory.getLogger(GetCadastrialPlanResponseService.class);

    public GetCadastrialPlanResponseService() {
        super(Mnemonic.GET_CADASTRIAL_PLAN_1_1_2);
    }

    @Override
    @Transactional
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        try {
            QueryResult queryResult = XmlMarshaller.unmarshall(messageBody, QueryResult.class);

            SmevRequestMeta metaInfo = new SmevRequestMeta(
                    mnemonicEnum(),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getClientId()),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getReplyToClientId()),
                    messageBody,
                    JsonConverter.toJsonNode(queryResult),
                    null,
                    null
            );

            switch (messageType(queryResult)) {
                case REJECT: {
                    log.debug("Тип сообщения - REJECT");
                    Reject reject = queryResult.getMessage().getResponseContent().getRejects().get(0);

                    return new ProcessAdapterMessageResult(ProcessMessageStatus.ERROR_REJECT)
                            .setXmlBuildMeta(metaInfo)
                            .setSmevDescription(reject.getCode(), reject.getDescription());
                }
                case STATUS: {
                    log.debug("Тип сообщения - STATUS");
                    Status status = queryResult.getMessage().getResponseContent().getStatus();

                    return new ProcessAdapterMessageResult(ProcessMessageStatus.ERROR_STATUS)
                            .setXmlBuildMeta(metaInfo)
                            .setSmevDescription(status.getCode(), status.getDescription());
                }
                case PRIMARY: {
                    log.debug("Тип сообщения - PRIMARY");

                    return new ProcessAdapterMessageResult(ProcessMessageStatus.SUCCESSFULLY)
                            .setXmlBuildMeta(metaInfo);
                }
            }

            throw new SmevRequestException("Неизвестный тип сообщения");
        } catch (Exception e) {
            log.error("Ошибка при обработке сообщения из СМЭВ: {}", e.getMessage());
            throw new SmevRequestException("Ошибка при обработке сообщения из СМЭВ :" + e.getMessage());
        }
    }

    private SmevMessageType messageType(QueryResult queryResult) {
        return SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
    }
}
