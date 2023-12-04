package ru.mycrg.data_service.config;

import io.minio.MinioClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.data_service.service.smev3.receipt_rns.ReceiptRnsRequestService;

/**
 * Скорее всего временный класс, пока адаптеры СМЭВ не использует общую инфрастуктуру
 */
@Configuration
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevAdapterConfiguration {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestService.class);

    @Bean
    public RabbitTemplate rabbitSmevAdapterTemplate(Smev3Config smev3Config) {
        var factory = new CachingConnectionFactory(smev3Config.getAmqpHost());
        factory.setUsername(smev3Config.getAmqpUsername());
        factory.setPassword(smev3Config.getAmqpPassword());
        log.info("S3 amqp url {} login {}", smev3Config.getAmqpHost(), smev3Config.getAmqpUsername());
        return new RabbitTemplate(factory);
    }

    @Bean
    public MinioClient s3client(Smev3Config smev3Config) {
        var minioClient = MinioClient.builder()
                .endpoint(smev3Config.getS3endpoint())
                .credentials(smev3Config.getS3accesskey(), smev3Config.getS3secretkey())
                .build();
        log.info("S3 client endpoint {} accesskey {}", smev3Config.getS3endpoint(), smev3Config.getS3accesskey());
        return minioClient;
    }
}
