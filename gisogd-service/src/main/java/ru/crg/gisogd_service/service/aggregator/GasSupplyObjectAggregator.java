package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.GasSupplyObject;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * GasSupplyObject aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class GasSupplyObjectAggregator implements CrimeaAggregator<GasSupplyObject> {

    private final EventRepositoryService repositoryService;

    @Override
    public GasSupplyObject aggregate(GasSupplyObject crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSource(repositoryService.findValueByName("dl_data_section", "guid", event));

        return crimeaObject;
    }
}
