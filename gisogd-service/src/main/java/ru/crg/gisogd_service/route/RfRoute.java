package ru.crg.gisogd_service.route;

import feign.FeignException;
import feign.RetryableException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.camel.Exchange;
import org.apache.camel.LoggingLevel;
import org.apache.camel.Message;
import org.apache.camel.builder.RouteBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.converter.RfObjectConverter;
import ru.crg.gisogd_service.service.AggregateService;
import ru.crg.gisogd_service.service.BadRequestErrorsResolver;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.ResponseFromGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.gisog_service_contract.dto.Status;

import java.util.Map;
import java.util.Optional;

/**
 * Configure and adds routes from route templates.
 * @author Sergey Valiev
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RfRoute extends RouteBuilder {

    public static final String MAIN_ROUTE_ID = "crimea-to-rf-data-transfer-route";
    public static final String CONVERT_TO_RF_OBJECT_ROUTE_ID = "convert-to-rf-object-route";
    public static final String RESPONSE_TO_QUEUE_ROUTE_ID = "response-to-queue-route";
    public static final String PREPARE_RESPONSE_ROUTE_ID = "prepare-response-route";
    public static final String EVENT = "event";
    private static final String STATUS = "status";
    private static final String MESSAGE = "message";

    public static final Map<Class<? extends Throwable>, Status> ERRORS_RESPONSE_STATUS =
            Map.of(
                    FeignException.InternalServerError.class, Status.INTERNAL_SERVER_ERROR
                    , FeignException.BadRequest.class, Status.BAD_REQUEST
                    , RetryableException.class, Status.SERVICE_UNAVAILABLE
            );
    private static final String DOCUMENT = "document";

    private final GisogdRfClient gisogdRfClient;
    private final RfObjectConverter rfObjectConverter;
    private final AggregateService enrichService;
    private final DocumentTypeResolver documentTypeResolver;
    private final BadRequestErrorsResolver errorsResolver;

    @Value("${spring.rabbitmq.exchanges.exchange-receive-data.name}")
    private String exchangeName;
    @Value("${spring.rabbitmq.queues.queue-receive-data.name}")
    private String queueName;
    @Value("${spring.rabbitmq.queues.queue-send-data.name}")
    private String responseQueueName;

    @Override
    public void configure() {

        //кол-во и задержка м/у попытками отправить при ошибках соединения
        onException(RetryableException.class)
                .redeliveryDelay(500)
                .maximumRedeliveries(3)
                .useExponentialBackOff()
                .backOffMultiplier(3);
        //кол-во и задержка м/у попытками отправить при т.н. "мигающих" ошибках
        onException(FeignException.BadGateway.class,
                    FeignException.ServiceUnavailable.class,
                    FeignException.GatewayTimeout.class)
                .redeliveryDelay(500)
                .maximumRedeliveries(3)
                .useExponentialBackOff()
                .backOffMultiplier(3);

        from("direct:convert-to-rf-object")
                .routeId(CONVERT_TO_RF_OBJECT_ROUTE_ID)
                .bean(rfObjectConverter)
                .log(LoggingLevel.INFO, log, CONVERT_TO_RF_OBJECT_ROUTE_ID, "converted RF object: ${body}");

        from("spring-rabbitmq:" + exchangeName + "?queues=" + queueName + "&exchangeType=fanout")
                .doTry()
                /**/.to("direct:crimea-to-rf-data-transfer")
                .doCatch(Exception.class)
                /**/.process(exchange -> {
                    Throwable exception = exchange.getProperty(Exchange.EXCEPTION_CAUGHT, Throwable.class);
                    Status status = Optional.ofNullable(ERRORS_RESPONSE_STATUS.get(exception.getClass()))
                                            .orElse(Status.GISOGD_FAILED);
                    exchange.getIn().setHeader(STATUS, status);
                    exchange.getIn().setHeader(MESSAGE, Status.BAD_REQUEST.equals(status)
                            ? errorsResolver.getFeignExceptionMessage((FeignException) exception)
                            : exception.getMessage());
                })
                .doFinally()
                /**/.to("direct:prepare-response")
                /**/.to("direct:responseToQueue")
                .end();

        from("direct:crimea-to-rf-data-transfer")
                .routeId(MAIN_ROUTE_ID)
                .convertBodyTo(PublishToGisogdRfEvent.class)
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "event: ${body}")
                .setHeader("publishDate", simple("${body.parent.content[gisogdrf_publication_datetime]}"))
                .setHeader("isDeleted", simple("${body.parent.content[is_deleted]}"))
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "publish date: ${header.publishDate}")
                .setHeader(DOCUMENT, simple("${body.parent}"))
                .setHeader(EVENT, simple("${body}"))

                .setBody(exchange -> exchange.getIn().getHeader(DOCUMENT))
                .to("direct:convert-to-rf-object")
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "document: ${body}")
                .setBody(exchange -> {
                    Object body = exchange.getIn().getBody();
                    exchange.getIn().setHeader("endpoint", documentTypeResolver.getEndpointByType(body.getClass()));
                    return body;
                })
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "detected endpoint: ${header.endpoint}")
                .choice()
                /**/.when(header("isDeleted").isEqualTo(true))
                /**//**/.to("direct:delete-endpoint")
                /**/.otherwise()
                /**//**/.to("direct:send-data-endpoint")
                .end()
                .setHeader(STATUS, constant(Status.SUCCESS))
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "${header.status}");

        from("direct:send-data-endpoint")
                .bean(enrichService)
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "enriched document: ${body}")
                .choice()
                /**/.when(simple("${header.publishDate} == null"))
                /**//**/.bean(gisogdRfClient, "postData")
                /**/.otherwise()
                /**//**/.bean(gisogdRfClient, "putData")
                .end();

        from("direct:delete-endpoint")
                .setBody(simple("${body.getGuid()}"))
                .bean(gisogdRfClient, "deleteData")
                .log(LoggingLevel.INFO, "Send 'Delete' action for object ${header.endpoint} with guid ${body}");

        from("direct:prepare-response")
                .routeId(PREPARE_RESPONSE_ROUTE_ID)
                .setBody(
                        exchange -> {
                            Message in = exchange.getIn();
                            String message = (String) in.getHeader(MESSAGE);
                            Status status = (Status) in.getHeader(STATUS);
                            Document document = in.getHeader(DOCUMENT, Document.class);
                            Map<String, String> content = errorsResolver.badRequestErrorsResolve(message, document);

                            return new ResponseFromGisogdRfEvent((PublishToGisogdRfEvent) in.getHeader(EVENT),
                                                                 status,
                                                                 content);
                        }
                );

        from("direct:responseToQueue")
                .routeId(RESPONSE_TO_QUEUE_ROUTE_ID)
                .removeHeaders("*")
                .setHeader("__TypeId__", simple("${body.getClass().getName()}"))
                .marshal().json()
                .to("spring-rabbitmq:default?messagePropertiesConverter=#bean:propertiesConverter&routingKey="
                            + responseQueueName)
                .log(LoggingLevel.INFO, log, RESPONSE_TO_QUEUE_ROUTE_ID, "response to queue: ${body}");
    }

}
