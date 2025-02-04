package ru.crg.gisogd_service.test.route.strategy;

import org.apache.camel.AggregationStrategy;
import org.apache.camel.Exchange;

import java.util.List;

public class ComplexValueAggregationStrategy implements AggregationStrategy {

    public Exchange aggregate(Exchange newExchange, Exchange oldExchange) {
        List<String> complexValue = (List<String>) oldExchange.getIn().getHeader("complexValue");
        complexValue.add(oldExchange.getIn().getBody(String.class));
        return oldExchange;
    }
}
