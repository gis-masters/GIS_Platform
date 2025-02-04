package ru.crg.gisogd_service.test.route;

import lombok.AllArgsConstructor;
import org.apache.camel.builder.RouteBuilder;
import org.springframework.stereotype.Component;
import ru.crg.gisogd_service.test.route.dto.ComplexValueObj;
import ru.crg.gisogd_service.test.route.strategy.ComplexValueAggregationStrategy;

import java.util.ArrayList;

@Component
@AllArgsConstructor
public class TestRoute extends RouteBuilder {
    public static final String TEST_ROUTE_ID = "test-route";
    public static final String TEST_ENRICHED_ROUTE_ID = "test-enriched-route";
    public static final String TEST_COMPLEX_VALUE_ROUTE_ID = "test-complex-value-route";
    public static final String TEST_COMPLEX_VALUE_SUB_ROUTE_ID = "test-complex-value-sub-route";

    @Override
    public void configure() {
        from("direct:testObj1").routeId(TEST_ROUTE_ID)
                .setHeader("enrich", simple("${body.enrichObj}"))
                .to("bean:testTargetBean")
                .choice().when(header("enrich").isEqualTo(true))
                .bean("testTargetBean", "enrich")
                .end()
                .to("mock:test");

        from("direct:complexValueSub").routeId(TEST_COMPLEX_VALUE_SUB_ROUTE_ID)
                .log("body: ${body}");

        from("direct:complexValue").routeId(TEST_COMPLEX_VALUE_ROUTE_ID)
                .setHeader("complexValue", ArrayList::new)
                .setHeader("origin", simple("${body}"))
                .log("complexValue: ${header.complexValue}")
                .split(simple("${body.values}"), new ComplexValueAggregationStrategy()).synchronous()
                /**/.to("direct:complexValueSub")
                .end()
                .log("end complexValue: ${header.complexValue}")
                .setBody(exchange -> exchange.getIn().getHeader("origin", ComplexValueObj.class))
                .log("main body: ${body}")
                .to("mock:result");
    }
}
