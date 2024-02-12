package ru.mycrg.data_service.controller.integrations;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.smev3.*;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvRequestService;
import ru.mycrg.data_service.service.smev3.request.register_rns.RegisterRnsRequestService;
import ru.mycrg.data_service.service.smev3.request.register_rnv.RegisterRnvRequestService;

import java.util.UUID;

@RestController
@RequestMapping("/integration/smev3")
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class Smev3RequestController {

    private final ReceiptRnsRequestService rnsRequestService;
    private final ReceiptRnvRequestService rnvRequestService;
    private final RegisterRnsRequestService registerRnsService;
    private final RegisterRnvRequestService registerRnvService;
    private final GetCadastrialPlanRequestService getCadastrialPlanRequestService;
    private final SmevMessageService storageService;

    public Smev3RequestController(ReceiptRnsRequestService rnsRequestService,
                                  ReceiptRnvRequestService rnvRequestService,
                                  RegisterRnsRequestService registerRnsService,
                                  RegisterRnvRequestService registerRnvService,
                                  GetCadastrialPlanRequestService getCadastrialPlanRequestService,
                                  SmevMessageService storageService) {
        this.rnsRequestService = rnsRequestService;
        this.rnvRequestService = rnvRequestService;
        this.registerRnsService = registerRnsService;
        this.registerRnvService = registerRnvService;
        this.getCadastrialPlanRequestService = getCadastrialPlanRequestService;
        this.storageService = storageService;
    }

    /**
     * Получить мету запроса по ИД
     */
    @GetMapping("/request/meta/{id}")
    public ResponseEntity<XmlBuildMeta> getMeta(@PathVariable UUID id) {
        return ResponseEntity.ok(storageService.getMeta(id));
    }

    /**
     * Отправить запрос в ЕГРН для получения КПТ
     */
    @PostMapping("/request/egrn")
    public ResponseEntity<XmlBuildMeta> getCadastrialPlan(@RequestBody OrderKptDto body) {
        body.getOrder().stream()
                .map(s -> {
                    getCadastrialPlanRequestService.validateCadastrialNumber(s);
                    s = "Request_" + s.replace(":", "_") + ".zip";
                    return s;
                }).forEach(s -> {
            var dto = new GetCadastrialPlanDto();
            dto.setArchiveFilename(s);
            getCadastrialPlanRequestService.sendRequest(dto);
        });

        return ResponseEntity.ok().build();
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rnv
     */
    @PostMapping("/request/receipt-rnv")
    public ResponseEntity<XmlBuildMeta> requestReceiptRnv(@RequestBody ReceiptRnvRequestDto rnvRequestDto) {
        var response = rnvRequestService.sendRequest(rnvRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rns
     */
    @PostMapping("/request/receipt-rns")
    public ResponseEntity<XmlBuildMeta> requestReceiptRns(@RequestBody ReceiptRnsRequestDto rnsRequestDto) {
        var response = rnsRequestService.sendRequest(rnsRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/register-rns
     */
    @PostMapping("/request/register-rns")
    public ResponseEntity<XmlBuildMeta> requestReceiptRns(@RequestBody RegisterRnsRequestDto rnsRequestDto) {
        var response = registerRnsService.sendRequest(rnsRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/register-rnv
     */
    @PostMapping("/request/register-rnv")
    public ResponseEntity<XmlBuildMeta> requestReceiptRnv(@RequestBody RegisterRnvRequestDto rnvRequestDto) {
        var response = registerRnvService.sendRequest(rnvRequestDto);

        return ResponseEntity.ok(response);
    }
}
