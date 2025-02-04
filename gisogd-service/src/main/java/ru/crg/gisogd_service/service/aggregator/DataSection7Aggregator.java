package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.DataSection7;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * DataSection7 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class DataSection7Aggregator implements CrimeaAggregator<DataSection7> {

    private final EventRepositoryService repositoryService;

    @Override
    public DataSection7 aggregate(DataSection7 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {

        crimeaObject.setOrgName(repositoryService.findGuidByRef("supplier_data_connection", event));
        crimeaObject.setTerritoryKey(repositoryService.findGuidByName("territorykey", event));
        crimeaObject.setInboxDataKey(repositoryService.findGuidByRef("inbox_data_key_data_connection", event));
        crimeaObject.setSupplierEmployee(repositoryService.findGuidByRef("supplieremploey_data_connection", event));
        crimeaObject.setGuidDocPreviousVersion(repositoryService.findAllGuidsByRef("guiddocpreviousversion", event));

        crimeaObject.setElementPlanningStructure(
                repositoryService.findAllValuesByName("element_planning_structure", "guid_element_planning_structure", event));
        crimeaObject.setPublicTerritoryBorders(
                repositoryService.findAllValuesByName("public_territory_borders", "guid_public_territory_borders", event));
        crimeaObject.setConstructionZonesBorders(
                repositoryService.findAllValuesByName("construction_zones_borders", "guid_construction_zones_borders", event));
        crimeaObject.setRedLine(
                repositoryService.findAllValuesByName("red_line", "guid_red_line_line", event));
        crimeaObject.setFormedLand(
                repositoryService.findAllValuesByName("formed_land", "guid_formed_land", event));
        crimeaObject.setIndentLine(
                repositoryService.findAllValuesByName("indent_line", "guid_indent_line", event));
        crimeaObject.setEasement(
                repositoryService.findAllValuesByName("easement", "easement_plot_guid", event));

        return crimeaObject;
    }
}
