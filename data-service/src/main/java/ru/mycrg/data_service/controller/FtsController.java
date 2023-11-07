package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.mediator.Mediator;

import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class FtsController {

    private final Mediator mediator;

    public FtsController(Mediator mediator) {
        this.mediator = mediator;
    }

    @PostMapping("/fts")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> fullTextSearch(@RequestBody FtsRequestDto dto, Pageable pageable) {
        if (dto.getText() == null || dto.getText().isBlank()) {
            throw new BadRequestException("Некорректный запрос",
                                          List.of(new ErrorInfo("text", "Поле обязательно к заполнению")));
        }

        Page<FtsResponseDto> response = mediator.execute(new FtsRequest(dto, pageable));

        return ResponseEntity.ok(pageFromList(response, pageable));
    }
}
