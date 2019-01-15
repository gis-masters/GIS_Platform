package ru.geoserver.mq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.geoserver.config.MqProperties;

@Service
public class MqSender implements MqEvents {

    private static final Logger log = LoggerFactory.getLogger(MqSender.class);

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void created(Long msg) {
        log.info("Send created event: {}", msg);

        rabbitTemplate.convertAndSend(MqProperties.FANOUT_ORG_CREATED, MqProperties.KEY_ORG_CREATED, msg);
    }
}
