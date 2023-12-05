package ru.mycrg.data_service.controller.integrations;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.dto.smev3.RegisterRnsRequestDto;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.service.smev3.register_rns.RegisterRnsRequestService;

import java.util.UUID;

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

    private final ReceiptRnsRequestService receiptRnsService;
    private final RegisterRnsRequestService registerRnsService;
    private final SmevMessageService messageService;

    public Smev3RequestController(ReceiptRnsRequestService receiptRnsService, RegisterRnsRequestService registerRnsService, SmevMessageService messageService) {
        this.receiptRnsService = receiptRnsService;
        this.registerRnsService = registerRnsService;
        this.messageService = messageService;
    }

    /**
     * Получить мету запроса по ИД
     */
    @GetMapping("/request/meta/{id}")
    public ResponseEntity<XmlBuildMeta> getMeta(@PathVariable UUID id) {
        return ResponseEntity.ok(messageService.getMeta(id));
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rns
     */
    @PostMapping("/request/receipt-rns")
    public ResponseEntity<XmlBuildMeta> requestReceiptRns(@RequestBody ReceiptRnsRequestDto rnsRequestDto) {
        var response = receiptRnsService.request(rnsRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/register-rns
     */
    @PostMapping("/request/register-rns")
    public ResponseEntity<XmlBuildMeta> requestReceiptRns(@RequestBody RegisterRnsRequestDto rnsRequestDto) {
        var response = registerRnsService.request(rnsRequestDto);

        return ResponseEntity.ok(response);
    }
}
