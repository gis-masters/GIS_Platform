package ru.mycrg.data_service.service.gisogd;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.gisog_service_contract.AuditGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.CONTENT_TYPE_ID;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.GUID;

@Service
public class GisogdRfAuditor {

    private final Logger log = LoggerFactory.getLogger(GisogdRfAuditor.class);

    private final BaseReadDao baseDao;
    private final GisogdRfDao gisogdRfDao;
    private final GisogdRfUtil gisogdRfUtil;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;

    public GisogdRfAuditor(BaseReadDao baseDao,
                           GisogdRfDao gisogdRfDao,
                           GisogdRfUtil gisogdRfUtil,
                           IMessageBusProducer messageBus,
                           IAuthenticationFacade authenticationFacade) {
        this.baseDao = baseDao;
        this.gisogdRfDao = gisogdRfDao;
        this.messageBus = messageBus;
        this.gisogdRfUtil = gisogdRfUtil;
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * Аудит документа.
     * <p>
     * На аудит уходят только документы имеющие статус "В процессе синхронизации". Сам статус это генерируемая колонка
     * см. GisogdRfSyncStatusFormulaGenerator.
     *
     * @param qualifier Квалификатор ресурса.
     */
    public void audit(ResourceQualifier qualifier) {
        baseDao.findById(qualifier)
               .ifPresentOrElse(parent -> audit(qualifier, parent), () -> {
                   throw new DataServiceException("Не найден документ: " + qualifier.getQualifier());
               });
    }

    public void fullAudit(Long limit) {
        gisogdRfUtil.getSchemasPreparedForGisogdRf()
                    .stream()
                    .flatMap(schemaId -> gisogdRfUtil.collectGisogdRfEntities(schemaId).stream())
                    .filter(gisogdData -> gisogdData.getPublishOrder() >= 0)
                    .sorted(Comparator.comparing(GisogdData::getPublishOrder))
                    .forEach(gisogdEntity -> auditAll(gisogdEntity.getResourceQualifier(), limit));

        log.debug("Полный аудит завершен");
    }

    private void audit(ResourceQualifier qualifier, IRecord parent) {
        String syncStatus = getParameterOrThrow(parent, "gisogdrf_sync_status");
        if (!"В процессе синхронизации".equals(syncStatus)) {
            log.info("Документ: '{}' не нуждается в аудите. Последний ответ от ГИСОГД РФ: [{}]",
                     qualifier.getQualifier(), parent.getContent().getOrDefault("gisogdrf_response", null));

            return;
        }

        Optional<String> oGuid = getParameter(parent, GUID.getName());
        if (oGuid.isEmpty()) {
            log.info("У документа: '{}' не заполнен guid!", qualifier.getQualifier());

            return;
        }

        UUID guid = UUID.fromString(oGuid.get());
        AuditGisogdRfEvent event = new AuditGisogdRfEvent(
                authenticationFacade.getOrganizationId(),
                new Document(guid,
                             qualifier.getSchema(),
                             qualifier.getTable(),
                             parent.getAsString(CONTENT_TYPE_ID.getName()),
                             parent.getContent())
        );

        log.debug("Send document to audit: [{}]", qualifier.getQualifier() + " - " + guid);

        messageBus.produce(event);
    }

    private void auditAll(ResourceQualifier qualifier, Long limit) {
        List<IRecord> documents = gisogdRfDao.findAllForAudit(qualifier, limit);
        if (documents.isEmpty()) {
            return;
        }

        String resQualifier = qualifier.getQualifier();
        StopWatch auditWatcher = new StopWatch("Аудит: " + resQualifier);
        log.debug("Начинаю аудит [{}] с лимитом: {}. Найдено: {} записей", resQualifier, limit, documents.size());

        documents.forEach(doc -> audit(qualifier, doc));

        auditWatcher.stop();
        log.debug("Конец аудита [{}] \n Затрачено времени: {}", resQualifier, auditWatcher.prettyPrint());
    }

    @NotNull
    private String getParameterOrThrow(IRecord parent, String paramName) {
        String parameter = parent.getAsString(paramName);
        if (parameter == null) {
            String msg = "В документе не найдено поле: " + paramName;
            log.debug(msg);

            throw new BadRequestException(msg);
        }

        return parameter;
    }

    private Optional<String> getParameter(IRecord parent, String paramName) {
        return Optional.ofNullable(parent.getAsString(paramName));
    }
}
