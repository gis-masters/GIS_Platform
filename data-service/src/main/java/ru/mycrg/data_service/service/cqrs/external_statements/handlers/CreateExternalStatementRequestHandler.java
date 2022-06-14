package ru.mycrg.data_service.service.cqrs.external_statements.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.ExternalStatement;
import ru.mycrg.data_service.repository.ExternalStatementRepository;
import ru.mycrg.data_service.service.cqrs.external_statements.requests.CreateExternalStatementRequest;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class CreateExternalStatementRequestHandler implements IRequestHandler<CreateExternalStatementRequest, Voidy> {

    private final ExternalStatementRepository externalStatementRepository;

    public CreateExternalStatementRequestHandler(ExternalStatementRepository externalStatementRepository) {
        this.externalStatementRepository = externalStatementRepository;
    }

    @Override
    public Voidy handle(CreateExternalStatementRequest request) {
        externalStatementRepository.save(new ExternalStatement(request.getStatementDto()));

        return new Voidy();
    }
}
