package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.GasPipeline;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * GasPipeline aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class GasPipelinaAggregator implements CrimeaAggregator<GasPipeline> {

    private final EventRepositoryService repositoryService;

    @Override
    public GasPipeline aggregate(GasPipeline crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSource(repositoryService.findValueByName("dl_data_section", "guid", event));

        return crimeaObject;
    }
}
