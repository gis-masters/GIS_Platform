package ru.crg.gisogd_service.route;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import feign.Request;
import feign.RequestTemplate;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.camel.CamelContext;
import org.apache.camel.EndpointInject;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.apache.camel.test.spring.junit5.MockEndpointsAndSkip;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.model.rf.Customer;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.ResponseFromGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Status;

import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static ru.crg.gisogd_service.route.RfRoute.*;

@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@CamelSpringBootTest
@MockEndpointsAndSkip("direct:responseToQueue")
@Disabled
class CrimeaToRfDataTransferRouteTest {

    private final CamelContext camelContext;
    private final ObjectMapper objectMapper;
    private final DocumentTypeResolver documentTypeResolver;

    @EndpointInject("mock:direct:responseToQueue")
    private MockEndpoint mockEndpoint;

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
            assertEquals("60f6ad72-e09a-44bb-a85e-fa7f2e9e4991",
                         ((Customer) invocation.getArguments()[1]).getOrganization());
            assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6",
                         ((Customer) invocation.getArguments()[1]).getCitizen());
            return invocation.getArguments()[1];
        }).when(gisogdRfClient).postData(any(), any());

        doAnswer(invocation -> {
            assertEquals(documentTypeResolver.getEndpointByType(Customer.class), invocation.getArguments()[0]);
            assertTrue(invocation.getArguments()[1] instanceof Customer);
            assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", ((Customer) invocation.getArguments()[1]).getGuid());
            assertEquals("60f6ad72-e09a-44bb-a85e-fa7f2e9e4991",
                         ((Customer) invocation.getArguments()[1]).getOrganization());
            assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6",
                         ((Customer) invocation.getArguments()[1]).getCitizen());
            return invocation.getArguments()[1];
        }).when(gisogdRfClient).putData(any(), any());
        camelContext.getRouteController().startRoute(MAIN_ROUTE_ID);
        camelContext.getRouteController().startRoute(CONVERT_TO_RF_OBJECT_ROUTE_ID);
        camelContext.getRouteController().startRoute(PREPARE_RESPONSE_ROUTE_ID);
        camelContext.getRouteController().startRoute(RESPONSE_TO_QUEUE_ROUTE_ID);
    }

    @Test
    @SneakyThrows
    void eventWithoutPublishedDateTest() {

        PublishToGisogdRfEvent event =
                objectMapper.readValue(eventWithoutPublishedDateFile.getFile(), PublishToGisogdRfEvent.class);
        producerTemplate.sendBody(event);

        mockEndpoint.assertIsSatisfied();
        mockEndpoint.expectedMessageCount(1);

        ResponseFromGisogdRfEvent response =
                (ResponseFromGisogdRfEvent) mockEndpoint.getExchanges().get(0).getIn().getBody();
        assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", response.getParent().getContent().get("guid"));
        assertEquals(Status.SUCCESS, response.getStatus());
        mockEndpoint.reset();
    }

    @Test
    @SneakyThrows
    void eventWithPublishedDateTest() {
        PublishToGisogdRfEvent event =
                objectMapper.readValue(eventWithPublishedDateFile.getFile(), PublishToGisogdRfEvent.class);
        assertDoesNotThrow(() -> producerTemplate.sendBody(event));

        mockEndpoint.assertIsSatisfied();
        mockEndpoint.expectedMessageCount(1);

        ResponseFromGisogdRfEvent response =
                (ResponseFromGisogdRfEvent) mockEndpoint.getExchanges().get(0).getIn().getBody();
        assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", response.getParent().getContent().get("guid"));
        assertEquals(Status.SUCCESS, response.getStatus());
        mockEndpoint.reset();
    }

    @Test
    @SneakyThrows
    void errorBadRequestFromGisogdTest() {
        Request request = Request.create(Request.HttpMethod.POST, "url",
                                         new HashMap<>(), null, new RequestTemplate());
        doThrow(new FeignException.BadRequest("BAD REQUEST", request, null, null))
                .when(gisogdRfClient).postData(any(), any());

        Resource resourceFile = new ClassPathResource("event/dataSection1Event.json");
        PublishToGisogdRfEvent event = objectMapper.readValue(resourceFile.getFile(), PublishToGisogdRfEvent.class);
        producerTemplate.sendBody(event);

        mockEndpoint.assertIsSatisfied();
        mockEndpoint.expectedMessageCount(1);

        ResponseFromGisogdRfEvent response =
                (ResponseFromGisogdRfEvent) mockEndpoint.getExchanges().get(0).getIn().getBody();
        assertEquals("9d1b2f14-1eaf-4350-af7f-4aa29922fee9", response.getParent().getContent().get("guid"));
        assertEquals(Status.BAD_REQUEST, response.getStatus());
        assertEquals("BAD REQUEST", response.getContent().get("message"));

        mockEndpoint.reset();
    }
}
