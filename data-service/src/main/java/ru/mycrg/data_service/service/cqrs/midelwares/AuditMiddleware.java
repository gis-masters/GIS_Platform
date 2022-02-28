package ru.mycrg.data_service.service.cqrs.midelwares;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.data_service.queue.MessageBusProducer;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.IRequestMiddleware;

@Component
@Order(2)
public class AuditMiddleware implements IRequestMiddleware {

    private final MessageBusProducer messageBus;

    public AuditMiddleware(MessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public <Response, Request extends IRequest<Response>> Response invoke(Request request, Next<Response> next) {
        Response response = next.invoke();

        if (request instanceof Auditable) {
            messageBus.produce(((Auditable) request).getEvent());
        }

        return response;
    }
}
