package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.data_service.dto.ProcessDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;

import java.util.List;
import java.util.Map;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.data_service_contract.enums.ProcessType.FTS_RELOAD;
import static ru.mycrg.data_service_contract.enums.ProcessType.FULL_TEXT_SEARCH;

@RestController
public class FtsController {

    private final ProcessesController processesController;

    public FtsController(ProcessesController processesController) {
        this.processesController = processesController;
    }

    @PostMapping("/fts")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Resource<Process>> fullTextSearch(@RequestBody FtsRequestDto dto, Pageable pageable) {
        if (dto.getText() == null || dto.getText().isBlank()) {
            throw new BadRequestException("Некорректный запрос",
                                          List.of(new ErrorInfo("text", "Поле обязательно к заполнению")));
        }

        ProcessDto processDto = new ProcessDto();
        processDto.setType(FULL_TEXT_SEARCH.name());
        processDto.setPayload(Map.of(
                "ftsDto", dto,
                "pageable", pageable
        ));

        return processesController.initProcess(processDto);
    }

    @PostMapping("/fts/reload")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Resource<Process>> reloadFTSData() {
        ProcessDto processDto = new ProcessDto();
        processDto.setType(FTS_RELOAD.name());

        return processesController.initProcess(processDto);
    }
}
