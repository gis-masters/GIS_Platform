package ru.mycrg.gis.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.OrganizationRepository;
import ru.mycrg.gis.repository.UserRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.CrgProcess;
import ru.mycrg.gis.service.WsNotificationService;

import javax.persistence.EntityNotFoundException;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static ru.mycrg.gis.enums.ProcessType.IMPORT;

@Service
public class ImportService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ImportService.class);

    private final MqSender mqSender;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final WsNotificationService wsNotificationService;

    public ImportService(MqSender mqSender,
                         UserRepository userRepository,
                         WsNotificationService wsNotificationService,
                         OrganizationRepository organizationRepository) {
        this.mqSender = mqSender;
        this.userRepository = userRepository;
        this.wsNotificationService = wsNotificationService;
        this.organizationRepository = organizationRepository;
    }

    // TODO: чтобы избежать лишних хожденияй в БД можно было бы на UI отдавать имя БД
    // А может в будущем имя БД будет на UI, по другой причине, тогда здесь можно упростить
    public CompletableFuture<BaseMqProcessResponse> initProcess(WorkImport workImport, String userName) {
        User user = userRepository
                .findUserByUsername(userName)
                .orElseThrow(() -> new EntityNotFoundException("Not found user by name: " + userName));

        // Добираемся до организации пользователя, чтобы подглядеть название БД
        Organization organization = organizationRepository
                .findOrganizationByUsersContaining(user)
                .orElseThrow(() -> new EntityNotFoundException("Not found user organization"));

        CrgProcess process = new CrgProcess();
        processes.add(process);

        workImport.getImportTasks().forEach(importTask -> {
            ImportMqRequest importMqRequest = new ImportMqRequest(
                    process.getId(),
                    // Источником для рабочего импорта является общее хранилище "scratch"
                    new ResourceProjection(
                            "database_" + organization.getId(),
                            "public",
                            importTask.getLayerName()),
                    // БД организации это шаблонное название "database" + ID организвции
                    new ResourceProjection(
                            "database_" + organization.getId(),
                            workImport.getTargetSchema(),
                            importTask.getWorkTableName()),
                    importTask.getMapping());

            mqSender.initImport(importMqRequest);
        });

        return process.getFutureResponse();
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<CrgProcess> processById = getProcessById(response.getId());
        if (processById.isPresent()) {
            CrgProcess process = processById.get();
            wsNotificationService.send(new WsMessageDto<>(IMPORT, response), process.getRequest().getWsUiId());

            process.complete(response);
        } else {
            log.warn("Not found gml process by id: {}", response.getId());
        }
    }
}
