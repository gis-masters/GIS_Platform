package ru.crg.gisogd_service.test.route;

import lombok.AllArgsConstructor;
import org.apache.camel.builder.RouteBuilder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class TestRabbitRoute extends RouteBuilder {
    public static final String TEST_RABBIT_ROUTE_ID = "test-rabbit-route";
    public static final String TEST_RABBIT_EXCHANGE = "test-exchange";
    public static final String TEST_RABBIT_QUEUE = "test-queue";

    @Override
    public void configure() {
        from("spring-rabbitmq:" + TEST_RABBIT_EXCHANGE + "?queues=" + TEST_RABBIT_QUEUE + "&exchangeType=fanout")
                .routeId(TEST_RABBIT_ROUTE_ID)
                .bean("testTargetBean", "checkObject");
    }
}
