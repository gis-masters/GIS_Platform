package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.ForestDistrict;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * Forestry aggregator.
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class ForestDistrictAggregator implements CrimeaAggregator<ForestDistrict> {

    private final EventRepositoryService repositoryService;

    @Override
    public ForestDistrict aggregate(ForestDistrict crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setForestry(repositoryService.findValueByName("forestry", "guid_forestry", event));

        return crimeaObject;
    }
}
