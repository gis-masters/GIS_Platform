package ru.mycrg.data_service.queue;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import static ru.mycrg.messagebus_contract.MessageBusProperties.RPC_REQUEST_QUEUE;
import static ru.mycrg.messagebus_contract.MessageBusProperties.RPC_TOPIC_EXCHANGE;

@Service
public class RpcProducer {

    private final RabbitTemplate rabbitRpcTemplate;

    public RpcProducer(RabbitTemplate rabbitRpcTemplate) {
        this.rabbitRpcTemplate = rabbitRpcTemplate;
    }

    public Message produce(Message message) {
        return rabbitRpcTemplate.sendAndReceive(RPC_TOPIC_EXCHANGE, RPC_REQUEST_QUEUE, message);
    }
}
