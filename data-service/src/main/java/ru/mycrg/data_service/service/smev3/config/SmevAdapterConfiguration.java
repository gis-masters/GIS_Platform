package ru.mycrg.data_service.service.smev3.config;

import io.minio.MinioClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Скорее всего временный класс, пока адаптеры СМЭВ не использует общую инфрастуктуру
 */
@Configuration
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevAdapterConfiguration {

    private final Logger log = LoggerFactory.getLogger(SmevAdapterConfiguration.class);

    @Value("${spring.rabbitmq.host}")
    private String amqpHost;

    @Value("${spring.rabbitmq.port}")
    private Integer amqpPort;

    @Value("${spring.rabbitmq.username}")
    private String amqpUsername;

    @Value("${spring.rabbitmq.password}")
    private String amqpPassword;

    @Bean
    public RabbitTemplate rabbitSmevAdapterTemplate() {
        CachingConnectionFactory factory = new CachingConnectionFactory(amqpHost, amqpPort);
        factory.setUsername(amqpUsername);
        factory.setPassword(amqpPassword);
        log.info("S3 amqp url {} login {}", amqpHost, amqpUsername);

        return new RabbitTemplate(factory);
    }

    @Bean
    public MinioClient s3client(Smev3Config smev3Config) {
        MinioClient minioClient = MinioClient.builder()
                                             .endpoint(smev3Config.getS3endpoint())
                                             .credentials(smev3Config.getS3accesskey(), smev3Config.getS3secretkey())
                                             .build();
        log.info("S3 client endpoint {} accessKey {}", smev3Config.getS3endpoint(), smev3Config.getS3accesskey());

        return minioClient;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory smevRabbitContainerFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setHost(amqpHost);
        connectionFactory.setPort(amqpPort);
        connectionFactory.setUsername(amqpUsername);
        connectionFactory.setPassword(amqpPassword);
        connectionFactory.setConnectionTimeout(3000);
        connectionFactory.setRequestedHeartBeat(30);

        SimpleRabbitListenerContainerFactory container = new SimpleRabbitListenerContainerFactory();
        container.setConnectionFactory(connectionFactory);

        return container;
    }
}
