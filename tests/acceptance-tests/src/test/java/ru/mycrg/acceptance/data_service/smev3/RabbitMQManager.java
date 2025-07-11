package ru.mycrg.acceptance.data_service.smev3;

import com.rabbitmq.client.*;
import ru.mycrg.acceptance.data_service.smev3.config.PropertiesConfig;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Properties;
import java.util.concurrent.TimeoutException;

/**
 * Класс для управления очередями кролика
 * <p>
 * Планируется наличие двух методов: поставь в очередь, считай одно сообщение из очереди
 * <p>
 * Вообще класс используется исключительно в SmevTasksDefinitions куда его можно будет мигрировать, но показалось что
 * распределение ответственности будет правильной идеей
 */

public class RabbitMQManager {

    private final Properties properties;
    private final ConnectionFactory factory;

    public RabbitMQManager() {
        this.properties = PropertiesConfig.getProperties();
        this.factory = createConnectionFactory();
    }

    private ConnectionFactory createConnectionFactory() {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(properties.getProperty("RABBIT_HOST"));
        factory.setPort(Integer.parseInt(properties.getProperty("RABBIT_PORT")));
        factory.setUsername(properties.getProperty("RABBIT_USER"));
        factory.setPassword(properties.getProperty("RABBIT_PASS"));

        return factory;
    }

    public void sendMessage(String queueName, String message) throws IOException, TimeoutException {
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare(queueName, true, false, false, null);
            channel.basicPublish("",
                                 queueName,
                                 MessageProperties.PERSISTENT_TEXT_PLAIN,
                                 message.getBytes(StandardCharsets.UTF_8));
        }
    }

    public String receiveMessage(String queueName) throws IOException, TimeoutException, InterruptedException {
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare(queueName, true, false, false, null);
            // Ждем сообщение максимум 30 секунд
            long startTime = System.currentTimeMillis();
            long timeout = 30000; // 30 секунд

            while (System.currentTimeMillis() - startTime < timeout) {
                GetResponse response = channel.basicGet(queueName, true); // auto-ack = true
                if (response != null) {
                    byte[] body = response.getBody();
                    return new String(body, StandardCharsets.UTF_8);
                }
                // Если сообщение не получено, подождем немного перед следующей попыткой
                Thread.sleep(1000); // 1 секунда
            }
            throw new RuntimeException(
                    "Не удалось получить сообщение из очереди " + queueName + " в течение " + (timeout / 1000) + " секунд");
        }
    }
}
