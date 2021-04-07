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

import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

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

    // Config "export init generation" exchange/queue
    @Bean public Queue queueExportInit() { return new Queue(QUEUE_EXPORT_INIT, false);}
    @Bean public FanoutExchange fanoutExchangeExportInit() { return new FanoutExchange(FANOUT_EXPORT_INIT);}
    @Bean public Binding bindingExportInit() {
        return BindingBuilder.bind(queueExportInit()).to(fanoutExchangeExportInit());
    }

    // Config "export response"
    @Bean public Queue queueExportResponse() { return new Queue(QUEUE_EXPORT_RESPONSE, false);}
    @Bean public FanoutExchange fanoutExchangeExportResponse() { return new FanoutExchange(FANOUT_EXPORT_RESPONSE);}
    @Bean public Binding bindingExportResponse() {
        return BindingBuilder.bind(queueExportResponse()).to(fanoutExchangeExportResponse());
    }

    @Bean public Queue deleteGisReferencesRequestQueue() { return new Queue(COMMON_REQUEST_QUEUE);}
    @Bean public Queue deleteGisReferencesResponseQueue() { return new Queue(COMMON_RESPONSE_QUEUE);}

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
