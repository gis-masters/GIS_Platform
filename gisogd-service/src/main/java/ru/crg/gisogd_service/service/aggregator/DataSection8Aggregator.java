package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.DataSection8;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * DataSection16 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class DataSection8Aggregator implements CrimeaAggregator<DataSection8> {

    private final EventRepositoryService repositoryService;

    @Override
    public DataSection8 aggregate(DataSection8 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {

        crimeaObject.setOrgName(repositoryService.findGuidByRef("supplier_data_connection", event));
        crimeaObject.setTerritoryKey(repositoryService.findGuidByName("territorykey", event));
        crimeaObject.setInboxDataKey(repositoryService.findGuidByRef("inbox_data_key_data_connection", event));
        crimeaObject.setSupplierEmployee(repositoryService.findGuidByRef("supplieremploey_data_connection", event));
        crimeaObject.setGuidDocPreviousVersion(repositoryService.findAllGuidsByRef("guiddocpreviousversion", event));
        crimeaObject.setResearchType(repositoryService.findAllValuesByName("research_type", "code", event));


        return crimeaObject;
    }
}
