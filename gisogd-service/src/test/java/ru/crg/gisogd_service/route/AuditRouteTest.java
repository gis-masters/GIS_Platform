package ru.crg.gisogd_service.route;

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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.converter.RfObjectConverter;
import ru.crg.gisogd_service.model.rf.AuditResponse;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.mycrg.gisog_service_contract.AuditGisogdRfEvent;
import ru.mycrg.gisog_service_contract.AuditResponseGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static ru.crg.gisogd_service.route.AuditRoute.*;

@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@CamelSpringBootTest
@MockEndpointsAndSkip("direct:audit-response-to-queue")
@Disabled
class AuditRouteTest {

    private final CamelContext camelContext;

    @EndpointInject("mock:direct:audit-response-to-queue")
    private MockEndpoint mockEndpoint;

    @MockBean
    private GisogdRfClient gisogdRfClient;
    @MockBean
    private final RfObjectConverter rfObjectConverter;
    @MockBean
    private final DocumentTypeResolver documentTypeResolver;

    @Produce("direct:crimea-to-audit-data-transfer")
    private ProducerTemplate producerTemplate;

    private final static Long TEST_ORIG_ID = 1L;
    private final static Document TEST_DOCUMENT = new Document();

    @BeforeEach
    @SneakyThrows
    void start() {
        when(rfObjectConverter.convert(any())).thenReturn(new RfGuid() {
            @Override
            public String getGuid() {
                return "guid";
            }
        });

        when(documentTypeResolver.getEndpointByType(any())).thenReturn("entityType");

        camelContext.getRouteController().startRoute(MAIN_AUDIT_ROUTE_ID);
        camelContext.getRouteController().startRoute(PREPARE_AUDIT_RESPONSE_ROUTE_ID);
        camelContext.getRouteController().startRoute(AUDIT_RESPONSE_TO_QUEUE_ROUTE_ID);
    }

    @Test
    @SneakyThrows
    void sendAuditGisogdRfEventTest() {
        when(gisogdRfClient.getAudit(any(), any())).thenReturn(new AuditResponse());

        AuditGisogdRfEvent event = new AuditGisogdRfEvent(TEST_ORIG_ID, TEST_DOCUMENT);
        producerTemplate.sendBody(event);

        mockEndpoint.assertIsSatisfied();
        mockEndpoint.expectedMessageCount(1);

        AuditResponseGisogdRfEvent response =
                mockEndpoint.getExchanges().get(0).getIn().getBody(AuditResponseGisogdRfEvent.class);
        assertEquals(TEST_ORIG_ID, response.getOrgId());
        assertEquals(TEST_DOCUMENT, response.getParent());
        mockEndpoint.reset();
    }

    @Test
    @SneakyThrows
    void sendAuditGisogdRfEventErrorTest() {
        String exceptionMessage = "test exception";
        when(gisogdRfClient.getAudit(any(), any())).thenThrow(new RuntimeException(exceptionMessage));

        AuditGisogdRfEvent event = new AuditGisogdRfEvent(TEST_ORIG_ID, TEST_DOCUMENT);
        producerTemplate.sendBody(event);

        mockEndpoint.assertIsSatisfied();
        mockEndpoint.expectedMessageCount(1);

        AuditResponseGisogdRfEvent response =
                mockEndpoint.getExchanges().get(0).getIn().getBody(AuditResponseGisogdRfEvent.class);
        assertEquals(TEST_ORIG_ID, response.getOrgId());
        assertEquals(TEST_DOCUMENT, response.getParent());
        assertTrue(response.getContent().get("parent").contains(exceptionMessage));
        mockEndpoint.reset();
    }
}
