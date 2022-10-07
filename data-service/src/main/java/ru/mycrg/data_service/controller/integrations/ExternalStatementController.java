package ru.mycrg.data_service.controller.integrations;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.ExternalStatementDto;
import ru.mycrg.data_service.service.ExternalStatementService;
import ru.mycrg.data_service.service.cqrs.external_statements.requests.CreateExternalStatementRequest;
import ru.mycrg.mediator.Mediator;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/integration/statement")
public class ExternalStatementController {

    private final ExternalStatementService externalStatementService;

    private final Mediator mediator;

    public ExternalStatementController(ExternalStatementService externalStatementService, Mediator mediator) {
        this.externalStatementService = externalStatementService;
        this.mediator = mediator;
    }

    @PostMapping("/import")
    public ResponseEntity<Object> save(@RequestBody @Valid ExternalStatementDto statementDto,
                                       HttpServletRequest request) {
        final String tokenExternalStatement = externalStatementService.getTokenExternalStatement();
        if (!tokenExternalStatement.equals(request.getHeader("Authorization"))) {
            return new ResponseEntity<>(UNAUTHORIZED);
        }
        mediator.execute(new CreateExternalStatementRequest(statementDto));

        return ResponseEntity.status(CREATED).build();
    }
}
