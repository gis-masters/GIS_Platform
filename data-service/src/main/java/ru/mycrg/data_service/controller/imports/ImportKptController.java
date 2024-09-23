package ru.mycrg.data_service.controller.imports;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.controller.BaseController;
import ru.mycrg.data_service.dto.kpt_import.ImportKptRequest;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.import_.kpt.ImportKptService;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.ACCEPTED;

@RestController
public class ImportKptController extends BaseController {

    private final ImportKptService importKptService;

    public ImportKptController(ImportKptService importKptService) {
        this.importKptService = importKptService;
    }

    @PostMapping("/import/kpt")
    public ResponseEntity<Object> importKpt(@RequestBody @Valid ImportKptRequest request) {
        IRecord resultRecord = importKptService.initImport(request);

        return ResponseEntity.status(ACCEPTED)
                             .body(resultRecord);
    }

    @PostMapping("/import/kpt/{taskId}/cancel")
    public ResponseEntity<Void> cancelKptImport(@PathVariable @NotNull Long taskId) {
        importKptService.cancelImport(taskId);

        return ResponseEntity.ok().build();
    }
}
