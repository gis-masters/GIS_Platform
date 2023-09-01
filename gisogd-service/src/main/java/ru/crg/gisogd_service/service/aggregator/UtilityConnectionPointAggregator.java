package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.Customer;
import ru.crg.gisogd_service.model.rf.UtilityConnectionPoint;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * UtilityConnectionPoint aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class UtilityConnectionPointAggregator implements CrimeaAggregator<UtilityConnectionPoint> {

    private final EventRepositoryService repositoryService;

    @Override
    public UtilityConnectionPoint aggregate(UtilityConnectionPoint crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSource(repositoryService.findValueByName("dl_data_section", "guid", event));

        return crimeaObject;
    }
}
