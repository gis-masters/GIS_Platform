package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.DataSection13;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * DataSection13 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class DataSection13Aggregator implements CrimeaAggregator<DataSection13> {

    private final EventRepositoryService repositoryService;

    @Override
    public DataSection13 aggregate(DataSection13 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {

        crimeaObject.setOrgName(repositoryService.findGuidByRef("supplier_data_connection", event));
        crimeaObject.setTerritoryKey(repositoryService.findGuidByName("territorykey", event));
        crimeaObject.setInboxDataKey(repositoryService.findGuidByRef("inbox_data_key_data_connection", event));
        crimeaObject.setSupplierEmployee(repositoryService.findGuidByRef("supplieremploey_data_connection", event));

        crimeaObject.setDeveloper(repositoryService.findGuidByRef("developer_data_connection", event));
        crimeaObject.setTerminationReason(repositoryService.findGuidByRef("termination_reason", event));

        crimeaObject.setEasement(repositoryService.findAllValuesByName("easement", "easement_plot_guid", event));
        crimeaObject.setLandPlot(repositoryService.findAllValuesByName("landplot", "landplot_plot_guid", event));
        crimeaObject.setOks(repositoryService.findAllValuesByName("oks", "oks_plot_guid", event));

        crimeaObject.setGuidDocPreviousVersion(repositoryService.findAllGuidsByRef("guiddocpreviousversion", event));

        return crimeaObject;
    }
}
