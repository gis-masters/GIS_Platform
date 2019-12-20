package ru.mycrg.auth_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfiguration {

    public static final String REQUEST_QUEUE = "org.request.queue";
    public static final String REQUEST_FANOUT = "org.request.fanout";
    public static final String REQUEST_KEY = "org.request.key";

    public static final String RESPONSE_QUEUE = "org.response.queue";
    public static final String RESPONSE_FANOUT = "org.response.fanout";
    public static final String RESPONSE_KEY = "org.response.key";

    // Config "request" exchange/queue
    @Bean public Queue queueOrgCreated() {
        return new Queue(REQUEST_QUEUE);
    }

    @Bean public FanoutExchange fanoutExchangeOrgCreated() {
        return new FanoutExchange(REQUEST_FANOUT);
    }

    @Bean public Binding bindingOrgCreated() {
        return BindingBuilder.bind(queueOrgCreated()).to(fanoutExchangeOrgCreated());
    }

    // Config "response" exchange/queue
    @Bean public Queue queueOrgInit() {
        return new Queue(RESPONSE_QUEUE, false);
    }

    @Bean public FanoutExchange fanoutExchangeOrgInit() {
        return new FanoutExchange(RESPONSE_FANOUT);
    }

    @Bean public Binding bindingOrgInit() {
        return BindingBuilder.bind(queueOrgInit()).to(fanoutExchangeOrgInit());
    }

    @Bean
    public Jackson2JsonMessageConverter producerJackson2MessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(producerJackson2MessageConverter());

        return rabbitTemplate;
    }

}
