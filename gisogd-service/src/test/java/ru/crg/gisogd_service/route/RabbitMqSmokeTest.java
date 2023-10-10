package ru.crg.gisogd_service.route;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.camel.CamelContext;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.junit.jupiter.api.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.model.rf.Customer;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static ru.crg.gisogd_service.route.RfRoute.CONVERT_TO_RF_OBJECT_ROUTE_ID;
import static ru.crg.gisogd_service.route.RfRoute.MAIN_ROUTE_ID;
import static ru.mycrg.messagebus_contract.MessageBusProperties.GISOGD_PUBLICATION_RESPONSE_QUEUE;
import static ru.mycrg.messagebus_contract.MessageBusProperties.GISOGD_PUBLICATION_QUEUE;

@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@ActiveProfiles("rabbitmq")
@CamelSpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Disabled
class RabbitMqSmokeTest {

    private final CamelContext camelContext;
    private final ObjectMapper objectMapper;
    private final DocumentTypeResolver documentTypeResolver;

    private final RabbitTemplate rabbitTemplate;

    @MockBean
    private GisogdRfClient gisogdRfClient;

    @Container
    static RabbitMQContainer rabbitMQContainer = new RabbitMQContainer("rabbitmq:3.10.7-management");

    @BeforeAll
    @SneakyThrows
    void start() {
        List<String> portBindings = new ArrayList<>();
        portBindings.add("5672:5672");
        portBindings.add("15672:15672");
        rabbitMQContainer.setPortBindings(portBindings);
        rabbitMQContainer
                .withQueue(GISOGD_PUBLICATION_RESPONSE_QUEUE)
                .withQueue(GISOGD_PUBLICATION_QUEUE);
        rabbitMQContainer.start();

        doAnswer(invocation -> {
            assertEquals(documentTypeResolver.getEndpointByType(Customer.class), invocation.getArguments()[0]);
            assertTrue(invocation.getArguments()[1] instanceof Customer);
            assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", ((Customer) invocation.getArguments()[1]).getGuid());
            assertEquals("60f6ad72-e09a-44bb-a85e-fa7f2e9e4991",
                         ((Customer) invocation.getArguments()[1]).getOrganization());
            assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6",
                         ((Customer) invocation.getArguments()[1]).getCitizen());
            return null;
        }).when(gisogdRfClient).postData(any(), any());

        doAnswer(invocation -> {
            assertEquals(documentTypeResolver.getEndpointByType(Customer.class), invocation.getArguments()[0]);
            assertTrue(invocation.getArguments()[1] instanceof Customer);
            assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", ((Customer) invocation.getArguments()[1]).getGuid());
            assertEquals("60f6ad72-e09a-44bb-a85e-fa7f2e9e4991",
                         ((Customer) invocation.getArguments()[1]).getOrganization());
            assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6",
                         ((Customer) invocation.getArguments()[1]).getCitizen());
            return null;
        }).when(gisogdRfClient).putData(any(), any());
        camelContext.getRouteController().startRoute(MAIN_ROUTE_ID);
        camelContext.getRouteController().startRoute(CONVERT_TO_RF_OBJECT_ROUTE_ID);
    }

    @AfterAll
    static void stop() {
        rabbitMQContainer.stop();
    }

    @Test
    void checkContainerTest() {
        assertNotNull(rabbitMQContainer.getContainerId());
    }

    @Test
    @SneakyThrows
    void sendMessageTest() {
        Resource eventData = new ClassPathResource("route/eventWithoutPublishedDate.json");
        PublishToGisogdRfEvent event = objectMapper.readValue(eventData.getFile(), PublishToGisogdRfEvent.class);
        assertDoesNotThrow(() -> rabbitTemplate.convertAndSend(event.getExchange(), event.getRoutingKey(), event));
    }
}
