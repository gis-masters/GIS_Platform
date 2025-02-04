package ru.mycrg.data_service.service.smev3.request.register_rnv;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rns_1_0_10.QueryResult;
import ru.mycrg.data_service.register_rns_1_0_10.Reject;
import ru.mycrg.data_service.register_rns_1_0_10.Status;
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
public class RegisterRnvResponseService extends ResponseProcessor {

    private final Logger log = LoggerFactory.getLogger(RegisterRnvResponseService.class);

    public RegisterRnvResponseService() {
        super(Mnemonic.REGISTER_RNV_1_0_8);
    }

    @Override
    @Transactional
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        try {
            QueryResult queryResult = XmlMarshaller.unmarshall(messageBody, QueryResult.class);

            SmevRequestMeta meta = new SmevRequestMeta(
                    mnemonicEnum(),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getClientId()),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getReplyToClientId()),
                    messageBody,
                    JsonConverter.toJsonNode(queryResult),
                    null,
                    null);

            switch (messageType(queryResult)) {
                case REJECT: {
                    log.debug("Тип сообщения - REJECT");
                    Reject reject = queryResult.getMessage().getResponseContent().getRejects().get(0);

                    return new ProcessAdapterMessageResult(ProcessMessageStatus.ERROR_REJECT)
                            .setXmlBuildMeta(meta)
                            .setSmevDescription(reject.getCode(), reject.getDescription());
                }
                case STATUS: {
                    log.debug("Тип сообщения - STATUS");
                    Status status = queryResult.getMessage().getResponseContent().getStatus();

                    return new ProcessAdapterMessageResult(ProcessMessageStatus.ERROR_STATUS)
                            .setXmlBuildMeta(meta)
                            .setSmevDescription(status.getCode(), status.getDescription());
                }
                case PRIMARY: {
                    log.error("Тип сообщения - PRIMARY. Но обработка не сделана -  метод не реализован");

                    return new ProcessAdapterMessageResult(ProcessMessageStatus.ERROR_NOT_IMPLEMENTED)
                            .setXmlBuildMeta(meta);
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
