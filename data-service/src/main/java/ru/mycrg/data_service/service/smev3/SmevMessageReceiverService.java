package ru.mycrg.data_service.service.smev3;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Node;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.fields.FieldsSmevMessageMetaEntity;
import ru.mycrg.data_service.service.smev3.support_classes.Mnemonic;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevMessageReceiverService {
    private final Logger log = LoggerFactory.getLogger(SmevMessageReceiverService.class);
    private final SmevMessageService messageService;
    private final RabbitTemplate rabbitTemplate;
    private final Queue adapterReceiveQueue;
    private final Queue adapterReceiveFailQueue;
    private final List<ISmevMessageConsumer> iSmevMessageConsumers;

    public SmevMessageReceiverService(SmevMessageService messageService,
                                      RabbitTemplate rabbitTemplate,
                                      Queue adapterReceiveQueue,
                                      Queue adapterReceiveFailQueue,
                                      List<ISmevMessageConsumer> iSmevMessageConsumers) {
        this.messageService = messageService;
        this.rabbitTemplate = rabbitTemplate;
        this.adapterReceiveQueue = adapterReceiveQueue;
        this.adapterReceiveFailQueue = adapterReceiveFailQueue;
        this.iSmevMessageConsumers = iSmevMessageConsumers;
    }

    /**
     * Обработка пришедшего из СМЭВ ответа
     */
    @Transactional
    public void processReceiveMessage(@NotNull Message message) {
        var body = new String(message.getBody());
        try {
            var originalMessageEntity = replyToClientId(message)
                    .map(messageService::getByClientId)
                    .orElseThrow(() -> new SmevRequestException("not found original message"));
            var consumerId = Mnemonic.id(
                    originalMessageEntity.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_MNEMONIC),
                    originalMessageEntity.getAsString(FieldsSmevMessageMetaEntity.PROPERTY_MNEMONIC_VERSION)
            );
            iSmevMessageConsumers.stream()
                    .filter(iSmevMessageConsumer -> iSmevMessageConsumer.consumerId().equals(consumerId))
                    .findFirst()
                    .ifPresentOrElse(
                            iSmevMessageConsumer -> process(iSmevMessageConsumer, originalMessageEntity, body),
                            () -> log.warn("consumer not found {}", consumerId)
                    );
        } catch (Exception e) {
            log.info("Process adapter message fail: " + e.getMessage());
            receiveFail(body);
        }
    }

    private Optional<UUID> replyToClientId(Message message) throws Exception {
        var builder = DocumentBuilderFactory
                .newInstance()
                .newDocumentBuilder();
        return Optional.of(message.getBody())
                .map(ByteArrayInputStream::new)
                .map(byteArrayInputStream -> {
                    try {
                        return builder.parse(byteArrayInputStream);
                    } catch (Exception e) {
                        throw new SmevRequestException("xml parse exception " + e.getMessage());
                    }
                })
                .map(document -> document.getElementsByTagName("replyToClientId"))
                .map(nodeList -> nodeList.item(0))
                .map(Node::getFirstChild)
                .map(Node::getNodeValue)
                .map(UUID::fromString);
    }


    private void process(ISmevMessageConsumer consumer, IRecord originalMessageRecord, String body) {
        try {
            log.debug("Try to process message {}", body);
            var processResult = consumer.consumeAdapterMessage(body);
            messageService.saveIncoming(processResult, originalMessageRecord);
            log.info("Success process");
        } catch (Exception e) {
            throw new SmevRequestException("Message save error :" + e.getMessage());
        }
    }

    /**
     * Сохранить сообщение, в случае ошибки обработки
     */
    private void receiveFail(@NotNull String body) {
        try {
            log.error("Send to 'receive fail' queue: " + body);
            rabbitTemplate.convertAndSend(adapterReceiveFailQueue.getName(), body);
        } catch (Exception e) {
            log.error("Fail to send to 'receive fail' queue. {}", e.getMessage());
        }
    }
}
