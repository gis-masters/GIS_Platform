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
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import ru.mycrg.data_service.accept_rnv_1_0_6.QueryResult;
import ru.mycrg.data_service.entity.reestrs.ReestrIncoming;
import ru.mycrg.data_service.entity.smev.SmevMessageMetaEntity;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.reestrs.ReestrIncomingService;
import ru.mycrg.data_service.service.smev3.model.ResponseFailProcess;
import ru.mycrg.data_service.service.smev3.request.ResponseProcessor;
import ru.mycrg.data_service.service.smev3.request.accept_rnv.AcceptRnvService;
import ru.mycrg.data_service.service.smev3.request.accept_gpzu.AcceptGpzuService;
import ru.mycrg.data_service.service.smev3.request.accept_rns.AcceptRnsService;
import ru.mycrg.data_service.util.JsonConverter;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;
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
    private final AcceptGpzuService acceptGpzuService;
    private final AcceptRnsService acceptRnsService;
    private final AcceptRnvService acceptRnvService;
    private final ReestrIncomingService reestrIncomingService;

    public SmevMessageReceiverService(SmevMessageService messageService,
                                      RabbitTemplate rabbitTemplate,
                                      Queue adapterReceiveFailQueue,
                                      List<ResponseProcessor> responseProcessors,
                                      AcceptGpzuService gpzuService,
                                      AcceptRnsService acceptRnsService,
                                      AcceptRnvService acceptRnvService,
                                      ReestrIncomingService reestrIncomingService) {
        this.messageService = messageService;
        this.rabbitTemplate = rabbitTemplate;
        this.adapterReceiveFailQueue = adapterReceiveFailQueue;
        this.responseProcessors = responseProcessors;
        this.acceptGpzuService = gpzuService;
        this.acceptRnsService = acceptRnsService;
        this.acceptRnvService = acceptRnvService;
        this.reestrIncomingService = reestrIncomingService;
    }

    /**
     * Обработка пришедшего из СМЭВ ответа
     */
    @Transactional
    public void processReceiveMessage(@NotNull Message message) {
        String body = new String(message.getBody());
        try {
            // TODO: Как только отладим логику 3-х этих процессов, переделать на стратегию
            if (body.contains("urn://rostelekom.ru/GPZU/1.0.1")) {
                acceptGpzuService.acceptRequest(body, ru.mycrg.data_service.gpzu_1_0_1.QueryResult.class);

                return;
            }
            if (body.contains("urn://rostelekom.ru/ConstructionPermits/1.0.3")) {
                acceptRnsService.acceptRequest(body, ru.mycrg.data_service.accept_rns_1_0_3.QueryResult.class);

                return;
            }
            if (body.contains("urn://rostelekom.ru/PermissionObjectOperation/1.0.6")) {
                acceptRnvService.acceptRequest(body, QueryResult.class);
                
                return;
            }
            var messageEntity = replyToClientId(message)
                    .map(messageService::getByClientId)
                    .orElseThrow(() -> new SmevRequestException("Не удалось найти исходное сообщение"));
            if (!body.contains("<replyToClientId>") && body.contains("RRTR02_3S")) {
                String closingTag = "</clientId>";
                int closingTabIndex = body.indexOf(closingTag) + closingTag.length();
                String clientId = messageEntity.getClientId().toString();
                String replyToClientId = "<replyToClientId>" + clientId + "</replyToClientId>";
                body = body.substring(0, closingTabIndex) + replyToClientId + body.substring(closingTabIndex);
            }
            String finalBody = body;
            responseProcessors.stream()
                    .filter(processor -> processor.mnemonicEnum() == messageEntity.mnemonicEnum())
                    .findFirst()
                    .ifPresentOrElse(
                            processor -> process(processor, messageEntity, finalBody),
                            () -> log.warn("Обработчик сообщения СМЭВ не найден {}", messageEntity.mnemonicEnum())
                    );
        } catch (Exception e) {
            log.warn("Ошибка при обработке сообщения из СМЭВ: {}", e.getMessage(), e);
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
                        throw new SmevRequestException("Ошибка при парсинге XML " + e.getMessage());
                    }
                })
                .map(document -> {
                    if (document.getElementsByTagName("replyToClientId").getLength() == 0) {
                        addReplyToClientIdToDocument(document);
                        return document.getElementsByTagName("replyToClientId");
                    }
                    return document.getElementsByTagName("replyToClientId");
                })
                .map(nodeList -> nodeList.item(0))
                .map(Node::getFirstChild)
                .map(Node::getNodeValue)
                .map(UUID::fromString);
    }


    private void process(ResponseProcessor responseProcessor, SmevMessageMetaEntity originalMessageRecord, String body) {
        try {
            log.debug("Попытка обработки сообщения {}", body);
            var processResult = responseProcessor.processMessageFromSmev(body);
            messageService.saveIncoming(processResult, originalMessageRecord);
            log.info("Обработка успешно завершена");
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка при обработке сообщения:" + e.getMessage());
        }
    }

    /**
     * Сохранить сообщение, в случае ошибки обработки
     */
    private void receiveFail(Exception ex, @NotNull String body) {
        try {
            log.warn("Попытка отправить сообщение в очередь 'receive fail': {}", body);
            var failResponse = new ResponseFailProcess(
                    ex.getMessage(),
                    ex.toString(),
                    new String(base64Encoder.encode(body.getBytes()))
            );
            rabbitTemplate.convertAndSend(adapterReceiveFailQueue.getName(), JsonConverter.asJsonString(failResponse));
            log.warn("Сообщение успешно отправлено в очередь 'receive fail'");
        } catch (Exception e) {
            log.error("Ошибка при попытке отправить сообщение в очередь receive fail'. {} {}", e.getMessage(), e.toString());
        }
    }

    private void addReplyToClientIdToDocument(Document document){
        NodeList originalMessageIDNodes = document.getElementsByTagName("OriginalMessageID");
        Element originalMessageIDElement = (Element) originalMessageIDNodes.item(0);

        StringWriter writer = new StringWriter();
        try {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            transformer.transform(new DOMSource(originalMessageIDElement), new StreamResult(writer));
        } catch (TransformerException e) {
            throw new SmevRequestException("Ошибка при получении OriginalMessageID из сообщения СМЭВ" + e.getMessage());
        }
        String originalMessageIDWithTags = writer.toString().trim();
        ReestrIncoming reestrIncoming = reestrIncomingService.findByBody(originalMessageIDWithTags);
        String body = reestrIncoming.getBody();
        String startTag = "<replyToClientId>";
        String endTag = "</replyToClientId>";
        int startTagIndex = body.indexOf(startTag);
        int endTagIndex = body.indexOf(endTag);
        String replyToClientId = body.substring(startTagIndex + startTag.length(), endTagIndex);

        NodeList responseMetadataNodes = document.getElementsByTagName("ResponseMetadata");
        Node responseMetadataNode = responseMetadataNodes.item(0);
        Element replyToClientIdElement = document.createElement("replyToClientId");
        replyToClientIdElement.setTextContent(replyToClientId);
        responseMetadataNode.appendChild(replyToClientIdElement);
    }
}
