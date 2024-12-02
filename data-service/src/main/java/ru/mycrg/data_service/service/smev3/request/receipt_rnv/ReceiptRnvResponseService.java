package ru.mycrg.data_service.service.smev3.request.receipt_rnv;

import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rnv_1_0_9.QueryResult;
import ru.mycrg.data_service.receipt_rnv_1_0_9.Reject;
import ru.mycrg.data_service.receipt_rnv_1_0_9.ResponseType;
import ru.mycrg.data_service.receipt_rnv_1_0_9.Status;
import ru.mycrg.data_service.service.smev3.DataEisZsService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.fields.FieldsEisZs;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.ProcessMessageStatus;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.ResponseProcessor;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import java.util.List;
import java.util.UUID;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rnv/1.0.9
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class ReceiptRnvResponseService extends ResponseProcessor {

    private static final Logger log = LoggerFactory.getLogger(ReceiptRnvResponseService.class);

    private final DataEisZsService dataEisZsService;

    public ReceiptRnvResponseService(DataEisZsService dataEisZsService) {
        super(Mnemonic.RECEIPT_RNV_1_0_9);

        this.dataEisZsService = dataEisZsService;
    }

    @Override
    @Transactional
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        log.debug("Получено сообщение из СМЭВ: {}", messageBody);

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
                    log.debug("Тип сообщения - PRIMARY");
                    processResponse(queryResult);

                    return new ProcessAdapterMessageResult(ProcessMessageStatus.SUCCESSFULLY)
                            .setXmlBuildMeta(meta);
                }
            }

            throw new SmevRequestException("Неизвестный тип сообщения");
        } catch (Exception e) {
            log.error("Ошибка при обработке сообщения из СМЭВ: {}", e.getMessage());
            throw new SmevRequestException("Ошибка при обработке сообщения из СМЭВ: " + e.getMessage());
        }
    }

    private void processResponse(QueryResult queryResult) {
        ResponseType responseType = queryResult
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        ReceiptRnvResponseXmlProcessor receiptRnvProcessor = new ReceiptRnvResponseXmlProcessor();

        if (responseType.getResponseExploitation() != null) {
            IRecord record = receiptRnvProcessor.processOne(responseType.getResponseExploitation());
            log.info("Найдена 1 запись {}", record);

            dataEisZsService.updateExists(FieldsEisZs.PROPERTY_PERMIT_NUMBER, record);
        } else if (!CollectionUtils.isEmpty(responseType.getResponseListExploitation())) {
            List<IRecord> records = receiptRnvProcessor.processList(responseType.getResponseListExploitation());
            log.info("Найдено {} записей", records.size());

            dataEisZsService.addOrIgnoreRecords(FieldsEisZs.PROPERTY_PERMIT_NUMBER, records);
        } else {
            throw new SmevRequestException("Ответ из СМЭВ не содержит записей для обработки");
        }
    }

    private SmevMessageType messageType(QueryResult queryResult) {
        return SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
    }
}
