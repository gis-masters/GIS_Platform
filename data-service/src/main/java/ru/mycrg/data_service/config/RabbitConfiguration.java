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
import ru.mycrg.data_service.service.smev3.config.Smev3Config;

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

    @Bean public Queue queueFileEventDeleted() { return new Queue(FILE_REQUEST_QUEUE);}

    @Bean public Queue deleteGisReferencesRequestQueue() { return new Queue(COMMON_REQUEST_QUEUE);}
    @Bean public Queue deleteGisReferencesResponseQueue() { return new Queue(COMMON_RESPONSE_QUEUE);}

    @Bean public Queue dataToIntegrationQueue() { return new Queue(DATA_TO_INTEGRATION_QUEUE);}
    @Bean public Queue integrationToDataQueue() { return new Queue(INTEGRATION_TO_DATA_QUEUE);}

    @Bean public Queue dataToGeoWrapperQueue() { return new Queue(DATA_TO_GEO_WRAPPER_QUEUE);}
    @Bean public Queue geoWrapperToDataQueue() { return new Queue(GEO_WRAPPER_TO_DATA_QUEUE);}

    @Bean public Queue gisogdPublicationQueue() { return new Queue(GISOGD_PUBLICATION_QUEUE);}
    @Bean public Queue gisogdPublicationResponseQueue() { return new Queue(GISOGD_PUBLICATION_RESPONSE_QUEUE);}

    @Bean public Queue gisogdAuditQueue() { return new Queue(GISOGD_AUDIT_QUEUE);}
    @Bean public Queue gisogdAuditResponseQueue() { return new Queue(GISOGD_AUDIT_RESPONSE_QUEUE);}

    @Bean
    public Queue adapterReceiveQueue(Smev3Config smev3Config) {
        return new Queue(smev3Config.getTransportMnemonic() + SMEV3_RECEIVE_QUEUE);
    }

    @Bean
    public Queue adapterReceiveFailQueue(Smev3Config smev3Config) {
        return new Queue(smev3Config.getTransportMnemonic() + SMEV3_RECEIVE_FAIL_QUEUE);
    }

    @Bean
    public Queue adapterSendQueue(Smev3Config smev3Config) {
        return new Queue(smev3Config.getTransportMnemonic() + SMEV3_SEND_QUEUE);
    }

    //Импорт КПТ
    @Bean public Queue kptImportTaskQueue() { return new Queue(IMPORT_KPT_TASK_QUEUE); }

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
