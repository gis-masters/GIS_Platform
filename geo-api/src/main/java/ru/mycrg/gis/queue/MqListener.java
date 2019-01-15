package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.mycrg.gis.service.OrganizationService;

import static ru.mycrg.gis.config.MqProperties.QUEUE_ORG_CREATED;

@Component
@EnableRabbit
public class MqListener {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final OrganizationService organizationService;

    @Autowired
    public MqListener(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @RabbitListener(queues = QUEUE_ORG_CREATED)
    public void created(Long id) {
        log.info("Создана организация с id: {}", id);

        organizationService.organizationCreated(id);
    }
}
