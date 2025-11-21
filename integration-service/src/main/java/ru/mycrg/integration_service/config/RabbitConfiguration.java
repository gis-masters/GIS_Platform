package ru.mycrg.integration_service.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.camunda.bpm.engine.MismatchingMessageCorrelationException;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

@Configuration
public class RabbitConfiguration {

    // Config "audit request" exchange/queue
    @Bean
    public Queue queueAuditEventCreated() {
        return new Queue(AUDIT_REQUEST_QUEUE);
    }

    @Bean
    public FanoutExchange fanoutExchangeAuditEventCreated() {
        return new FanoutExchange(AUDIT_REQUEST_FANOUT);
    }

    @Bean
    public Queue queueIntegrationToGeoWrapperCreated() {
        return new Queue(INTEGRATION_TO_GEO_WRAPPER_QUEUE);
    }

    @Bean
    public Binding bindingAuditEventCreated() {
        return BindingBuilder.bind(queueAuditEventCreated()).to(fanoutExchangeAuditEventCreated());
    }

    // Common configuration
    @Bean
    public Jackson2JsonMessageConverter producerJackson2MessageConverter() {
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY)
                    .registerModule(new JavaTimeModule());

        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(producerJackson2MessageConverter());

        return rabbitTemplate;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory retryContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(producerJackson2MessageConverter());
        factory.setRetryTemplate(retryTemplate());

        return factory;
    }

    private RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();

        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(100);
        backOffPolicy.setMultiplier(2.0);
        backOffPolicy.setMaxInterval(1000);
        retryTemplate.setBackOffPolicy(backOffPolicy);

        Map<Class<? extends Throwable>, Boolean> retryableExceptions = new HashMap<>();
        retryableExceptions.put(MismatchingMessageCorrelationException.class, true);

        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy(5, retryableExceptions);
        retryTemplate.setRetryPolicy(retryPolicy);

        return retryTemplate;
    }
}
