package ru.mycrg.data_service.service.smev3.request.receipt_rns;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.fields.FieldsEisZs;
import ru.mycrg.data_service.receipt_rns_1_0_9.QueryResult;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.ResponseProcessor;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;


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

    public ReceiptRnsResponseService(RecordsDao recordsDao, ISchemaService schemaService) {
        super(
                Mnemonic.RECEIPT_RNS_1_0_9,
                recordsDao,
                schemaService
        );
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
                    var responseType = queryResult
                            .getMessage()
                            .getResponseContent()
                            .getContent()
                            .getMessagePrimaryContent()
                            .getResponse();

                    var iRecord = new ReceiptRnsResponseXmlProcess().run(responseType);

                    save(iRecord);

                    return new ProcessAdapterMessageResult()
                            .setXmlBuildMeta(XmlBuildMeta)
                            .setStatus("saved")
                            .setMessage("saved");
                }
            }

            throw new SmevRequestException("unknown or null message type");
        } catch (Exception e) {
            log.error("Process adapter message error: {}", e.getMessage());
            throw new SmevRequestException("process adapter message error :" + e.getMessage());
        }
    }

    private SmevMessageType messageType(QueryResult queryResult) {
        return SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
    }

    private void save(IRecord record) throws CrgDaoException {
        log.debug("try to save 'dl_data_eis_zs' record: " + record);

        var qualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, FieldsEisZs.TABLE);
        var schema = this.getSchema(FieldsEisZs.TABLE).orElseThrow();
        var savedRecord = getRecordsDao().addRecord(
                qualifier,
                record,
                schema
        );

        log.info("record 'dl_data_eis_zs' saved: " + savedRecord);
    }
}
