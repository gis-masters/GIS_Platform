package ru.crg.gisogd_service.route;

import java.util.Map;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import feign.FeignException;
import feign.RetryableException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.converter.RfObjectConverter;
import ru.crg.gisogd_service.exception.AggregateObjectException;
import ru.crg.gisogd_service.exception.DocumentTypeResolveException;
import ru.crg.gisogd_service.service.AggregateService;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.ResponseFromGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Status;

/**
 * Configure and adds routes from route templates.
 * @author Sergey Valiev
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class Routes extends RouteBuilder {

    public static final String MAIN_ROUTE_ID = "crimea-to-rf-data-transfer-route";
    public static final String CONVERT_TO_RF_OBJECT_ROUTE_ID = "convert-to-rf-object-route";
    public static final String RESPONSE_TO_QUEUE_ROUTE = "response-to-queue-route";
    public static final String PREPARE_RESPONSE_ROUTE = "prepare-response-route";
    private static final String STATUS = "status";
    private static final String MESSAGE = "message";
    private static final String EXCEPTION_LOG_MESSAGE = "error sending an object:${body} to GISOG cause: ${exception.message} ";


    private final GisogdRfClient gisogdRfClient;
    private final RfObjectConverter rfObjectConverter;
    private final AggregateService enrichService;
    private final DocumentTypeResolver documentTypeResolver;

    @Value("${spring.rabbitmq.exchanges.exchange-receive-data.name}")
    private String exchangeName;
    @Value("${spring.rabbitmq.queues.queue-receive-data.name}")
    private String queueName;
    @Value("${spring.rabbitmq.exchanges.exchange-send-data.name}")
    private String responseExchangeName;
    @Value("${spring.rabbitmq.queues.queue-send-data.name}")
    private String responseQueueName;

    @Override
    public void configure() {
        JacksonDataFormat jsonDataFormat = new JacksonDataFormat(ResponseFromGisogdRfEvent.class);

        onException(FeignException.InternalServerError.class)
                .handled(true)
                .log(LoggingLevel.ERROR, EXCEPTION_LOG_MESSAGE)
                .setHeader(STATUS, constant(Status.INTERNAL_SERVER_ERROR))
                .setHeader(MESSAGE, simple("${exception.message}"))
                .to("direct:prepare-response")
                .to("direct:responseToQueue");

        onException(RetryableException.class)
                .handled(true)
                .log(LoggingLevel.ERROR, EXCEPTION_LOG_MESSAGE)
                .setHeader(STATUS, constant(Status.SERVICE_UNAVAILABLE))
                .setHeader(MESSAGE, simple("${exception.message}"))
                .to("direct:prepare-response")
                .to("direct:responseToQueue");

        onException(FeignException.BadRequest.class)
                .handled(true)
                .log(LoggingLevel.ERROR, EXCEPTION_LOG_MESSAGE)
                .setHeader(STATUS, constant(Status.BAD_REQUEST))
                .setHeader(MESSAGE, simple("${exception.message}"))
                .to("direct:prepare-response")
                .to("direct:responseToQueue");

        onException(Exception.class)
                .handled(true)
                .log(LoggingLevel.ERROR, EXCEPTION_LOG_MESSAGE)
                .setHeader(STATUS, constant(Status.GISOGD_FAILED))
                .setHeader(MESSAGE, simple("${exception.message}"))
                .to("direct:prepare-response")
                .to("direct:responseToQueue");

        from("direct:convert-to-rf-object")
                .routeId(CONVERT_TO_RF_OBJECT_ROUTE_ID)
                .bean(rfObjectConverter)
                .log(LoggingLevel.INFO, log, CONVERT_TO_RF_OBJECT_ROUTE_ID, "converted RF object: ${body}");

        from("spring-rabbitmq:" + exchangeName + "?queues=" + queueName + "&exchangeType=fanout")
                .to("direct:crimea-to-rf-data-transfer");

        from("direct:crimea-to-rf-data-transfer")
                .routeId(MAIN_ROUTE_ID)
                .convertBodyTo(PublishToGisogdRfEvent.class)
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "event: ${body}")
                .setHeader("publishDate", simple("${body.parent.content[gisogdrf_publication_datetime]}"))
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "publish date: ${header.publishDate}")
                .setHeader("document", simple("${body.parent}"))
                .setHeader("event", simple("${body}"))

                .setBody(exchange -> exchange.getIn().getHeader("document"))
                .to("direct:convert-to-rf-object")
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "document: ${body}")

                .bean(enrichService)
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "enriched document: ${body}")

                .setBody(exchange -> {
                    Object body = exchange.getIn().getBody();
                    exchange.getIn().setHeader("endpoint", documentTypeResolver.getEndpointByType(body.getClass()));
                    return body;
                })
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "detected endpoint: ${header.endpoint}")
                .choice()
                /**/.when(simple("${header.publishDate} == null"))
                /**//**/.bean(gisogdRfClient, "postData")
                /**/.otherwise()
                /**//**/.bean(gisogdRfClient, "putData")
                .end()
                .setHeader(STATUS, constant(Status.SUCCESS))
                .to("direct:prepare-response")
                .to("direct:responseToQueue");

        from("direct:prepare-response")
                .routeId(PREPARE_RESPONSE_ROUTE)
                .setBody(
                        exchange -> {
                            PublishToGisogdRfEvent event = (PublishToGisogdRfEvent) exchange.getIn().getHeader("event");
                            ResponseFromGisogdRfEvent response = new ResponseFromGisogdRfEvent();
                            response.setTaskId(event.getTaskId());
                            response.setParent(event.getParent());
                            response.setStatus((Status) exchange.getIn().getHeader(STATUS));
                            String message = (String) exchange.getIn().getHeader(MESSAGE);
                            if (message != null) {
                                response.setContent(Map.of(MESSAGE, message));
                            }

                            return response;
                        }
                );

        from("direct:responseToQueue")
                .routeId(RESPONSE_TO_QUEUE_ROUTE)
                .marshal(jsonDataFormat)
                .to("spring-rabbitmq:default?routingKey=" + responseQueueName)
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "response to queue: ${body}");
    }
}
