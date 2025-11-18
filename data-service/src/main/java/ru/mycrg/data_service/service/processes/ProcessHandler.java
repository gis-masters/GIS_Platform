package ru.mycrg.data_service.service.processes;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.concurrent.DelegatingSecurityContextRunnable;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.ProcessDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service_contract.dto.ImportLayerReport;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE_WITH_WARNINGS;

@Component
public class ProcessHandler {

    private final Logger log = LoggerFactory.getLogger(ProcessHandler.class);

    private final ProcessService processService;
    private final IAuthenticationFacade authenticationFacade;
    private final Map<ProcessType, IProcessExecutorsFactory> executorFactories;

    public ProcessHandler(ProcessService processService,
                          IAuthenticationFacade authenticationFacade,
                          List<IProcessExecutorsFactory> processHandlers) {
        this.processService = processService;
        this.authenticationFacade = authenticationFacade;

        this.executorFactories = processHandlers.stream()
                                                .collect(toMap(IProcessExecutorsFactory::getType, Function.identity()));
    }

    public Process handle(ProcessDto model) {
        ProcessType processType = ProcessType.valueOf(model.getType());
        IProcessExecutorsFactory executorsFactory = executorFactories.get(processType);
        if (executorsFactory == null) {
            throw new BadRequestException("Задан не поддерживаемый тип процесса: " + processType);
        }

        IExecutor<?> executor = executorsFactory.getExecutor(model);

        try {
            String databaseName = getDefaultDatabaseName(authenticationFacade.getOrganizationId());
            Process process = processService.create(authenticationFacade.getLogin(),
                                                    processType.name(),
                                                    processType,
                                                    model.getPayload());

            log.debug("Создан процесс: '{}'", process.getId());

            try {
                executor.initialize(model.getPayload())
                        .setPayload(new ProcessModel(process.getId(), databaseName))
                        .validate();
            } catch (BadRequestException e) {
                log.warn("Валидация процесса провалилась!");
                executor.cleanup();

                process.setDetails(toJsonNode(executor.getReport()));
                processService.error(databaseName, process.getId(), process.getDetails());

                return process;
            }

            SecurityContext securityContext = SecurityContextHolder.getContext();
            DelegatingSecurityContextRunnable wrappedRunnable = new DelegatingSecurityContextRunnable(() -> {
                execute(executor, databaseName, process.getId());
            }, securityContext);
            new Thread(wrappedRunnable).start();

            return process;
        } catch (BadRequestException e) {
            String msg = "Не удалось создать процесс => " + e.getMessage();
            executor.cleanup();

            log.error(msg, e);

            throw new BadRequestException(msg);
        } catch (Exception e) {
            String msg = "Не удалось создать процесс => " + e.getMessage();
            executor.cleanup();

            log.error(msg, e);

            throw new DataServiceException(msg, e.getCause());
        }
    }

    private void execute(IExecutor<?> executor, String databaseName, Long processId) {
        if (processId == null) {
            return;
        }

        try {
            Object result = executor.execute();

            if (!executor.notDetached()) {
                log.debug("Процесс detached завершен");

                return;
            }

            log.debug("Процесс notDetached завершен");
            processService.updateProcess(processId,
                                         defineFinalStatus(processId, result),
                                         databaseName,
                                         toJsonNode(result));
        } catch (Exception e) {
            String msg = "Выполнение процесса потерпело неудачу. Причина: " + e.getMessage();

            log.error(msg, e.getCause(), e);
            executor.cleanup();

            processService.error(databaseName, processId, toJsonNode(executor.getReport()));
        }
    }

    @NotNull
    private ProcessStatus defineFinalStatus(Long processId, Object result) {
        if (result instanceof ImportReport) {
            ImportReport importReport = (ImportReport) result;
            List<ImportLayerReport> reports = importReport.getImportLayerReports();
            if (reports == null || reports.isEmpty()) {
                log.warn("Отчет процесса '{}' не имеет данных о слоях", processId);

                return DONE;
            }

            long failedLayersCount = reports.stream().filter(r -> !r.isSuccess()).count();
            if (failedLayersCount > 0) {
                log.debug("Процесс '{}' завершен с предупреждениями", processId);

                return DONE_WITH_WARNINGS;
            }
        } else {
            log.warn("Процесс '{}' не сформировал ожидаемый ImportReport", processId);
        }

        return DONE;
    }
}
