package ru.mycrg.data_service.controller.table;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.service.resources.TableRootService;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class TablesRootController {

    private final TableRootService tableRootService;

    public TablesRootController(TableRootService tableRootService) {
        this.tableRootService = tableRootService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/tables")
    public ResponseEntity<?> getTables(@RequestParam(name = "filter", required = false) String ecqlFilter,
                                       Pageable pageable) {
        Page<TableModel> tables = tableRootService.getPaged(ecqlFilter, pageable);

        return ResponseEntity.ok(pageFromList(tables, pageable));
    }
}
