package ru.mycrg.gis.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.OrganizationRepository;
import ru.mycrg.gis.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class ImportService {

    private static Logger log = LoggerFactory.getLogger(ImportService.class);

    private final MqSender mqSender;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    private List<ImportProcess> importProcesses = new ArrayList<>();

    public ImportService(MqSender mqSender,
                         UserRepository userRepository,
                         OrganizationRepository organizationRepository) {
        this.mqSender = mqSender;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    // TODO: чтобы избежать лишних хожденияй в БД можно было бы на UI отдавать имя БД
    // А может в будущем имя БД будет на UI, по другой причине, тогда здесь можно упростить
    public CompletableFuture<Map<String, String>> initProcess(WorkImport workImport, String userName) {
        User user = userRepository
                .findUserByUsername(userName)
                .orElseThrow(() -> new EntityNotFoundException("Not found user by name: " + userName));

        // Добираемся до организации пользователя, чтобы подглядеть название БД
        Organization organization = organizationRepository
                .findOrganizationByUsersContaining(user)
                .orElseThrow(() -> new EntityNotFoundException("Not found user organization"));

        ImportProcess process = new ImportProcess(workImport);
        importProcesses.add(process);

        workImport.getImportTasks().forEach(importTask -> {
            ImportMqRequest importMqRequest = new ImportMqRequest(
                    process.getId(),
                    // На данный момент источником для рабочего импорта является общее хранилище "scratch_workspace"
                    new ResourceProjection("gis", "public", importTask.getLayerName()),
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

    public void progress(ImportMqResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<ImportProcess> processById = getProcessById(response.getId());
        if (processById.isPresent()) {
            ImportProcess process = processById.get();
            process.addResponse(response);
        } else {
            log.warn("Not found import process by id: {}", response.getId());
        }
    }

    private Optional<ImportProcess> getProcessById(UUID id) {
        return importProcesses.stream()
                .filter(importProcess -> importProcess.getId().equals(id))
                .findFirst();
    }

}
