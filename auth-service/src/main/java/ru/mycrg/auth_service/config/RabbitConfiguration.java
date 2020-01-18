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

    public static final String ORG_REQUEST_QUEUE = "org.request.queue";
    public static final String ORG_REQUEST_FANOUT = "org.request.fanout";
    public static final String ORG_REQUEST_KEY = "org.request.key";

    public static final String ORG_RESPONSE_QUEUE = "org.response.queue";
    public static final String ORG_RESPONSE_FANOUT = "org.response.fanout";

    public static final String USER_REQUEST_QUEUE = "user.request.queue";
    public static final String USER_REQUEST_FANOUT = "user.request.fanout";
    public static final String USER_REQUEST_KEY = "user.request.key";

    public static final String USER_RESPONSE_QUEUE = "user.response.queue";
    public static final String USER_RESPONSE_FANOUT = "user.response.fanout";

    // Config "org request" exchange/queue
    @Bean public Queue queueOrgCreated() {
        return new Queue(ORG_REQUEST_QUEUE);
    }

    @Bean public FanoutExchange fanoutExchangeOrgCreated() {
        return new FanoutExchange(ORG_REQUEST_FANOUT);
    }

    @Bean public Binding bindingOrgCreated() {
        return BindingBuilder.bind(queueOrgCreated()).to(fanoutExchangeOrgCreated());
    }

    // Config "org response" exchange/queue
    @Bean public Queue queueOrgInit() {
        return new Queue(ORG_RESPONSE_QUEUE, false);
    }

    @Bean public FanoutExchange fanoutExchangeOrgInit() {
        return new FanoutExchange(ORG_RESPONSE_FANOUT);
    }

    @Bean public Binding bindingOrgInit() {
        return BindingBuilder.bind(queueOrgInit()).to(fanoutExchangeOrgInit());
    }


    // Config "user request" exchange/queue
    @Bean public Queue queueUserCreated() {
        return new Queue(USER_REQUEST_QUEUE);
    }

    @Bean public FanoutExchange fanoutExchangeUserCreated() {
        return new FanoutExchange(USER_REQUEST_FANOUT);
    }

    @Bean public Binding bindingUserCreated() {
        return BindingBuilder.bind(queueUserCreated()).to(fanoutExchangeUserCreated());
    }

    // Config "user response" exchange/queue
    @Bean public Queue queueUserInit() {
        return new Queue(USER_RESPONSE_QUEUE, false);
    }

    @Bean public FanoutExchange fanoutExchangeUserInit() {
        return new FanoutExchange(USER_RESPONSE_FANOUT);
    }

    @Bean public Binding bindingUserInit() {
        return BindingBuilder.bind(queueUserInit()).to(fanoutExchangeUserInit());
    }

    // Common configuration
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
