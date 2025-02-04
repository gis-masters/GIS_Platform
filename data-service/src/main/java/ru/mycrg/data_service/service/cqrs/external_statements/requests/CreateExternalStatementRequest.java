package ru.mycrg.data_service.service.cqrs.external_statements.requests;

import ru.mycrg.data_service.dto.ExternalStatementDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

public class CreateExternalStatementRequest implements IRequest<Voidy> {

    private final ExternalStatementDto statementDto;

    public CreateExternalStatementRequest(ExternalStatementDto statementDto) {
        this.statementDto = statementDto;
    }

    @Override
    public String getType() {
        return CreateExternalStatementRequest.class.getSimpleName();
    }

    public ExternalStatementDto getStatementDto() {
        return statementDto;
    }
}
