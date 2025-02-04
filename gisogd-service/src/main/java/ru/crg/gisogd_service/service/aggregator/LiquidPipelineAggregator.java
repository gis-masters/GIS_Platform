package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.LiquidPipeline;
import ru.crg.gisogd_service.model.rf.WaterSupplyNetwork;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * LiquidPipeline aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class LiquidPipelineAggregator implements CrimeaAggregator<LiquidPipeline> {

    private final EventRepositoryService repositoryService;

    @Override
    public LiquidPipeline aggregate(LiquidPipeline crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSource(repositoryService.findValueByName("dl_data_section", "guid", event));

        return crimeaObject;
    }
}
