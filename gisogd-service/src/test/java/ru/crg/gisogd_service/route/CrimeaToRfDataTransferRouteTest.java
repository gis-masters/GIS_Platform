package ru.crg.gisogd_service.route;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static ru.crg.gisogd_service.route.Routes.CONVERT_TO_RF_OBJECT_ROUTE_ID;
import static ru.crg.gisogd_service.route.Routes.MAIN_ROUTE_ID;
import static ru.crg.gisogd_service.route.Routes.PREPARE_RESPONSE_ROUTE;
import static ru.crg.gisogd_service.route.Routes.RESPONSE_TO_QUEUE_ROUTE;

import org.apache.camel.CamelContext;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.model.rf.Customer;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@CamelSpringBootTest
class CrimeaToRfDataTransferRouteTest {

    private final CamelContext camelContext;
    private final ObjectMapper objectMapper;
    private final DocumentTypeResolver documentTypeResolver;

    @MockBean
    private GisogdRfClient gisogdRfClient;

    @Produce("direct:crimea-to-rf-data-transfer")
    private ProducerTemplate producerTemplate;

    @Value("classpath:route/eventWithoutPublishedDate.json")
    private Resource eventWithoutPublishedDateFile;
    @Value("classpath:route/eventWithPublishedDate.json")
    private Resource eventWithPublishedDateFile;

    @BeforeEach
    @SneakyThrows
    void start() {
        doAnswer(invocation -> {
            assertEquals(documentTypeResolver.getEndpointByType(Customer.class), invocation.getArguments()[0]);
            assertTrue(invocation.getArguments()[1] instanceof Customer);
            assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", ((Customer) invocation.getArguments()[1]).getGuid());
            assertEquals("60f6ad72-e09a-44bb-a85e-fa7f2e9e4991", ((Customer) invocation.getArguments()[1]).getOrganization());
            assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6", ((Customer) invocation.getArguments()[1]).getCitizen());
            return invocation.getArguments()[1];
        }).when(gisogdRfClient).postData(any(), any());

        doAnswer(invocation -> {
            assertEquals(documentTypeResolver.getEndpointByType(Customer.class), invocation.getArguments()[0]);
            assertTrue(invocation.getArguments()[1] instanceof Customer);
            assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", ((Customer) invocation.getArguments()[1]).getGuid());
            assertEquals("60f6ad72-e09a-44bb-a85e-fa7f2e9e4991", ((Customer) invocation.getArguments()[1]).getOrganization());
            assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6", ((Customer) invocation.getArguments()[1]).getCitizen());
            return invocation.getArguments()[1];
        }).when(gisogdRfClient).putData(any(), any());
        camelContext.getRouteController().startRoute(MAIN_ROUTE_ID);
        camelContext.getRouteController().startRoute(CONVERT_TO_RF_OBJECT_ROUTE_ID);
        camelContext.getRouteController().startRoute(PREPARE_RESPONSE_ROUTE);
        camelContext.getRouteController().startRoute(RESPONSE_TO_QUEUE_ROUTE);
    }

    @Test
    @SneakyThrows
    void eventWithoutPublishedDateTest() {

        PublishToGisogdRfEvent event = objectMapper.readValue(eventWithoutPublishedDateFile.getFile(), PublishToGisogdRfEvent.class);
        assertDoesNotThrow(() -> producerTemplate.sendBody(event));
    }

    @Test
    @SneakyThrows
    void eventWithPublishedDateTest() {
        PublishToGisogdRfEvent event = objectMapper.readValue(eventWithPublishedDateFile.getFile(), PublishToGisogdRfEvent.class);
        assertDoesNotThrow(() -> producerTemplate.sendBody(event));
    }
}
