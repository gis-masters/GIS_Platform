package ru.crg.gisogd_service.route;

import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.apache.camel.Exchange;
import org.apache.camel.LoggingLevel;
import org.apache.camel.Message;
import org.apache.camel.builder.RouteBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import feign.FeignException;
import feign.RetryableException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.converter.RfObjectConverter;
import ru.crg.gisogd_service.service.AggregateService;
import ru.crg.gisogd_service.service.BadRequestErrorsResolver;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.ResponseFromGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Status;

/**
 * Configure and adds routes from route templates.
 *
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
    private static final String EXCEPTION_LOG_MESSAGE =
            "error sending an object: ${body} to GISOG cause: ${exception.message} ";

    private static final Map<Class<? extends Throwable>, Status> ERRORS_RESPONSE_STATUS =
            Map.of(
                    FeignException.InternalServerError.class, Status.INTERNAL_SERVER_ERROR
                    , FeignException.BadRequest.class, Status.BAD_REQUEST
                    , RetryableException.class, Status.SERVICE_UNAVAILABLE
            );

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
                            ? getFeignExceptionMessage((FeignException) exception)
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
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "publish date: ${header.publishDate}")
                .setHeader("document", simple("${body.parent}"))
                .setHeader(EVENT, simple("${body}"))

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
                .setHeader(STATUS, constant(Status.SUCCESS));

        from("direct:prepare-response")
                .routeId(PREPARE_RESPONSE_ROUTE_ID)
                .setBody(
                        exchange -> {
                            Message in = exchange.getIn();
                            Map<String, String> content = new HashMap<>();
                            String message = (String) in.getHeader(MESSAGE);
                            Status status = (Status) in.getHeader(STATUS);
                            content = errorsResolver.badRequestErrorsResolve(message);

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
                .log(LoggingLevel.INFO, log, MAIN_ROUTE_ID, "response to queue: ${body}");
    }

    private String getFeignExceptionMessage(FeignException feignException) {
        return feignException.responseBody()
                             .map(ByteBuffer::array)
                             .map(String::new)
                             .orElse(null);
    }
}
