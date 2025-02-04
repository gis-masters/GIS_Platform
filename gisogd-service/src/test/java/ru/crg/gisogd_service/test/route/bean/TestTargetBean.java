package ru.crg.gisogd_service.test.route.bean;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.camel.Body;
import org.apache.camel.Handler;
import org.springframework.stereotype.Component;
import ru.crg.gisogd_service.test.route.dto.TestJson;
import ru.crg.gisogd_service.test.route.dto.TestObj2;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@Slf4j
@Component("testTargetBean")
public class TestTargetBean {
    @Handler
    public TestObj2 logData(@Body TestObj2 testObj2) {
        log.info("received testObj2 is {}", testObj2);
        return testObj2;
    }

    public void unusedMethod(TestObj2 testObj2) {
        log.info("called unused method");
    }

    public TestObj2 enrich(TestObj2 testObj2) {
        return testObj2.toBuilder().enrichedField("enriched").build();
    }

    @SneakyThrows
    public void checkObject(@Body TestJson testJson) {
        assertNotNull(testJson);
        assertEquals("f1", testJson.getField1());
        assertEquals("f2", testJson.getField2());
    }
}
