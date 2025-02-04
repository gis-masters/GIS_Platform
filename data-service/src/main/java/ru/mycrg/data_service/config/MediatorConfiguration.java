package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.IRequestMiddleware;
import ru.mycrg.mediator.Mediator;

import java.util.List;

@Configuration
public class MediatorConfiguration {

    @Bean
    Mediator mediator(List<IRequestHandler> requestHandlers,
                      List<IRequestMiddleware> requestMiddlewares) {
        return new Mediator()
                .withHandlers(requestHandlers::stream)
                .withMiddlewares(requestMiddlewares::stream);
    }
}
