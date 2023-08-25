package ru.crg.gisogd_service.route;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.TestInstance.Lifecycle.PER_CLASS;
import static ru.crg.gisogd_service.test.route.TestRabbitRoute.TEST_RABBIT_EXCHANGE;
import static ru.crg.gisogd_service.test.route.TestRabbitRoute.TEST_RABBIT_QUEUE;
import static ru.crg.gisogd_service.test.route.TestRabbitRoute.TEST_RABBIT_ROUTE_ID;

import java.util.ArrayList;
import java.util.List;

import org.apache.camel.CamelContext;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import ru.crg.gisogd_service.test.route.dto.TestJson;

@AllArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@ActiveProfiles("rabbitmq")
@CamelSpringBootTest
@TestInstance(PER_CLASS)
@Disabled
class RabbitMqRouteTest {

    private final RabbitTemplate rabbitTemplate;
    private final CamelContext camelContext;
    private final ObjectMapper objectMapper;

    @Container
    static RabbitMQContainer rabbitMQContainer = new RabbitMQContainer("rabbitmq:3-management");

    @BeforeAll
    @SneakyThrows
    void start() {
        List<String> portBindings = new ArrayList<>();
        portBindings.add("5672:5672");
        portBindings.add("15672:15672");
        rabbitMQContainer.setPortBindings(portBindings);
        rabbitMQContainer
                .withQueue(TEST_RABBIT_QUEUE)
                .withExchange(TEST_RABBIT_EXCHANGE, "fanout")
                .withBinding(TEST_RABBIT_EXCHANGE, TEST_RABBIT_QUEUE);
        rabbitMQContainer.start();

        camelContext.getRouteController().startRoute(TEST_RABBIT_ROUTE_ID);
    }

    @AfterAll
    void stop() {
        rabbitMQContainer.stop();
    }

    @Test
    void checkContainerTest() {
        assertNotNull(rabbitMQContainer.getContainerId());
    }

    @Test
    @SneakyThrows
    void serializeAndDeserializeTest() {
        TestJson testJson = new TestJson("f1", "F2");

        String json = objectMapper.writeValueAsString(testJson);
        assertNotNull(json);
        TestJson result = objectMapper.readValue(json, TestJson.class);
        assertNotNull(result);
        assertEquals(testJson.getField1(), result.getField1());
        assertEquals(testJson.getField2(), result.getField2());
    }

    @Test
    @SneakyThrows
    void checkMessageFromQueueTest() {
        TestJson testJson = new TestJson("f1", "f2");
        assertDoesNotThrow(() -> rabbitTemplate.convertAndSend(TEST_RABBIT_EXCHANGE, "", testJson));
    }
}
