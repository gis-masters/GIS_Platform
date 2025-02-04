package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.data_service_contract.dto.FgisTpDocument;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class FgisTpDocumentsConfig {

    List<String> baseLayers = List.of(
            "Education",
            "Culture",
            "Sport",
            "Health",
            "Social",
            "Recreation",
            "Resort,",
            "AuthorityService",
            "Public",
            "WasteFacility",
            "RailwayLine",
            "RailwayFacility",
            "Road",
            "Street",
            "StreetV",
            "TranspLogisticObj",
            "PublicTransportObj",
            "PublicTransportService",
            "AutoService",
            "PublicTransportLine",
            "PublicTransportStops",
            "AirTransportObj",
            "WaterTransportObj",
            "WaterWays",
            "TransportObj",
            "ElectricPowerStation",
            "ElectricTransformer",
            "ElectricLine",
            "Pipeline",
            "GasFacility",
            "GasPipeline",
            "OilFacility",
            "OilPipeline",
            "ThermalFacility",
            "ThermalPipeline",
            "WaterFacility",
            "WaterPipeline",
            "SewerFacility",
            "SewerPipeline",
            "TelecomFacility",
            "TelecomNetworkLine",
            "HydraulicStructures",
            "EngProtectionObj",
            "EmergencyProtectionObj",
            "Cemetery",
            "WildlifeProtection",
            "OtherObject",
            "FunctionalZone",
            "ResortArea",
            "AreaBaseDevelopment",
            "GreeneryPlanting"
    );

    @Bean
    public Map<String, FgisTpDocument> fgisTpDocuments() {
        Map<String, FgisTpDocument> data = new HashMap<>();

        data.put("Doc.20204010000",
                 new FgisTpDocument("Генеральные планы поселений и генеральные планы городских округов",
                                    baseLayers));

        data.put("Doc.20201010000",
                 new FgisTpDocument("Проекты генеральных планов поселений и генеральных планов городских округов",
                                    baseLayers));

        List<String> protectionZone = new ArrayList<>(List.of(
                // SpecialZoneCollection. Зоны с особыми условиями использования территорий
                "SanitaryProtectionZone",
                "TranspSanitaryGapZone",
                "TranspProtectionZone",
                "EngSanitaryGapZone",
                "EngProtectionZone",
                "NatureProtectionZone",
                "DrinkWaterProtectionZone",
                "OtherZone",
                "ResortProtectionZone"
        ));

        data.put("Doc.20201010315",
                 new FgisTpDocument(
                         "Проекты генеральных планов поселений и генеральных планов городских округов с зонами",
                         baseLayers,
                         protectionZone));

        List<String> customLayers = new ArrayList<>(List.copyOf(baseLayers));
        customLayers.addAll(List.of(
                "AdmeMO",
                "AdmeNP",
                "Heritage",
                "HeritageArea",
                "HistoricSettlement",
                "Agriculture",
                "Manufacturing",
                "ServiceFacility",
                "WasteFacility",
                "InvestmentZone",
                "MineralArea",
                "MineralDep",
                "Hydro",
                "NatureProtectArea",
                "HazardArea",
                "NaturalRiskZone",
                "TechnoRiskArea",
                "TraditionalArea",
                "CoastalProtectionZone",
                "FishProtectionZone",
                "FloodArea",
                "Foreshore",
                "HeritageProtectionZone",
                "OtherProtectionZone",
                "ProtectionZone",
                "WaterProtectionZone",
                "CustomControl",
                "EnvMonitoring",
                "Prison"
        ));

        data.put("Doc.20201010314",
                 new FgisTpDocument("Наша дополненная схема", customLayers));

        return data;
    }
}
