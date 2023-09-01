package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.UDRIZS;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * UDRIZS aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class UdrizsAggregator implements CrimeaAggregator<UDRIZS> {

    private final EventRepositoryService repositoryService;

    @Override
    public UDRIZS aggregate(UDRIZS crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSection13(repositoryService.findGuidByRef("dl_data_section13_data_connection", event));

        return crimeaObject;
    }
}
