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
import ru.mycrg.data_service.entity.smev.SmevMessageMetaEntity;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.model.ResponseFailProcess;
import ru.mycrg.data_service.service.smev3.request.ResponseProcessor;
import ru.mycrg.data_service.util.JsonConverter;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.util.Base64;
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
    private static final Base64.Encoder base64Encoder = Base64.getEncoder();
    private final SmevMessageService messageService;
    private final RabbitTemplate rabbitTemplate;
    private final Queue adapterReceiveFailQueue;
    private final List<ResponseProcessor> responseProcessors;

    public SmevMessageReceiverService(SmevMessageService messageService,
                                      RabbitTemplate rabbitTemplate,
                                      Queue adapterReceiveFailQueue,
                                      List<ResponseProcessor> responseProcessors) {
        this.messageService = messageService;
        this.rabbitTemplate = rabbitTemplate;
        this.adapterReceiveFailQueue = adapterReceiveFailQueue;
        this.responseProcessors = responseProcessors;
    }

    /**
     * Обработка пришедшего из СМЭВ ответа
     */
    @Transactional
    public void processReceiveMessage(@NotNull Message message) {
        var body = new String(message.getBody());
        try {
            var messageEntity = replyToClientId(message)
                    .map(messageService::getByClientId)
                    .orElseThrow(() -> new SmevRequestException("not found original message"));
            responseProcessors.stream()
                    .filter(processor -> processor.mnemonicEnum() == messageEntity.mnemonicEnum())
                    .findFirst()
                    .ifPresentOrElse(
                            processor -> process(processor, messageEntity, body),
                            () -> log.warn("consumer not found {}", messageEntity.mnemonicEnum())
                    );
        } catch (Exception e) {
            log.info("Process adapter message fail: " + e.getMessage());
            receiveFail(e, body);
        }
    }


    /**
     * Достаем ИД сообщения, ответом на которое, является это сообщение
     */
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


    private void process(ResponseProcessor responseProcessor, SmevMessageMetaEntity originalMessageRecord, String body) {
        try {
            log.debug("Try to process message {}", body);
            var processResult = responseProcessor.processMessageFromSmev(body);
            messageService.saveIncoming(processResult, originalMessageRecord);
            log.info("Success process");
        } catch (Exception e) {
            throw new SmevRequestException("Message save error :" + e.getMessage());
        }
    }

    /**
     * Сохранить сообщение, в случае ошибки обработки
     */
    private void receiveFail(Exception ex, @NotNull String body) {
        try {
            log.error("Send to 'receive fail' queue: " + body);
            var failResponse = new ResponseFailProcess(
                    ex.getMessage(),
                    new String(base64Encoder.encode(body.getBytes()))
            );

            rabbitTemplate.convertAndSend(adapterReceiveFailQueue.getName(), JsonConverter.asJsonString(failResponse));
        } catch (Exception e) {
            log.error("Fail to send to 'receive fail' queue. {}", e.getMessage());
        }
    }
}
