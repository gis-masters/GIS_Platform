package ru.mycrg.gis_service.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.support.CorrelationData;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.gis_service.service.geoserver.SpatialReferenceSystemService;

import java.util.Optional;

import static ru.mycrg.http_client.JsonConverter.fromBytes;
import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

@Service
public class RpcConsumer {

    private static final Logger log = LoggerFactory.getLogger(RpcConsumer.class);

    private final SpatialReferenceSystemService srsService;
    private final RabbitTemplate rabbitTemplate;

    public RpcConsumer(SpatialReferenceSystemService srsService,
                       RabbitTemplate rabbitTemplate) {
        this.srsService = srsService;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = RPC_REQUEST_QUEUE)
    public void consume(Message msg) {
        MessageProperties messageProperties = msg.getMessageProperties();
        String correlationId = messageProperties.getCorrelationId();

        String token = messageProperties.getHeaders().get("token").toString();
        if (token == null) {
            fail(correlationId, "Отсутствует токен");

            return;
        }

        Optional<SpatialReferenceSystem> srs = fromBytes(msg.getBody(), SpatialReferenceSystem.class);
        if (srs.isEmpty()) {
            fail(correlationId,
                 "Передано не корректное тело. Ожидается: " + SpatialReferenceSystem.class.getSimpleName());

            return;
        }

        // Проверяем тип операции
        String operation = messageProperties.getHeaders().get("operation") != null
                ? messageProperties.getHeaders().get("operation").toString()
                : "ADD";

        try {
            if ("DELETE".equals(operation)) {
                Object reloadHeader = messageProperties.getHeaders().get("isNeedToReloadGeoserver");
                boolean isNeedToReload = reloadHeader instanceof Boolean ? (Boolean) reloadHeader : true;
                srsService.deleteAndReload(srs.get(), token, isNeedToReload);
            } else {
                srsService.addAndReload(srs.get(), token);
            }

            success(correlationId);
        } catch (Exception e) {
            String errorMsg = "DELETE".equals(operation)
                    ? "Не удалось удалить проекцию с геосервера => " + e.getMessage()
                    : "Не удалось добавить проекцию на геосервер => " + e.getMessage();
            fail(correlationId, errorMsg);
        }
    }

    private void fail(String correlationId, String reason) {
        log.error("Не удалось добавить проекцию на геосервер => {}", reason);

        rabbitTemplate.sendAndReceive(RPC_TOPIC_EXCHANGE,
                                      RPC_REPLY_QUEUE,
                                      MessageBuilder.withBody("FAILED".getBytes())
                                                    .setContentType("application/json")
                                                    .build(),
                                      new CorrelationData(correlationId));
    }

    private void success(String correlationId) {
        rabbitTemplate.sendAndReceive(RPC_TOPIC_EXCHANGE,
                                      RPC_REPLY_QUEUE,
                                      MessageBuilder.withBody("SUCCESS".getBytes())
                                                    .setContentType("application/json")
                                                    .build(),
                                      new CorrelationData(correlationId));
    }
}
