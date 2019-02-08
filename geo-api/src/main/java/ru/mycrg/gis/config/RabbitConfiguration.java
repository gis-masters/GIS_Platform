package ru.mycrg.gis.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.common.config.MqProperties;

import static ru.mycrg.common.config.MqProperties.*;

@Configuration
public class RabbitConfiguration {

    // Config "created" exchange/queue
    @Bean public Queue queueOrgCreated() { return new Queue(MqProperties.QUEUE_ORG_CREATED, false);}
    @Bean public FanoutExchange fanoutExchangeOrgCreated() { return new FanoutExchange(MqProperties.FANOUT_ORG_CREATED);}
    @Bean public Binding bindingOrgCreated() {
        return BindingBuilder.bind(queueOrgCreated()).to(fanoutExchangeOrgCreated());
    }

    // Config "init organization" exchange/queue
    @Bean public Queue queueOrgInit() { return new Queue(QUEUE_ORG_INIT, false);}
    @Bean public FanoutExchange fanoutExchangeOrgInit() { return new FanoutExchange(FANOUT_ORG_INIT);}
    @Bean public Binding bindingOrgInit() {
        return BindingBuilder.bind(queueOrgInit()).to(fanoutExchangeOrgInit());
    }

    // Config "validation start" exchange/queue
    @Bean public Queue queueStartValidation() { return new Queue(QUEUE_VALIDATION_START, false);}
    @Bean public FanoutExchange fanoutExchangeValidationStart() { return new FanoutExchange(FANOUT_VALIDATION_START);}
    @Bean public Binding bindingValidationStart() {
        return BindingBuilder.bind(queueStartValidation()).to(fanoutExchangeValidationStart());
    }

    // Config "validation result" exchange/queue
    @Bean public Queue queueValidationResult() { return new Queue(QUEUE_VALIDATION_RESULT, false);}
    @Bean public FanoutExchange fanoutExchangeValidationResult() { return new FanoutExchange(FANOUT_VALIDATION_RESULT);}
    @Bean public Binding bindingValidationResult() {
        return BindingBuilder.bind(queueValidationResult()).to(fanoutExchangeValidationResult());
    }

    // Config "crg postgres" exchange/queue
    @Bean public Queue queuePostgreValidation() { return new Queue(QUEUE_POSTGRE_VALIDATION, false);}
    @Bean public FanoutExchange fanoutExchangePostgreValidation() { return new FanoutExchange(FANOUT_POSTGRE_VALIDATION);}
    @Bean public Binding bindingPostgreValidation() {
        return BindingBuilder.bind(queuePostgreValidation()).to(fanoutExchangePostgreValidation());
    }

    // Config "save violations result" exchange/queue
    @Bean public Queue queueViolationSave() { return new Queue(QUEUE_VIOLATION_SAVE, false);}
    @Bean public FanoutExchange fanoutExchangeViolationSave() { return new FanoutExchange(FANOUT_VIOLATION_SAVE);}
    @Bean public Binding bindingViolationSave() {
        return BindingBuilder.bind(queueViolationSave()).to(fanoutExchangeViolationSave());
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
