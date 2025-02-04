package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.ElectricPowerObject;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * ElectricPowerObject aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class ElectricPowerObjectAggregator implements CrimeaAggregator<ElectricPowerObject> {

    private final EventRepositoryService repositoryService;

    @Override
    public ElectricPowerObject aggregate(ElectricPowerObject crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSource(repositoryService.findValueByName("dl_data_section", "guid", event));

        return crimeaObject;
    }
}
