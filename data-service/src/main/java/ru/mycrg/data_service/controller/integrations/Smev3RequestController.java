package ru.mycrg.data_service.controller.integrations;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.smev3.*;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsResponseService;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvResponseService;
import ru.mycrg.data_service.service.smev3.request.register_rns.RegisterRnsRequestService;
import ru.mycrg.data_service.service.smev3.request.register_rnv.RegisterRnvRequestService;
import ru.mycrg.data_service.service.smev3.request.terminate_rns.TerminateRnsRequestService;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
@RequestMapping("/integration/smev3/request")
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class Smev3RequestController {

    private final ReceiptRnsRequestService rnsRequestService;
    private final ReceiptRnsResponseService rnsResponseService;
    private final ReceiptRnvRequestService rnvRequestService;
    private final ReceiptRnvResponseService rnvResponseService;
    private final RegisterRnsRequestService registerRnsService;
    private final RegisterRnvRequestService registerRnvService;
    private final TerminateRnsRequestService trminateRnsRequestService;
    private final GetCadastrialPlanRequestService getCadastrialPlanRequestService;
    private final SmevMessageService storageService;

    public Smev3RequestController(ReceiptRnsRequestService rnsRequestService,
                                  ReceiptRnsResponseService rnsResponseService,
                                  ReceiptRnvRequestService rnvRequestService,
                                  ReceiptRnvResponseService rnvResponseService,
                                  RegisterRnsRequestService registerRnsService,
                                  RegisterRnvRequestService registerRnvService,
                                  TerminateRnsRequestService trminateRnsRequestService,
                                  GetCadastrialPlanRequestService getCadastrialPlanRequestService,
                                  SmevMessageService storageService) {
        this.rnsRequestService = rnsRequestService;
        this.rnsResponseService = rnsResponseService;
        this.rnvRequestService = rnvRequestService;
        this.rnvResponseService = rnvResponseService;
        this.registerRnsService = registerRnsService;
        this.registerRnvService = registerRnvService;
        this.trminateRnsRequestService = trminateRnsRequestService;
        this.getCadastrialPlanRequestService = getCadastrialPlanRequestService;
        this.storageService = storageService;
    }

    /**
     * Получить мету запроса по ИД
     */
    @GetMapping("/meta/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<XmlBuildMeta> getMeta(@PathVariable UUID id) {
        return ResponseEntity.ok(storageService.getMeta(id));
    }

    /**
     * Отправить запрос в ЕГРН для получения КПТ
     */
    @PostMapping("/egrn")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> getCadastrialPlan(@RequestBody OrderKptDto body) {
        Map<String, String> clientIdToCadastrialNumber = new HashMap<>();
        body.getOrder().forEach(cadastrialNumber -> {
            throwIfCadastrialNumberNotValid(cadastrialNumber);
            clientIdToCadastrialNumber.put(UUID.randomUUID().toString(), cadastrialNumber);
        });

        String joinedCadastrialNumbers = String.join(", ", body.getOrder());
        IRecord task = getCadastrialPlanRequestService.createTask(joinedCadastrialNumbers);
        IRecord folder = getCadastrialPlanRequestService.createFolder(joinedCadastrialNumbers, task);
        getCadastrialPlanRequestService.createLog("Создание новой папки",
                "Создана папка с кадастровыми номерами " + joinedCadastrialNumbers,
                folder.getContent(),
                task.getId());

        clientIdToCadastrialNumber.forEach((clientId, cadastrialNumber) -> {
            IRecord doc = getCadastrialPlanRequestService.createDoc(clientId, cadastrialNumber, folder.getId());
            getCadastrialPlanRequestService.createLog("Создание нового документа",
                    "Создан документ с кадастровым номером " + cadastrialNumber,
                    doc.getContent(),
                    task.getId());
        });

        clientIdToCadastrialNumber.forEach((clientId, cadastrialNumber) -> {
            GetCadastrialPlanDto dto = new GetCadastrialPlanDto();
            dto.setClientId(clientId);
            dto.setCadastrialNumber(cadastrialNumber);
            getCadastrialPlanRequestService.sendRequest(dto);
        });

        return ResponseEntity.ok().build();
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rns
     */
    @PostMapping("/receipt-rns")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<XmlBuildMeta> receiptRns(@RequestBody ReceiptRnsRequestDto rnsRequestDto) {
        //TODO временно
        if (rnsRequestDto.getTestBase64() != null) {
            var b64 = Base64.getDecoder().decode(rnsRequestDto.getTestBase64());
            rnsResponseService.processMessageFromSmev(new String(b64));
            return null;
        } else {
            var response = rnsRequestService.sendRequest(rnsRequestDto);
            return ResponseEntity.ok(response);
        }
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rnv
     */
    @PostMapping("/receipt-rnv")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<XmlBuildMeta> requestReceiptRnv(@RequestBody ReceiptRnvRequestDto rnvRequestDto) {
        //TODO временно
        if (rnvRequestDto.getTestBase64() != null) {
            var b64 = Base64.getDecoder().decode(rnvRequestDto.getTestBase64());
            rnvResponseService.processMessageFromSmev(new String(b64));
            return null;
        } else {
            var response = rnvRequestService.sendRequest(rnvRequestDto);
            return ResponseEntity.ok(response);
        }
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/register-rns
     */
    @PostMapping("/register-rns")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<XmlBuildMeta> registerRns(@RequestBody RegisterRnsRequestDto rnsRequestDto) {
        var response = registerRnsService.sendRequest(rnsRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/register-rnv
     */
    @PostMapping("/register-rnv")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<XmlBuildMeta> registerRnv(@RequestBody RegisterRnvRequestDto rnvRequestDto) {
        var response = registerRnvService.sendRequest(rnvRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/terminate-rns
     */
    @PostMapping("/terminate-rns")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<XmlBuildMeta> requestTerminateRns(@RequestBody TerminateRnsRequestDto terminateRnsRequestDto) {
        var response = trminateRnsRequestService.sendRequest(terminateRnsRequestDto);

        return ResponseEntity.ok(response);
    }

    private void throwIfCadastrialNumberNotValid(String number) {
        Pattern cadNumPattern = Pattern.compile("\\d{2}:\\d{2}:\\d{6}");
        Matcher matcher = cadNumPattern.matcher(number);
        if (!matcher.matches()) {
            throw new BadRequestException("Передан невалидный кадастровый номер: " + number);
        }
    }
}
