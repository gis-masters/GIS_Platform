package ru.mycrg.data_service.service.smev3.get_cadastrial_plan;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class GetCadastrialPlanRequestService {

    private final Logger log = LoggerFactory.getLogger(GetCadastrialPlanRequestService.class);
    private final Smev3Config smev3Config;
    private final RabbitTemplate rabbitTemplate;
    private final Queue adapterSendQueue;

    public GetCadastrialPlanRequestService(Smev3Config smev3Config, RabbitTemplate rabbitSmevAdapterTemplate, Queue adapterSendQueue) {
        this.smev3Config = smev3Config;
        this.rabbitTemplate = rabbitSmevAdapterTemplate;
        this.adapterSendQueue = adapterSendQueue;
    }

    public XmlBuildMeta request(@NotNull String requestFilename,
                                @NotNull String appFilename,
                                @NotNull String passportFilename,
                                @NotNull String archiveFilename) {
        try {
            var buildMeta = new GetCadastrialPlanXmlBuildProcess(
                    smev3Config
            ).run(requestFilename, appFilename, passportFilename, archiveFilename);
            log.info("SMEV3. ClientId: {}", buildMeta.getClientId());
            log.debug("message send to queue");
            rabbitTemplate.convertAndSend(adapterSendQueue.getName(), buildMeta.getXmlString());
            return buildMeta;
        } catch (Exception e) {
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }
}
