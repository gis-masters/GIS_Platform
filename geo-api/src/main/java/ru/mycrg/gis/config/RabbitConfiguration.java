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

import static ru.mycrg.gis.config.MqProperties.FANOUT_ORG_INIT;
import static ru.mycrg.gis.config.MqProperties.QUEUE_ORG_INIT;

@Configuration
public class RabbitConfiguration {

    // created exchange/queue
    @Bean public Queue queueOrgCreated() { return new Queue(MqProperties.QUEUE_ORG_CREATED, false);}
    @Bean public FanoutExchange fanoutExchangeOrgCreated() { return new FanoutExchange(MqProperties.FANOUT_ORG_CREATED);}
    @Bean public Binding bindingOrgCreated() { return BindingBuilder.bind(queueOrgCreated()).to(fanoutExchangeOrgCreated());}

    // Init exchange/queue
    @Bean public Queue queueOrgInit() { return new Queue(QUEUE_ORG_INIT, false);}
    @Bean public FanoutExchange fanoutExchangeOrgInit() { return new FanoutExchange(FANOUT_ORG_INIT);}
    @Bean public Binding bindingOrgInit() { return BindingBuilder.bind(queueOrgInit()).to(fanoutExchangeOrgInit());}

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
