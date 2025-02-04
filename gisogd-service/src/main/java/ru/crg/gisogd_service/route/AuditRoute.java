package ru.crg.gisogd_service.route;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.converter.RfObjectConverter;
import ru.crg.gisogd_service.model.rf.AuditResponse;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.AuditGisogdRfEvent;
import ru.mycrg.gisog_service_contract.AuditResponseGisogdRfEvent;

import java.util.Map;

/**
 * Audit processing route.
 * @author Sergey Valiev
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditRoute extends RouteBuilder {

    public static final String MAIN_AUDIT_ROUTE_ID = "crimea-to-audit-data-transfer-route";
    public static final String AUDIT_RESPONSE_TO_QUEUE_ROUTE_ID = "audit-response-to-queue-route";
    public static final String PREPARE_AUDIT_RESPONSE_ROUTE_ID = "prepare-audit-response-route";

    public static final String HEADER_EVENT = "event";
    public static final String HEADER_DOCUMENT = "document";
    public static final String HEADER_ENTITY_TYPE = "entityType";
    public static final String HEADER_GUID = "guid";
    public static final String HEADER_EXCEPTION = "exception";

    private final ObjectMapper objectMapper;
    private final RfObjectConverter rfObjectConverter;
    private final DocumentTypeResolver documentTypeResolver;
    private final GisogdRfClient gisogdRfClient;

    @Value("${spring.rabbitmq.exchanges.exchange-receive-audit-data.name}")
    private String exchangeName;
    @Value("${spring.rabbitmq.queues.queue-receive-audit-data.name}")
    private String queueName;
    @Value("${spring.rabbitmq.queues.queue-send-audit-response-data.name}")
    private String responseQueueName;

    @Override
    public void configure() {
        from("spring-rabbitmq:" + exchangeName + "?queues=" + queueName + "&exchangeType=fanout")
                .to("direct:crimea-to-audit-data-transfer");

        from("direct:crimea-to-audit-data-transfer")
                .routeId(MAIN_AUDIT_ROUTE_ID)
                .convertBodyTo(AuditGisogdRfEvent.class)
                .log(LoggingLevel.INFO, log, MAIN_AUDIT_ROUTE_ID, "audit event: ${body}")
                .setHeader(HEADER_DOCUMENT, simple("${body.parent}"))
                .setHeader(HEADER_EVENT, simple("${body}"))
                .setBody(exchange -> exchange.getIn().getHeader(HEADER_DOCUMENT))

                .bean(rfObjectConverter)
                .log(LoggingLevel.INFO, log, MAIN_AUDIT_ROUTE_ID, "converted audit object: ${body}")

                .process(exchange -> {
                    RfGuid body = exchange.getIn().getBody(RfGuid.class);
                    exchange.getIn().setHeader(
                            HEADER_ENTITY_TYPE, documentTypeResolver.getEndpointByType(body.getClass())
                    );
                    exchange.getIn().setHeader(HEADER_GUID, body.getGuid());
                })
                .log(LoggingLevel.INFO, log, MAIN_AUDIT_ROUTE_ID, "detected entity type: ${header.entityType}")
                .log(LoggingLevel.INFO, log, MAIN_AUDIT_ROUTE_ID, "detected GUID: ${header.guid}")

                .doTry()
                /**/.bean(gisogdRfClient, "getAudit")
                /**/.setHeader(HEADER_EXCEPTION, simple("Unknown situation"))
                .doCatch(Exception.class)
                /**/.setHeader(HEADER_EXCEPTION, simple("${exception.message}\nstacktrace: ${exception.stacktrace}"))
                /**/.log(LoggingLevel.ERROR, log, MAIN_AUDIT_ROUTE_ID,
                         "message: ${exception.message}\nstacktrace: ${exception.stacktrace}")
                .doFinally()
                /**/.to("direct:prepare-audit-response")
                /**/.to("direct:audit-response-to-queue")
                .end();

        from("direct:prepare-audit-response")
                .routeId(PREPARE_AUDIT_RESPONSE_ROUTE_ID)
                .setBody(exchange -> {
                    Object bodyAsObj = exchange.getIn().getBody();
                    Map<String, String> content = bodyAsObj instanceof AuditResponse
                            ? objectMapper.convertValue(bodyAsObj, new TypeReference<>() {})
                            : Map.of("parent", exchange.getIn().getHeader(HEADER_EXCEPTION, String.class));

                    return new AuditResponseGisogdRfEvent(
                            exchange.getIn().getHeader(HEADER_EVENT, AuditGisogdRfEvent.class),
                            content);
                });

        from("direct:audit-response-to-queue")
                .routeId(AUDIT_RESPONSE_TO_QUEUE_ROUTE_ID)
                .removeHeaders("*")
                .setHeader("__TypeId__", simple("${body.getClass().getName()}"))
                .marshal().json()
                .to("spring-rabbitmq:default?messagePropertiesConverter=#bean:propertiesConverter&routingKey="
                            + responseQueueName)
                .log(LoggingLevel.INFO, log, AUDIT_RESPONSE_TO_QUEUE_ROUTE_ID, "audit response to queue: ${body}");
    }
}
