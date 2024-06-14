package ru.mycrg.data_service.service.smev3.request.receipt_rns;

import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rns_1_0_9.QueryResult;
import ru.mycrg.data_service.service.smev3.DataEisZsService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.fields.FieldsEisZs;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.ProcessMessageStatus;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.ResponseProcessor;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class ReceiptRnsResponseService extends ResponseProcessor {

    private final Logger log = LoggerFactory.getLogger(ReceiptRnsResponseService.class);
    private final DataEisZsService dataEisZsService;

    public ReceiptRnsResponseService(DataEisZsService dataEisZsService) {
        super(Mnemonic.RECEIPT_RNS_1_0_9);
        this.dataEisZsService = dataEisZsService;
    }

    @Override
    @Transactional
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        log.debug("Получено сообщение из СМЭВ: {}", messageBody);

        try {
            var queryResult = xmlMarshaller().unmarshall(messageBody, QueryResult.class);

            var XmlBuildMeta = new SmevRequestMeta(
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
                    var reject = queryResult.getMessage().getResponseContent().getRejects().get(0);
                    return new ProcessAdapterMessageResult(ProcessMessageStatus.ERROR_REJECT)
                            .setXmlBuildMeta(XmlBuildMeta)
                            .setSmevDescription(
                                    reject.getCode(),
                                    reject.getDescription()
                            );
                }
                case STATUS: {
                    log.debug("Тип сообщения - STATUS");
                    var status = queryResult.getMessage().getResponseContent().getStatus();
                    return new ProcessAdapterMessageResult(ProcessMessageStatus.ERROR_STATUS)
                            .setXmlBuildMeta(XmlBuildMeta)
                            .setSmevDescription(
                                    status.getCode(),
                                    status.getDescription()
                            );
                }
                case PRIMARY: {
                    log.debug("Тип сообщения - PRIMARY");
                    processResponse(queryResult);

                    return new ProcessAdapterMessageResult(ProcessMessageStatus.SUCCESSFULLY)
                            .setXmlBuildMeta(XmlBuildMeta);
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

    private void processResponse(QueryResult queryResult) {
        var responseType = queryResult
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        var process = new ReceiptRnsResponseXmlProcessor();

        if (responseType.getResponseConstruction() != null) {
            var iRecord = process.processOne(responseType.getResponseConstruction());
            log.info("Найдена 1 запись {}", iRecord);

            dataEisZsService.updateExists(FieldsEisZs.PROPERTY_CONST_PERMIT_NUMBER, iRecord);
        } else if (!CollectionUtils.isEmpty(responseType.getResponseListConstruction())) {
            var iRecords = process.processList(responseType.getResponseListConstruction());
            log.info("Найдено {} записей", iRecords.size());

            dataEisZsService.addOrIgnoreRecords(FieldsEisZs.PROPERTY_CONST_PERMIT_NUMBER, iRecords);
        } else {
            throw new SmevRequestException("Ответ из СМЭВ не содержит записей для обработки");
        }
    }
}
