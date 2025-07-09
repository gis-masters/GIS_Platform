package ru.crg.gisogd_service.route;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.camel.CamelContext;
import org.apache.camel.EndpointInject;
import org.apache.camel.Exchange;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ru.crg.gisogd_service.test.route.dto.ComplexValueObj;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.crg.gisogd_service.test.route.TestRoute.TEST_COMPLEX_VALUE_ROUTE_ID;
import static ru.crg.gisogd_service.test.route.TestRoute.TEST_COMPLEX_VALUE_SUB_ROUTE_ID;

@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest
@ActiveProfiles("test-base")
@CamelSpringBootTest
class ComplexValueRouteTest {
    private final CamelContext camelContext;
    private final ProducerTemplate producerTemplate;

    @EndpointInject("mock:result")
    private MockEndpoint mockEndpoint;

    @BeforeEach
    @SneakyThrows
    void start() {
        camelContext.start();
        camelContext.getRouteController().startRoute(TEST_COMPLEX_VALUE_ROUTE_ID);
        camelContext.getRouteController().startRoute(TEST_COMPLEX_VALUE_SUB_ROUTE_ID);
    }

    @Test
    @SneakyThrows
    void routeTest() {
        List<String> list = new ArrayList<>();
        list.add("value1");
        list.add("value2");
        list.add("value3");

        ComplexValueObj complexValueObj = new ComplexValueObj().toBuilder()
                .value("test")
                .values(list)
                .build();

        mockEndpoint.expectedMessageCount(1);
        producerTemplate.sendBody("direct:complexValue", complexValueObj);
        mockEndpoint.assertIsSatisfied();

        Exchange result = mockEndpoint.getExchanges().get(0);
        assertNotNull(result);
        assertTrue(result.getIn().getBody() instanceof ComplexValueObj);
        assertNotNull(result.getIn().getHeader("complexValue"));
        List<String> complexValue = (List<String>) result.getIn().getHeader("complexValue");
        assertEquals(list.size(), complexValue.size());

        mockEndpoint.reset();
    }

    @Test
    @SneakyThrows
    void routeTestWithAbsentList() {
        ComplexValueObj complexValueObj = new ComplexValueObj().toBuilder()
                .value("test")
                .build();

        mockEndpoint.expectedMessageCount(1);
        producerTemplate.sendBody("direct:complexValue", complexValueObj);
        mockEndpoint.assertIsSatisfied();

        Exchange result = mockEndpoint.getExchanges().get(0);
        assertNotNull(result);
        assertTrue(result.getIn().getBody() instanceof ComplexValueObj);
        assertNotNull(result.getIn().getHeader("complexValue"));
        List<String> complexValue = (List<String>) result.getIn().getHeader("complexValue");
        assertTrue(complexValue.size() == 0);

        mockEndpoint.reset();
    }
}
