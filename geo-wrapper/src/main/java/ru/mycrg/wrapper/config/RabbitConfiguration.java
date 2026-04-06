package ru.mycrg.wrapper.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.cfg.DateTimeFeature;
import tools.jackson.databind.json.JsonMapper;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_INTEGRATION_QUEUE;

@Configuration
public class RabbitConfiguration {

    @Bean
    public Queue queueGeoWrapperToIntegrationCreated() {
        return new Queue(GEO_WRAPPER_TO_INTEGRATION_QUEUE);
    }

    @Bean
    public JacksonJsonMessageConverter jacksonJsonMessageConverter() {
        JsonMapper jsonMapper = JsonMapper.builder()
                                          .changeDefaultPropertyInclusion(incl ->
                                                                                  incl.withValueInclusion(
                                                                                          JsonInclude.Include.NON_NULL))
                                          .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                                          .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
                                          .build();

        return new JacksonJsonMessageConverter(jsonMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jacksonJsonMessageConverter());

        return rabbitTemplate;
    }
}
