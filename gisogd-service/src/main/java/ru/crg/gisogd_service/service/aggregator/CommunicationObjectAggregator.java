package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.CommunicationObject;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * CommunicationObject aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class CommunicationObjectAggregator implements CrimeaAggregator<CommunicationObject> {

    private final EventRepositoryService repositoryService;

    @Override
    public CommunicationObject aggregate(CommunicationObject crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSource(repositoryService.findValueByName("dl_data_section", "guid", event));

        return crimeaObject;
    }
}
