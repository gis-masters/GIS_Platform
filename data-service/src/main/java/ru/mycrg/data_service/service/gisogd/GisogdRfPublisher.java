package ru.mycrg.data_service.service.gisogd;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dao.SchemableRecordsDao;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.LandPlot;
import ru.mycrg.gisog_service_contract.dto.Territory;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.TASK;

@Service
public class GisogdRfPublisher {

    private final BaseDao baseDao;
    private final GisogdRfDao gisogdRfDao;
    private final SchemableRecordsDao recordsDao;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;

    public GisogdRfPublisher(BaseDao baseDao,
                             GisogdRfDao gisogdRfDao,
                             SchemableRecordsDao recordsDao,
                             IMessageBusProducer messageBus,
                             IAuthenticationFacade authenticationFacade) {
        this.baseDao = baseDao;
        this.recordsDao = recordsDao;
        this.gisogdRfDao = gisogdRfDao;
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
    }

    public Long publish(ResourceQualifier qualifier) {
        IRecord document = recordsDao
                .findById(qualifier)
                .orElseThrow(() -> new DataServiceException("Не найден документ: " + qualifier.toString()));

        IRecord inboxData = fetchInbox(qualifier, document);

        Territory territory = null;
        LandPlot landPlot = null;
        Optional<LandPlot> oLandPlot = gisogdRfDao.fetchLandPlot(qualifier);
        if (oLandPlot.isPresent()) {
            landPlot = oLandPlot.get();
            territory = new Territory(landPlot.getGuid(), landPlot.getLocation());
        }

        messageBus.produce(
                new PublishToGisogdRfEvent(authenticationFacade.getAccessToken(),
                                           document.getContent(),
                                           inboxData.getContent(),
                                           territory,
                                           landPlot));

        // TODO: create task and return id
        return -314L;
    }

    private IRecord fetchInbox(ResourceQualifier qualifier, IRecord record) {
        String inboxDataKey = record.getAsString("inbox_data_key");
        if (inboxDataKey == null) {
            throw new DataServiceException("Поле inbox_data_key не заполнено для объекта: " + qualifier.toString());
        }

        return baseDao.findBy(new ResourceQualifier(SYSTEM_SCHEMA_NAME, "tasks", inboxDataKey, TASK),
                              String.format("guid = '%s'", inboxDataKey));
    }

}
