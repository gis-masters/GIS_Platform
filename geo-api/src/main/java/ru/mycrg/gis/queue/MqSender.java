package ru.mycrg.gis.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.OrgMqProcessRequest;

import static ru.mycrg.common.config.MqProperties.*;

@Service
public class MqSender implements IMqEvents {

    private static final Logger log = LoggerFactory.getLogger(IMqEvents.class);

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void sendOrgEvent(OrgMqProcessRequest payload) {
        send(FANOUT_ORG_INIT, KEY_ORG_INIT, payload);
    }

    @Override
    public void initImport(BaseMqProcessRequest payload) {
        send(FANOUT_IMPORT_INIT, KEY_IMPORT_INIT, payload);
    }

    @Override
    public void sendValidationRequest(BaseMqProcessRequest payload) {
        send(FANOUT_VALIDATION_START, KEY_VALIDATION_START, payload);
    }

    @Override
    public void sendGmlInit(BaseMqProcessRequest payload) {
        send(FANOUT_GML_INIT, KEY_GML_INIT, payload);
    }

    private void send(String fanout, String key, BaseMqProcessRequest payload) {
        log.debug("Send {} ", payload.getId());

        rabbitTemplate.convertAndSend(fanout, key, payload);
    }
}
