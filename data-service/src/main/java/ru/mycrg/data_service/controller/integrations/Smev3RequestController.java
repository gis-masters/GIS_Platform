package ru.mycrg.data_service.controller.integrations;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.service.smev3.ReceiptRnsRequestService;
import ru.mycrg.data_service_contract.dto.smev3.RequestDto;

/**
 * TODO скорее всего это временный контроллер, так как целевая картинка не подразумевает его наличия
 */
@RestController
@RequestMapping("/integration/smev3")
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class Smev3RequestController {

    private final ReceiptRnsRequestService requestService;

    public Smev3RequestController(ReceiptRnsRequestService requestService) {
        this.requestService = requestService;
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rns
     */
    @PostMapping("/request/receipt-rns")
    public ResponseEntity<RequestDto> requestReceiptRns(@RequestBody ReceiptRnsRequestDto rnsRequestDto) {
        var response = requestService.request(rnsRequestDto);

        return ResponseEntity.ok(response);
    }
}
