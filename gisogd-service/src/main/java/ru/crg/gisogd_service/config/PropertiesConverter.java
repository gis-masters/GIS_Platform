package ru.crg.gisogd_service.config;

import org.apache.camel.Exchange;
import org.apache.camel.component.springrabbit.MessagePropertiesConverter;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

/**
 * Description.
 * @author Vladimir Nomokonov
 */
@Component
public class PropertiesConverter implements MessagePropertiesConverter {

    @Override
    public MessageProperties toMessageProperties(Exchange exchange) {
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setContentEncoding("UTF-8");
        messageProperties.setContentType("application/json");
        messageProperties.setHeaders(exchange.getIn().getHeaders());
        return messageProperties;
    }

    @Override
    public Map<String, Object> fromMessageProperties(MessageProperties messageProperties, Exchange exchange) {
        return Collections.emptyMap();
    }
}
