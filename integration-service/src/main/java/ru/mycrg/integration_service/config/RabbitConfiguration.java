package ru.mycrg.integration_service.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.aopalliance.aop.Advice;
import org.camunda.bpm.engine.MismatchingMessageCorrelationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.RetryContext;
import org.springframework.retry.RetryListener;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.interceptor.RetryOperationsInterceptor;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

@Configuration
public class RabbitConfiguration {

    private static final Logger log = LoggerFactory.getLogger(RabbitConfiguration.class);

    // Config "audit request" exchange/queue
    @Bean
    public Queue queueAuditEventCreated() {
        return new Queue(AUDIT_REQUEST_QUEUE);
    }

    @Bean
    public FanoutExchange fanoutExchangeAuditEventCreated() {
        return new FanoutExchange(AUDIT_REQUEST_FANOUT);
    }

    @Bean
    public Queue queueIntegrationToGeoWrapperCreated() {
        return new Queue(INTEGRATION_TO_GEO_WRAPPER_QUEUE);
    }

    @Bean
    public Binding bindingAuditEventCreated() {
        return BindingBuilder.bind(queueAuditEventCreated()).to(fanoutExchangeAuditEventCreated());
    }

    // Common configuration
    @Bean
    public Jackson2JsonMessageConverter producerJackson2MessageConverter() {
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY)
                    .registerModule(new JavaTimeModule());

        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(producerJackson2MessageConverter());

        return rabbitTemplate;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory retryContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(producerJackson2MessageConverter());

        factory.setAdviceChain(retryAdvice());

        factory.setDefaultRequeueRejected(false);

        return factory;
    }

    @Bean
    public Advice retryAdvice() {
        RetryOperationsInterceptor interceptor = new RetryOperationsInterceptor();
        interceptor.setRetryOperations(retryTemplate());
        interceptor.setRecoverer((args, cause) -> {
            log.error("Rejecting message after retry exhaustion", cause);
            throw new AmqpRejectAndDontRequeueException(cause);
        });
        return interceptor;
    }

    private RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();

        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(100);
        backOffPolicy.setMultiplier(2.0);
        backOffPolicy.setMaxInterval(1000);
        retryTemplate.setBackOffPolicy(backOffPolicy);

        Map<Class<? extends Throwable>, Boolean> retryableExceptions = new HashMap<>();
        retryableExceptions.put(MismatchingMessageCorrelationException.class, true);

        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy(5, retryableExceptions, true, false);
        retryTemplate.setRetryPolicy(retryPolicy);

        // ✅ Логирование попыток
        retryTemplate.registerListener(new RetryListener() {
            @Override
            public <T, E extends Throwable> boolean open(
                    RetryContext context, RetryCallback<T, E> callback) {
                // Можно залогировать старт обработки сообщения
                log.debug("Rabbit retry started");

                return true;
            }

            @Override
            public <T, E extends Throwable> void onError(
                    RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {
                int attempt = context.getRetryCount(); // 1..N (после первого фейла будет 1)
                log.warn("Rabbit retry attempt #{} failed: {}: {}",
                         attempt,
                         throwable.getClass().getSimpleName(),
                         throwable.getMessage(),
                         throwable);
            }

            @Override
            public <T, E extends Throwable> void close(
                    RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {
                // throwable != null => исчерпали попытки и вылетели наружу
                if (throwable != null) {
                    log.error("Rabbit retries exhausted after {} failures. Final exception: {}: {}",
                              context.getRetryCount(),
                              throwable.getClass().getSimpleName(),
                              throwable.getMessage(),
                              throwable);
                } else {
                    // Успешно после ретраев или с первой попытки
                    if (context.getRetryCount() > 0) {
                        log.info("Rabbit retry succeeded after {} failures", context.getRetryCount());
                    }
                }
            }
        });

        return retryTemplate;
    }
}
