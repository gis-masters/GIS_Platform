package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.DataSection17;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * DataSection17 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class DataSection17Aggregator implements CrimeaAggregator<DataSection17> {

    private final EventRepositoryService repositoryService;

    @Override
    public DataSection17 aggregate(DataSection17 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {

        crimeaObject.setOrgName(repositoryService.findGuidByRef("supplier_data_connection", event));
        crimeaObject.setTerritoryKey(repositoryService.findGuidByName("territorykey", event));
        crimeaObject.setInboxDataKey(repositoryService.findGuidByRef("inbox_data_key_data_connection", event));
        crimeaObject.setSupplierEmployee(repositoryService.findGuidByRef("supplieremploey_data_connection", event));
        crimeaObject.setGuidDocPreviousVersion(repositoryService.findAllGuidsByRef("guiddocpreviousversion", event));

        crimeaObject.setLandPlot(repositoryService.findValueByName("landplot", "landplot_plot_guid", event));
        crimeaObject.setOKS(repositoryService.findValueByName("oks", "oks_plot_guid", event));
        crimeaObject.setDeveloper(repositoryService.findGuidByRef("developer_data_connection", event));

        return crimeaObject;
    }
}
