package ru.mycrg.data_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static ru.mycrg.mq_queue_contract.config.MqProperties.*;

@Configuration
public class RabbitConfiguration {

    // Config "init import" exchange/queue
    @Bean public Queue queueImportInit() { return new Queue(QUEUE_IMPORT_INIT, false);}
    @Bean public FanoutExchange fanoutExchangeImportInit() { return new FanoutExchange(FANOUT_IMPORT_INIT);}
    @Bean public Binding bindingImportInit() {
        return BindingBuilder.bind(queueImportInit()).to(fanoutExchangeImportInit());
    }

    // Config "import response" exchange/queue
    @Bean public Queue queueImportResponse() { return new Queue(QUEUE_IMPORT_RESPONSE, false);}
    @Bean public FanoutExchange fanoutExchangeImportResponse() { return new FanoutExchange(FANOUT_IMPORT_RESPONSE);}
    @Bean public Binding bindingImportResponse() {
        return BindingBuilder.bind(queueImportResponse()).to(fanoutExchangeImportResponse());
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

    // Config "gml init generation" exchange/queue
    @Bean public Queue queueGmlInit() { return new Queue(QUEUE_GML_INIT, false);}
    @Bean public FanoutExchange fanoutExchangeGmlInit() { return new FanoutExchange(FANOUT_GML_INIT);}
    @Bean public Binding bindingGmlInit() {
        return BindingBuilder.bind(queueGmlInit()).to(fanoutExchangeGmlInit());
    }

    // Config "gml response"
    @Bean public Queue queueGmlResponse() { return new Queue(QUEUE_GML_RESPONSE, false);}
    @Bean public FanoutExchange fanoutExchangeGmlResponse() { return new FanoutExchange(FANOUT_GML_RESPONSE);}
    @Bean public Binding bindingGmlResponse() {
        return BindingBuilder.bind(queueGmlResponse()).to(fanoutExchangeGmlResponse());
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
