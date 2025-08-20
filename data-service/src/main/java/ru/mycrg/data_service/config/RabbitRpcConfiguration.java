package ru.mycrg.data_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

@Configuration
public class RabbitRpcConfiguration {

    private final int MAX_MESSAGE_AGE = 60_000;

    private final Jackson2JsonMessageConverter producerJackson2MessageConverter;

    public RabbitRpcConfiguration(Jackson2JsonMessageConverter producerJackson2MessageConverter) {
        this.producerJackson2MessageConverter = producerJackson2MessageConverter;
    }

    @Bean
    Queue msgQueue() {
        return new Queue(RPC_REQUEST_QUEUE, false, false, false, Map.of("x-message-ttl", MAX_MESSAGE_AGE));
    }

    @Bean
    Queue replyQueue() {
        return new Queue(RPC_REPLY_QUEUE, false, false, false, Map.of("x-message-ttl", MAX_MESSAGE_AGE));
    }

    @Bean
    TopicExchange rpcTopicExchange() {
        return new TopicExchange(RPC_TOPIC_EXCHANGE);
    }

    @Bean
    Binding msgBinding() {
        return BindingBuilder.bind(msgQueue())
                             .to(rpcTopicExchange())
                             .with(RPC_REQUEST_QUEUE);
    }

    @Bean
    Binding replyBinding() {
        return BindingBuilder.bind(replyQueue())
                             .to(rpcTopicExchange())
                             .with(RPC_REPLY_QUEUE);
    }

    @Bean
    RabbitTemplate rabbitRpcTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(producerJackson2MessageConverter);
        template.setReplyAddress(RPC_REPLY_QUEUE);
        template.setReplyTimeout(50000);

        return template;
    }

    @Bean
    SimpleMessageListenerContainer rpcReplyContainer(ConnectionFactory connectionFactory) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(RPC_REPLY_QUEUE);
        container.setMessageListener(rabbitRpcTemplate(connectionFactory));

        return container;
    }
}
