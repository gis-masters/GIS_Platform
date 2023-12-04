package ru.mycrg.data_service.service.smev3.receipt_rns;


import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class ReceiptRnsRequestService {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestService.class);
    private final Smev3Config smev3Config;
    private final RabbitTemplate rabbitSmevAdapterTemplate;
    private final Queue adapterSendQueue;

    public ReceiptRnsRequestService(Smev3Config smev3Config, RabbitTemplate rabbitSmevAdapterTemplate, Queue adapterSendQueue) {
        this.smev3Config = smev3Config;
        this.rabbitSmevAdapterTemplate = rabbitSmevAdapterTemplate;
        this.adapterSendQueue = adapterSendQueue;
    }

    public XmlBuildMeta request(@NotNull ReceiptRnsRequestDto dto) {
        log.info("SMEV3 | receipt-rns/1.0.9 {}", dto);
        try {
            var meta = new ReceiptRnsXmlBuildProcess(smev3Config).run(dto);

            if (dto.getSendToSmev()) {
                rabbitSmevAdapterTemplate.convertAndSend(adapterSendQueue.getName(), meta.getXmlRequest());
                log.info("SMEV. Send message");
            }

            log.info("SMEV. ClientId: {}", meta.getClientId());

            return meta;
        } catch (Exception e) {
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }
}
