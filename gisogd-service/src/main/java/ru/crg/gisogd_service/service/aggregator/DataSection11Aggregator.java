package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.DataSection11;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * DataSection11 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class DataSection11Aggregator implements CrimeaAggregator<DataSection11> {

    private final EventRepositoryService repositoryService;

    @Override
    public DataSection11 aggregate(DataSection11 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {

        crimeaObject.setOrgName(repositoryService.findGuidByRef("supplier_data_connection", event));
        crimeaObject.setTerritoryKey(repositoryService.findGuidByName("territorykey", event));
        crimeaObject.setInboxDataKey(repositoryService.findGuidByRef("inbox_data_key_data_connection", event));
        crimeaObject.setSupplierEmployee(repositoryService.findGuidByRef("supplieremploey_data_connection", event));
        crimeaObject.setGuidDocPreviousVersion(repositoryService.findAllGuidsByRef("guiddocpreviousversion", event));

        crimeaObject.setPowerLines(repositoryService.findValueByName("power_lines", "guid_power_lines", event));
        crimeaObject.setPipeline(repositoryService.findValueByName("pipeline", "guid_pipeline", event));
        crimeaObject.setWaterDisposalObject(repositoryService.findValueByName("water_disposal", "guid_water_disposal_object", event));
        crimeaObject.setWaterSupplyObject(repositoryService.findValueByName("water_supply_object", "guid_water_supply_object", event));
        crimeaObject.setGasSupplyObject(repositoryService.findValueByName("gas_suply_object", "guid_gas_suply_object", event));
        crimeaObject.setOilSupplyObject(repositoryService.findValueByName("oil_supply_object", "guid_oil_supply_object", event));
        crimeaObject.setCommunicationObject(repositoryService.findValueByName("communication_object", "guid_communication_object", event));
        crimeaObject.setHeatSupplyObject(repositoryService.findValueByName("heat_supply_object", "guid_heat_supply_object", event));
        crimeaObject.setElectricPowerObject(repositoryService.findValueByName("electric_power_object", "guid_electric_power_object", event));
        crimeaObject.setGasPipeline(repositoryService.findValueByName("gas_pipeline", "guid_gas_pipeline", event));
        crimeaObject.setWaterDisposalNetwork(repositoryService.findValueByName("water_disposal_network", "guid_water_disposal_network", event));
        crimeaObject.setWaterSupplyNetwork(repositoryService.findValueByName("water_supply_network", "guid_water_supply_network", event));
        crimeaObject.setHeatSupplyNetwork(repositoryService.findValueByName("heat_supply_network", "guid_heat_supply_network", event));
        crimeaObject.setTelecomNetwork(repositoryService.findValueByName("telecom_network", "guid_telecom_network", event));
        crimeaObject.setUtilityConnectionPoint(repositoryService.findValueByName("utility_connection_point", "guid_utility_connection_point", event));
        crimeaObject.setLiquidPipeline(repositoryService.findValueByName("liquid_pipeline", "guid_liquid_pipeline", event));

        return crimeaObject;
    }
}
