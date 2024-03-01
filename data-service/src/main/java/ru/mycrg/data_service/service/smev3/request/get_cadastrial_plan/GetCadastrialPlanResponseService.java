package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rnv_1_0_9.QueryResult;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.ResponseProcessor;
import ru.mycrg.data_service.util.JsonConverter;

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
            QueryResult queryResult = xmlMarshaller().unmarshall(messageBody, QueryResult.class);

            XmlBuildMeta metaInfo = new XmlBuildMeta(
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
                    return new ProcessAdapterMessageResult()
                            .setXmlBuildMeta(metaInfo)
                            .setStatus(queryResult.getMessage().getResponseContent().getRejects().get(0).getCode())
                            .setMessage(queryResult.getMessage().getResponseContent().getRejects().get(0).getDescription());
                }
                case STATUS: {
                    return new ProcessAdapterMessageResult()
                            .setXmlBuildMeta(metaInfo)
                            .setStatus(queryResult.getMessage().getResponseContent().getStatus().getCode())
                            .setMessage(queryResult.getMessage().getResponseContent().getStatus().getDescription());
                }
                case PRIMARY: {
                    return new ProcessAdapterMessageResult()
                            .setXmlBuildMeta(metaInfo)
                            .setStatus("NotImplemented")
                            .setMessage("NotImplemented");
                }
            }

            return null;
        } catch (Exception e) {
            log.error("Process adapter message error: {}", e.getMessage());
            throw new SmevRequestException("process adapter message error :" + e.getMessage());
        }
    }

    private SmevMessageType messageType(QueryResult queryResult) {
        return SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
    }
}
