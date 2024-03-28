package ru.mycrg.data_service.service.smev3.request.receipt_rnv;

import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.fields.FieldsEisZs;
import ru.mycrg.data_service.receipt_rnv_1_0_9.QueryResult;
import ru.mycrg.data_service.service.smev3.DataEisZsService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.ResponseProcessor;
import ru.mycrg.data_service.util.JsonConverter;

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
    private final Logger log = LoggerFactory.getLogger(ReceiptRnvResponseService.class);
    private final DataEisZsService dataEisZsService;

    public ReceiptRnvResponseService(DataEisZsService dataEisZsService) {
        super(Mnemonic.RECEIPT_RNV_1_0_9);
        this.dataEisZsService = dataEisZsService;
    }

    @Override
    @Transactional
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        log.debug("receive message from smev " + messageBody);

        try {
            var queryResult = xmlMarshaller().unmarshall(messageBody, QueryResult.class);

            var XmlBuildMeta = new XmlBuildMeta(
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
                    log.debug("message type is REJECT");
                    return new ProcessAdapterMessageResult()
                            .setXmlBuildMeta(XmlBuildMeta)
                            .setStatus(queryResult.getMessage().getResponseContent().getRejects().get(0).getCode())
                            .setMessage(queryResult.getMessage().getResponseContent().getRejects().get(0).getDescription());
                }
                case STATUS: {
                    log.debug("message type is STATUS");
                    return new ProcessAdapterMessageResult()
                            .setXmlBuildMeta(XmlBuildMeta)
                            .setStatus(queryResult.getMessage().getResponseContent().getStatus().getCode())
                            .setMessage(queryResult.getMessage().getResponseContent().getStatus().getDescription());
                }
                case PRIMARY: {
                    log.debug("message type is PRIMARY");
                    processResponse(queryResult);

                    return new ProcessAdapterMessageResult()
                            .setXmlBuildMeta(XmlBuildMeta)
                            .setStatus("saved")
                            .setMessage("saved");
                }
            }

            return null;
        } catch (Exception e) {
            log.error("Process adapter message error: {}", e.getMessage());
            throw new SmevRequestException("process adapter message error :" + e.getMessage());
        }
    }

    private void processResponse(QueryResult queryResult) {
        var responseType = queryResult
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        var process = new ReceiptRnvResponseXmlProcessor();

        if (responseType.getResponseExploitation() != null) {
            var iRecord = process.processOne(responseType.getResponseExploitation());
            log.info("found one record " + iRecord);

            dataEisZsService.updateExists(FieldsEisZs.PROPERTY_PERMIT_NUMBER, iRecord);
        } else if (!CollectionUtils.isEmpty(responseType.getResponseListExploitation())) {
            var iRecords = process.processList(responseType.getResponseListExploitation());
            log.info("found record count " + iRecords.size());

            dataEisZsService.addOrIgnoreRecords(FieldsEisZs.PROPERTY_PERMIT_NUMBER, iRecords);
        } else {
            throw new SmevRequestException("response contains no content");
        }
    }

    private SmevMessageType messageType(QueryResult queryResult) {
        return SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
    }
}
