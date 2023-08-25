package ru.crg.gisogd_service.route;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.camel.CamelContext;
import org.apache.camel.ExchangePattern;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import ru.crg.gisogd_service.model.rf.InboxData;
import ru.crg.gisogd_service.test.route.dto.TestObj1;
import ru.crg.gisogd_service.test.route.dto.TestObj2;
import ru.crg.gisogd_service.test.route.dto.TestUuidObject;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.TestInstance.Lifecycle.PER_CLASS;
import static ru.crg.gisogd_service.test.route.TestRoute.TEST_ENRICHED_ROUTE_ID;
import static ru.crg.gisogd_service.test.route.TestRoute.TEST_ROUTE_ID;

@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@CamelSpringBootTest
@EnableAutoConfiguration
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@TestInstance(PER_CLASS)
@Disabled
class ConverterRouteTest {
    private final CamelContext camelContext;
    private final ProducerTemplate producerTemplate;

    @BeforeAll
    @SneakyThrows
    void startRoutes() {
        camelContext.getRouteController().startRoute(TEST_ROUTE_ID);
    }

    @Test
    @SneakyThrows
    void routeConverterTest() {
        assertNotNull(producerTemplate);

        Object result = producerTemplate.sendBody(
                "direct:testObj1",
                ExchangePattern.InOut,
                new TestObj1().toBuilder().field1("f1").field2("f2").build()
        );
        assertNotNull(result);
        assertEquals(TestObj2.class, result.getClass());

        TestObj2 testObj2 = (TestObj2) result;
        assertEquals("f1", testObj2.getConvertedField1());
        assertEquals("f2", testObj2.getConvertedField2());
    }

    @Test
    @SneakyThrows
    void routeConverterAndEnrichTest() {
        Object result = producerTemplate.sendBody(
                "direct:testObj1",
                ExchangePattern.InOut,
                new TestObj1().toBuilder().field1("f1").field2("f2").enrichObj(true).build()
        );
        assertNotNull(result);
        assertEquals(TestObj2.class, result.getClass());

        TestObj2 testObj2 = (TestObj2) result;
        assertEquals("f1", testObj2.getConvertedField1());
        assertEquals("f2", testObj2.getConvertedField2());
        assertEquals("enriched", testObj2.getEnrichedField());
    }

    @Test
    void enrichedTest() throws Exception {
        camelContext.getRouteController().startRoute(TEST_ENRICHED_ROUTE_ID);
        UUID guid = UUID.fromString("817e7b13-9273-48ee-ad26-cd3014e14b44");
        Object result = producerTemplate.sendBody(
                "direct:testUuidObject",
                ExchangePattern.InOut,
                new TestUuidObject().toBuilder().guid(guid).build()
        );
        assertNotNull(result);
        assertEquals(InboxData.class, result.getClass());

        InboxData inboxData = (InboxData) result;
        assertEquals(inboxData.getGuid(), guid);

    }
}
