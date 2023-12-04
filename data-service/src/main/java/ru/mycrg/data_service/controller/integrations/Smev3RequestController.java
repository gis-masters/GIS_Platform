package ru.mycrg.data_service.controller.integrations;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.dto.smev3.RegisterRnsRequestDto;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.service.smev3.register_rns.RegisterRnsRequestService;

import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;

/**
 * TODO скорее всего это временный контроллер, так как целевая картинка не подразумевает его наличия
 */
@RestController
@RequestMapping("/integration/smev3")
public class Smev3RequestController {

    private final ReceiptRnsRequestService receiptRnsService;
    private final RegisterRnsRequestService registerRnsService;

    public Smev3RequestController(ReceiptRnsRequestService receiptRnsService, RegisterRnsRequestService registerRnsService) {
        this.receiptRnsService = receiptRnsService;
        this.registerRnsService = registerRnsService;
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rns
     */
    @PostMapping("/request/receipt-rns")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<XmlBuildMeta> requestReceiptRns(@RequestBody ReceiptRnsRequestDto rnsRequestDto) {
        var response = receiptRnsService.request(rnsRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/register-rns
     */
    @PostMapping("/request/register-rns")
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<XmlBuildMeta> requestReceiptRns(@RequestBody RegisterRnsRequestDto rnsRequestDto) {
        var response = registerRnsService.request(rnsRequestDto);

        return ResponseEntity.ok(response);
    }
}
