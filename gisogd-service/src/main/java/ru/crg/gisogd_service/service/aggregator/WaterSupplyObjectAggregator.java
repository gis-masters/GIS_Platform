package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.WaterDisposalObject;
import ru.crg.gisogd_service.model.rf.WaterSupplyObject;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * WaterSupplyObject aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class WaterSupplyObjectAggregator implements CrimeaAggregator<WaterSupplyObject> {

    private final EventRepositoryService repositoryService;

    @Override
    public WaterSupplyObject aggregate(WaterSupplyObject crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSource(repositoryService.findValueByName("dl_data_section", "guid", event));

        return crimeaObject;
    }
}
