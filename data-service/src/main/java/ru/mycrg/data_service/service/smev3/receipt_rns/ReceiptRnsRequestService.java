package ru.mycrg.data_service.service.smev3.receipt_rns;


import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rns_1_0_10.QueryResult;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.smev3.ISmevMessageConsumer;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.support_classes.Mnemonic;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

import static ru.mycrg.data_service.service.smev3.receipt_rnv.ReceiptRnvXmlBuildProcess.namespacePrefixMapper;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class ReceiptRnsRequestService implements ISmevMessageConsumer {
    static final String MNEMONIC = "receipt-rns";
    static final String MNEMONIC_VERSION = "1.0.9";
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestService.class);
    private final XmlMarshaller marshaller = new XmlMarshaller(namespacePrefixMapper);
    private final Smev3Config smev3Config;
    private final SmevMessageSenderService messageService;

    public ReceiptRnsRequestService(Smev3Config smev3Config, SmevMessageSenderService messageService) {
        this.smev3Config = smev3Config;
        this.messageService = messageService;
    }

    public XmlBuildMeta request(@NotNull ReceiptRnsRequestDto dto) {
        log.info("SMEV3. {} {}", consumerId(), dto);
        try {
            var buildMeta = new ReceiptRnsXmlBuildProcess(smev3Config).run(dto);
            log.info("SMEV3. ClientId: {}", buildMeta.getClientId());
            messageService.sendMessage(buildMeta, dto.getSendToSmev(), Systems.EIS_JS);
            return buildMeta;
        } catch (Exception e) {
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }

    @Override
    public String consumerId() {
        return Mnemonic.id(MNEMONIC, MNEMONIC_VERSION);
    }

    @Override
    public ProcessAdapterMessageResult consumeAdapterMessage(String messageBody) {
        try {
            var queryResult = marshaller.unmarshall(messageBody, QueryResult.class);

            var XmlBuildMeta = new XmlBuildMeta(
                    MNEMONIC,
                    MNEMONIC_VERSION,
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getClientId()),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getReplyToClientId()),
                    JsonConverter.toJsonNode(queryResult),
                    messageBody,
                    null,
                    null
            );
            String status;
            String message;

            if (queryResult.getMessage().getMessageType().equals("RejectMessage")) {
                status = queryResult.getMessage().getResponseContent().getRejects().get(0).getCode();
                message = queryResult.getMessage().getResponseContent().getRejects().get(0).getDescription();
            } else {
                status = queryResult.getMessage().getResponseContent().getStatus().getCode();
                message = queryResult.getMessage().getResponseContent().getStatus().getDescription();
            }

            return new ProcessAdapterMessageResult()
                    .setXmlBuildMeta(XmlBuildMeta)
                    .setStatus(status)
                    .setMessage(message);
        } catch (Exception e) {
            log.error("Process adapter message error: {}", e.getMessage());
            throw new SmevRequestException("process adapter message error :" + e.getMessage());
        }
    }
}
