package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.DataSection16;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * DataSection16 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class DataSection16Aggregator implements CrimeaAggregator<DataSection16> {

    private final EventRepositoryService repositoryService;

    @Override
    public DataSection16 aggregate(DataSection16 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {

        crimeaObject.setOrgName(repositoryService.findGuidByRef("supplier_data_connection", event));
        crimeaObject.setTerritoryKey(repositoryService.findGuidByName("territorykey", event));
        crimeaObject.setInboxDataKey(repositoryService.findGuidByRef("inbox_data_key_data_connection", event));
        crimeaObject.setSupplierEmployee(repositoryService.findGuidByRef("supplieremploey_data_connection", event));
        crimeaObject.setGuidDocPreviousVersion(repositoryService.findAllGuidsByRef("guiddocpreviousversion", event));

        crimeaObject.setForestPlot(repositoryService.findAllValuesByName("forest_land", "guid_forest_land", event));
        crimeaObject.setForestry(repositoryService.findAllValuesByName("forestry", "guid_forestry", event));

        return crimeaObject;
    }
}
