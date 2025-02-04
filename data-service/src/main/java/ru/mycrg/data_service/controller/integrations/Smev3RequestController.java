package ru.mycrg.data_service.controller.integrations;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.dto.smev3.ReceiptRnvRequestDto;
import ru.mycrg.data_service.dto.smev3.RegisterRequestDto;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvRequestService;
import ru.mycrg.data_service.service.smev3.request.register_rns.RegisterRnsRequestService;
import ru.mycrg.data_service.service.smev3.request.register_rnv.RegisterRnvRequestService;
import ru.mycrg.data_service.service.smev3.request.terminate_rns.TerminateRnsRequestService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
@RequestMapping("/integration/smev3/request")
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class Smev3RequestController {

    private final ReceiptRnsRequestService rnsRequestService;
    private final ReceiptRnvRequestService rnvRequestService;
    private final RegisterRnsRequestService registerRnsService;
    private final RegisterRnvRequestService registerRnvService;
    private final TerminateRnsRequestService terminateRnsRequestService;
    private final GetCadastrialPlanRequestService getCadastrialPlanRequestService;
    private final SmevMessageService storageService;

    public Smev3RequestController(ReceiptRnsRequestService rnsRequestService,
                                  ReceiptRnvRequestService rnvRequestService,
                                  RegisterRnsRequestService registerRnsService,
                                  RegisterRnvRequestService registerRnvService,
                                  TerminateRnsRequestService terminateRnsRequestService,
                                  GetCadastrialPlanRequestService getCadastrialPlanRequestService,
                                  SmevMessageService storageService) {
        this.rnsRequestService = rnsRequestService;
        this.rnvRequestService = rnvRequestService;
        this.registerRnsService = registerRnsService;
        this.registerRnvService = registerRnvService;
        this.terminateRnsRequestService = terminateRnsRequestService;
        this.getCadastrialPlanRequestService = getCadastrialPlanRequestService;
        this.storageService = storageService;
    }

    /**
     * Получить мету запроса по ИД
     */
    @GetMapping("/meta/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<SmevRequestMeta> getMeta(@PathVariable UUID id) {
        return ResponseEntity.ok(storageService.getMeta(id));
    }

    /**
     * Отправить запрос в ЕГРН для получения КПТ
     */
    @PostMapping("/egrn")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> getCadastrialPlan(@RequestBody List<String> cadNums) {
        getCadastrialPlanRequestService.processMessageFromSmev(cadNums);

        return ResponseEntity.ok().build();
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rns
     */
    @PostMapping("/receipt-rns")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<SmevRequestMeta> receiptRns(@RequestBody ReceiptRnsRequestDto rnsRequestDto) {
        SmevRequestMeta response = rnsRequestService.sendRequest(rnsRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rnv
     */
    @PostMapping("/receipt-rnv")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<SmevRequestMeta> receiptRnv(@RequestBody ReceiptRnvRequestDto rnvRequestDto) {
        SmevRequestMeta response = rnvRequestService.sendRequest(rnvRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/register-rns
     */
    @PostMapping("/register-rns")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<SmevRequestMeta> registerRns(@Valid @RequestBody RegisterRequestDto rnsRequestDto) {
        SmevRequestMeta response = registerRnsService.sendRequest(rnsRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/register-rnv
     */
    @PostMapping("/register-rnv")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<SmevRequestMeta> registerRnv(@RequestBody RegisterRequestDto rnvRequestDto) {
        SmevRequestMeta response = registerRnvService.sendRequest(rnvRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/terminate-rns
     */
    @PostMapping("/terminate-rns")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<SmevRequestMeta> terminateRns(@RequestBody RegisterRequestDto terminateRnsRequestDto) {
        SmevRequestMeta response = terminateRnsRequestService.sendRequest(terminateRnsRequestDto);

        return ResponseEntity.ok(response);
    }
}
