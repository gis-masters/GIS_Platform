package ru.mycrg.auth_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

@Configuration
public class RabbitConfiguration {

    // Config "org request" exchange/queue
    @Bean
    public Queue queueOrgCreated() {
        return new Queue(ORG_REQUEST_QUEUE);
    }

    @Bean
    public FanoutExchange fanoutExchangeOrgCreated() {
        return new FanoutExchange(ORG_REQUEST_FANOUT);
    }

    @Bean
    public Binding bindingOrgCreated() {
        return BindingBuilder.bind(queueOrgCreated()).to(fanoutExchangeOrgCreated());
    }

    // Config "org response" exchange/queue
    @Bean
    public Queue queueOrgInit() {
        return new Queue(ORG_RESPONSE_QUEUE, false);
    }

    @Bean
    public FanoutExchange fanoutExchangeOrgInit() {
        return new FanoutExchange(ORG_RESPONSE_FANOUT);
    }

    @Bean
    public Binding bindingOrgInit() {
        return BindingBuilder.bind(queueOrgInit()).to(fanoutExchangeOrgInit());
    }

    // Config "user request" exchange/queue
    @Bean
    public Queue queueUserCreated() {
        return new Queue(USER_REQUEST_QUEUE);
    }

    @Bean
    public FanoutExchange fanoutExchangeUserCreated() {
        return new FanoutExchange(USER_REQUEST_FANOUT);
    }

    @Bean
    public Binding bindingUserCreated() {
        return BindingBuilder.bind(queueUserCreated()).to(fanoutExchangeUserCreated());
    }

    // Config "user response" exchange/queue
    @Bean
    public Queue queueUserInit() {
        return new Queue(USER_RESPONSE_QUEUE, false);
    }

    @Bean
    public FanoutExchange fanoutExchangeUserInit() {
        return new FanoutExchange(USER_RESPONSE_FANOUT);
    }

    @Bean
    public Binding bindingUserInit() {
        return BindingBuilder.bind(queueUserInit()).to(fanoutExchangeUserInit());
    }

    // System tags updated binding
    @Bean
    public Queue systemTagsUpdatedQueue() {
        return new Queue(SYSTEM_TAGS_UPDATED_QUEUE, false);
    }

    @Bean
    public DirectExchange dataToAuthExchange() {
        return new DirectExchange(DATA_TO_AUTH_EXCHANGE);
    }

    @Bean
    public Binding bindTagsUpdatedEvent() {
        return BindingBuilder
                .bind(systemTagsUpdatedQueue())
                .to(dataToAuthExchange())
                .with(SYSTEM_TAGS_UPDATED_ROUTING_KEY);
    }

    // System tags request binding
    @Bean
    public Queue systemTagsRequestQueue() {
        return new Queue(SYSTEM_TAGS_REQUEST_QUEUE, false);
    }

    @Bean
    public DirectExchange authToDataExchange() {
        return new DirectExchange(AUTH_TO_DATA_EXCHANGE);
    }

    @Bean
    public Binding bindSystemTagsRequestEvent() {
        return BindingBuilder
                .bind(systemTagsRequestQueue())
                .to(authToDataExchange())
                .with(SYSTEM_TAGS_REQUEST_ROUTING_KEY);
    }

    // Настраиваем publish/subscribe обмен для настроек организаций через тип 'fanout'
    // Создадим три очереди, по одной на каждый сервис
    @Bean
    public Queue authToDataQueue() {
        return new Queue(AUTH_TO_DATA_QUEUE);
    }

    @Bean
    public Queue authToGisQueue() {
        return new Queue(AUTH_TO_GIS_QUEUE);
    }

    @Bean
    public Queue authToIntegrationQueue() {
        return new Queue(AUTH_TO_INTEGRATION_QUEUE);
    }

    // Создадим fanout. Сообщения будут направляться не в очереди, а в этот "обменник".
    // Очереди будут связаны с обменником и будут все получать сообщения.
    @Bean
    public FanoutExchange authSettingsFanout() {
        return new FanoutExchange(ORG_SETTINGS_FANOUT);
    }

    // Свяжем fanout настроек со всеми очередями
    @Bean
    public Binding authToDataBinding() {
        return BindingBuilder.bind(authToDataQueue()).to(authSettingsFanout());
    }

    @Bean
    public Binding authToGisBinding() {
        return BindingBuilder.bind(authToGisQueue()).to(authSettingsFanout());
    }

    @Bean
    public Binding authToIntegrationBinding() {
        return BindingBuilder.bind(authToIntegrationQueue()).to(authSettingsFanout());
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
