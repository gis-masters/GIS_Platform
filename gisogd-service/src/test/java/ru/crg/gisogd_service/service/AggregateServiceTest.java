package ru.crg.gisogd_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import ru.crg.gisogd_service.converter.RfObjectConverter;
import ru.crg.gisogd_service.model.rf.ArtLand;
import ru.crg.gisogd_service.model.rf.Citizen;
import ru.crg.gisogd_service.model.rf.CommunicationObject;
import ru.crg.gisogd_service.model.rf.ConstructionZonesBorders;
import ru.crg.gisogd_service.model.rf.Customer;
import ru.crg.gisogd_service.model.rf.DataSection1;
import ru.crg.gisogd_service.model.rf.DataSection10;
import ru.crg.gisogd_service.model.rf.DataSection11;
import ru.crg.gisogd_service.model.rf.DataSection12;
import ru.crg.gisogd_service.model.rf.DataSection13;
import ru.crg.gisogd_service.model.rf.DataSection14;
import ru.crg.gisogd_service.model.rf.DataSection15;
import ru.crg.gisogd_service.model.rf.DataSection16;
import ru.crg.gisogd_service.model.rf.DataSection17;
import ru.crg.gisogd_service.model.rf.DataSection18;
import ru.crg.gisogd_service.model.rf.DataSection2;
import ru.crg.gisogd_service.model.rf.DataSection3;
import ru.crg.gisogd_service.model.rf.DataSection4;
import ru.crg.gisogd_service.model.rf.DataSection5;
import ru.crg.gisogd_service.model.rf.DataSection6;
import ru.crg.gisogd_service.model.rf.DataSection7;
import ru.crg.gisogd_service.model.rf.DataSection8;
import ru.crg.gisogd_service.model.rf.DataSection9;
import ru.crg.gisogd_service.model.rf.Easement;
import ru.crg.gisogd_service.model.rf.ElectricPowerObject;
import ru.crg.gisogd_service.model.rf.ElementPlanningStructure;
import ru.crg.gisogd_service.model.rf.Escalators;
import ru.crg.gisogd_service.model.rf.ForestDistrict;
import ru.crg.gisogd_service.model.rf.ForestLand;
import ru.crg.gisogd_service.model.rf.ForestQuarter;
import ru.crg.gisogd_service.model.rf.Forestry;
import ru.crg.gisogd_service.model.rf.FormedLand;
import ru.crg.gisogd_service.model.rf.GPZU;
import ru.crg.gisogd_service.model.rf.GPZUInfoP23;
import ru.crg.gisogd_service.model.rf.GPZUInfoP24;
import ru.crg.gisogd_service.model.rf.GPZUInfoP25;
import ru.crg.gisogd_service.model.rf.GPZUInfoP41;
import ru.crg.gisogd_service.model.rf.GPZUInfoP6;
import ru.crg.gisogd_service.model.rf.GasPipeline;
import ru.crg.gisogd_service.model.rf.GasSupplyObject;
import ru.crg.gisogd_service.model.rf.HeatSupplyNetwork;
import ru.crg.gisogd_service.model.rf.HeatSupplyObject;
import ru.crg.gisogd_service.model.rf.InboxData;
import ru.crg.gisogd_service.model.rf.IndentLine;
import ru.crg.gisogd_service.model.rf.LandPlot;
import ru.crg.gisogd_service.model.rf.Lifts;
import ru.crg.gisogd_service.model.rf.LiquidPipeline;
import ru.crg.gisogd_service.model.rf.OKS;
import ru.crg.gisogd_service.model.rf.OilSupplyObject;
import ru.crg.gisogd_service.model.rf.Organization;
import ru.crg.gisogd_service.model.rf.PermittedLandUseTypes;
import ru.crg.gisogd_service.model.rf.PermittedUseParameters;
import ru.crg.gisogd_service.model.rf.Pipeline;
import ru.crg.gisogd_service.model.rf.PlanningIndicators;
import ru.crg.gisogd_service.model.rf.PowerLines;
import ru.crg.gisogd_service.model.rf.ProjectDeveloper;
import ru.crg.gisogd_service.model.rf.ProtectedNaturalAreas;
import ru.crg.gisogd_service.model.rf.PublicTerritoryBorders;
import ru.crg.gisogd_service.model.rf.RSOKS;
import ru.crg.gisogd_service.model.rf.RSOKSPart;
import ru.crg.gisogd_service.model.rf.RVEOKS;
import ru.crg.gisogd_service.model.rf.RVEOKSPart;
import ru.crg.gisogd_service.model.rf.RedLine;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.crg.gisogd_service.model.rf.SpecialZone;
import ru.crg.gisogd_service.model.rf.Supplier;
import ru.crg.gisogd_service.model.rf.SupplierEmployee;
import ru.crg.gisogd_service.model.rf.TechPlan;
import ru.crg.gisogd_service.model.rf.TelecomNetwork;
import ru.crg.gisogd_service.model.rf.TerZone;
import ru.crg.gisogd_service.model.rf.Territory;
import ru.crg.gisogd_service.model.rf.TownPlanningRegulations;
import ru.crg.gisogd_service.model.rf.UDRIZS;
import ru.crg.gisogd_service.model.rf.UGE;
import ru.crg.gisogd_service.model.rf.USZIZS;
import ru.crg.gisogd_service.model.rf.UtilityConnectionPoint;
import ru.crg.gisogd_service.model.rf.WaterDisposalNetwork;
import ru.crg.gisogd_service.model.rf.WaterDisposalObject;
import ru.crg.gisogd_service.model.rf.WaterSupplyNetwork;
import ru.crg.gisogd_service.model.rf.WaterSupplyObject;
import ru.crg.gisogd_service.model.rf.WheelchairLifts;
import ru.crg.gisogd_service.model.rf.WorkType;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * Description.
 * @author Vladimir Nomokonov
 */
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AggregateServiceTest {

    @Autowired
    private AggregateService aggregateService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private RfObjectConverter converter;

    @Test
    @SneakyThrows
    void projectDeveloperAggregateTest() {
        Resource resource = new ClassPathResource("event/projectDeveloperEvent.json");
        ProjectDeveloper enriched = getEnrichedObject(resource);
        assertEquals("c8e40303-06bf-4dd4-b73e-61e58b8c1b04", enriched.getGuid());
        assertEquals("cba50a38-7b87-4a64-8915-9692d987db16", enriched.getOrganization());
        assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6", enriched.getCitizen());
    }

    @Test
    @SneakyThrows
    void townPlanningRegulationsAggregateTest() {
        Resource resource = new ClassPathResource("event/townPlanningRequlationsEvent.json");
        TownPlanningRegulations enrich = getEnrichedObject(resource);
        assertEquals("ef26d342-6370-49e1-b9b8-aea767c4d500", enrich.getGuid());
        assertEquals("ca11633e-7adc-4eff-81fb-8ae4f76d570a", enrich.getPermittedLandUseTypes().get(0));
        assertEquals("face0f59-00d4-4ba4-987b-4a5e11107641", enrich.getPermittedUseParameters().get(0));
        assertEquals("d6d5f00e-a841-4660-ad29-70f8b9dbdaf1", enrich.getPlanningIndicators().get(0));
        assertEquals("1a3568c3-eff1-4eb3-90d7-96e26b5e356c", enrich.getTerZone().get(0));
    }

    @Test
    @SneakyThrows
    void easementAggregateTest() {
        Resource resource = new ClassPathResource("event/easementEvent.json");
        Easement enrich = getEnrichedObject(resource);
        assertEquals("5a59823f-af61-4ae6-82e1-d6553e4c75c4", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void citizenAggregateTest() {
        Resource eventData = new ClassPathResource("event/citizenEvent.json");
        Citizen enrich = getEnrichedObject(eventData);
        assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void customerAggregateTest() {
        Resource eventData = new ClassPathResource("event/customerEvent.json");
        Customer enrich = getEnrichedObject(eventData);
        assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", enrich.getGuid());
        assertEquals("cba50a38-7b87-4a64-8915-9692d987db16", enrich.getOrganization());
        assertEquals("c4ffbdef-f353-43a9-9277-14e3d58731f6", enrich.getCitizen());
    }

    @Test
    @SneakyThrows
    void organizationAggregateTest() {
        Resource eventData = new ClassPathResource("event/organizationEvent.json");
        Organization enrich = getEnrichedObject(eventData);
        assertEquals("cba50a38-7b87-4a64-8915-9692d987db16", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void permittedLandUseTypesAggregateTest() {
        Resource eventData = new ClassPathResource("event/permittedLandUseTypesEvent.json");
        PermittedLandUseTypes enrich = getEnrichedObject(eventData);
        assertEquals("ca11633e-7adc-4eff-81fb-8ae4f76d570a", enrich.getGuid());
        assertEquals("face0f59-00d4-4ba4-987b-4a5e11107641", enrich.getPermittedUseParameters().get(0));
    }

    @Test
    @SneakyThrows
    void terZoneAggregateTest() {
        Resource eventData = new ClassPathResource("event/terZoneEvent.json");
        TerZone enrich = getEnrichedObject(eventData);
        assertEquals("1a3568c3-eff1-4eb3-90d7-96e26b5e356c", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void supplierAggregateTest() {
        Resource eventData = new ClassPathResource("event/supplierEvent.json");
        Supplier enrich = getEnrichedObject(eventData);
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getGuid());
        assertEquals("cba50a38-7b87-4a64-8915-9692d987db16", enrich.getOrganization());
    }

    @Test
    @SneakyThrows
    void supplierEmployeeAggregateTest() {
        Resource eventData = new ClassPathResource("event/supplierEmployeeEvent.json");
        SupplierEmployee enrich = getEnrichedObject(eventData);
        assertEquals("f1c7101d-d539-472a-bf26-687775b8f0ec", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getSupplier());
    }

    @Test
    @SneakyThrows
    void planningIndicatorsAggregateTest() {
        Resource eventData = new ClassPathResource("event/planningIndicatorsEvent.json");
        PlanningIndicators enrich = getEnrichedObject(eventData);
        assertEquals("d6d5f00e-a841-4660-ad29-70f8b9dbdaf1", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void permittedUseParametersAggregateTest() {
        Resource eventData = new ClassPathResource("event/permittedUseParametersEvent.json");
        PermittedUseParameters enrich = getEnrichedObject(eventData);
        assertEquals("face0f59-00d4-4ba4-987b-4a5e11107641", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void inboxDataAggregateTest() {
        Resource eventData = new ClassPathResource("event/inboxDataEvent.json");
        InboxData enrich = getEnrichedObject(eventData);
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void landPlotAggregateTest() {
        Resource eventData = new ClassPathResource("event/landPlotEvent.json");
        LandPlot enrich = getEnrichedObject(eventData);
        assertEquals("9caf0279-dc2e-427b-b568-045d9398aa68", enrich.getGuid());
        assertEquals("48121bb8-250c-4195-9de1-b0c44fcf397b", enrich.getTerritory());
        assertEquals("e9ed026a-c481-49e6-b6bd-646cd00bc51f", enrich.getEasement());
        assertEquals("1.16", enrich.getPermittedLandUseTypes().get(0));
        assertEquals("1.0", enrich.getPermittedLandUseTypes().get(1));
    }

    @Test
    @SneakyThrows
    void dataSection1AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection1Event.json");
        DataSection1 enrich = getEnrichedObject(eventData);
        assertEquals("9d1b2f14-1eaf-4350-af7f-4aa29922fee9", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("0e52a0c1-aa8f-491b-8aa8-c5db0ab75b2d", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("d33e9bcf-e491-4cfa-822a-c2de20888c57", enrich.getGuidDocPreviousVersion().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection2AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection2Event.json");
        DataSection2 enrich = getEnrichedObject(eventData);
        assertEquals("6bd6cf6e-bbdd-4388-8333-8a30f7a3545a", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("daf6e3a6-1e17-42c3-af6d-e51620771f5d", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("470a19b6-6f52-415e-a66f-ccbd09beb7f3", enrich.getGuidDocPreviousVersion().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection13AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection13Event.json");
        DataSection13 enrich = getEnrichedObject(eventData);
        assertEquals("b5eb5604-fca6-47d0-9e66-9449f531464c", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("48121bb8-250c-4195-9de1-b0c44fcf397b", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("e9ed026a-c481-49e6-b6bd-646cd00bc51f", enrich.getEasement().get(0));
        assertEquals("9caf0279-dc2e-427b-b568-045d9398aa68", enrich.getLandPlot().get(0));
        assertEquals("680d94f8-6a46-42a1-a9c3-40ac1780a936", enrich.getOks().get(0));
        assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", enrich.getDeveloper());
        assertEquals("fd80adbc-82ef-4806-9e40-b283347ea123", enrich.getGuidDocPreviousVersion().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection3AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection3Event.json");
        DataSection3 enrich = getEnrichedObject(eventData);
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("25f88139-65ed-49c3-b793-4f6bceef7d63", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("d04fa0a6-f500-4b9c-99e0-647930bac12f", enrich.getGuidDocPreviousVersion().get(0));
    }

    @Test
    @SneakyThrows
    void oksAggregateTest() {
        Resource eventData = new ClassPathResource("event/oksEvent.json");
        OKS enrich = getEnrichedObject(eventData);
        assertEquals("714cd45f-1da8-49b2-9c57-ffebaa92e327", enrich.getGuid());
        assertEquals("cba50a38-7b87-4a64-8915-9692d987db16", enrich.getOkNOrganization());
        assertEquals("20.10.1.8", enrich.getPurpose());
        assertEquals("1.16", enrich.getPermittedLandUseTypes().get(0));
        assertEquals("1.0", enrich.getPermittedLandUseTypes().get(1));
    }

    @Test
    @SneakyThrows
    void dataSection4AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection4Event.json");
        DataSection4 enrich = getEnrichedObject(eventData);
        assertEquals("1432d8bd-ea8a-4940-ad2a-85c624bda665", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("daf6e3a6-1e17-42c3-af6d-e51620771f5d", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("85eda40e-ca7b-4a5f-a718-7a5068810dbd", enrich.getGuidDocPreviousVersion().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection5AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection5Event.json");
        DataSection5 enrich = getEnrichedObject(eventData);
        assertEquals("742cd71d-33b8-4ab5-bed6-02a690effddf", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("0aec7a45-32ed-4f09-bcab-663425415cae", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("d4ac9c94-b6fc-4eaa-ba6e-91a26b7c08d5", enrich.getGuidDocPreviousVersion().get(0));
        assertEquals("ef26d342-6370-49e1-b9b8-aea767c4d500", enrich.getTownPlanningRegulations().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection6AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection6Event.json");
        DataSection6 enrich = getEnrichedObject(eventData);
        assertEquals("0128d5ff-66f6-4eae-849c-668fbe51ea8c", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("748e958e-76c5-47cb-a22c-8008e19230be", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("a11a6d09-c7cc-4acb-a7d4-640dc54290a8", enrich.getGuidDocPreviousVersion().get(0));
    }

    @Test
    @SneakyThrows
    void forestLandAggregateTest() {
        Resource eventData = new ClassPathResource("event/forestLandEvent.json");
        ForestLand enrich = getEnrichedObject(eventData);
        assertEquals("6b125cda-6378-4046-aca2-fe6f53e9169c", enrich.getGuid());
        assertEquals("58ec3e34-e622-4929-b544-285bfd3b866b", enrich.getProjectDoc());
        assertEquals("58ec3e34-e622-4929-b544-285bfd3b866b", enrich.getForestDevelopDoc());
    }

    @Test
    @SneakyThrows
    void forestryAggregateTest() {
        Resource eventData = new ClassPathResource("event/forestryEvent.json");
        Forestry enrich = getEnrichedObject(eventData);
        assertEquals("e2ff7279-a942-4146-a381-15600fc4585a", enrich.getGuid());
        assertEquals("58ec3e34-e622-4929-b544-285bfd3b866b", enrich.getForestRegulation());
        assertEquals("1.16", enrich.getPermittedUseType().get(0));
        assertEquals("1.0", enrich.getPermittedUseType().get(1));
    }

    @Test
    @SneakyThrows
    void forestDistrictAggregateTest() {
        Resource eventData = new ClassPathResource("event/forestDistrictEvent.json");
        ForestDistrict enrich = getEnrichedObject(eventData);
        assertEquals("578e41b5-2b2c-4deb-bd3b-85413af831b9", enrich.getGuid());
        assertEquals("e2ff7279-a942-4146-a381-15600fc4585a", enrich.getForestry());
    }

    @Test
    @SneakyThrows
    void forestQuarterAggregateTest() {
        Resource eventData = new ClassPathResource("event/forestQuarterEvent.json");
        ForestQuarter enrich = getEnrichedObject(eventData);
        assertEquals("17671ba5-e97d-4e12-a7f0-b75550b6bb20", enrich.getGuid());
        assertEquals("e2ff7279-a942-4146-a381-15600fc4585a", enrich.getForestry());
    }

    @Test
    @SneakyThrows
    void dataSection16AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection16Event.json");
        DataSection16 enrich = getEnrichedObject(eventData);
        assertEquals("58ec3e34-e622-4929-b544-285bfd3b866b", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("487c7c0e-c702-45aa-883b-86044628f5a3", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("58ec3e34-e622-4929-b544-285bfd3b866b", enrich.getGuidDocPreviousVersion().get(0));

        assertEquals("e2ff7279-a942-4146-a381-15600fc4585a", enrich.getForestry().get(0));
        assertEquals("6b125cda-6378-4046-aca2-fe6f53e9169c", enrich.getForestPlot().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection8AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection8Event.json");
        DataSection8 enrich = getEnrichedObject(eventData);
        assertEquals("fe93127b-36cf-49b7-8af1-3c4fbc4e0eee", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("907d2dc1-9402-4fef-9192-c382a4df49b1", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("7063f3ac-2069-40e8-b888-f8b699256baa", enrich.getGuidDocPreviousVersion().get(0));
        assertEquals("0Н.1", enrich.getResearchType().get(0));
        assertEquals("0Н.2", enrich.getResearchType().get(1));
    }

    @Test
    @SneakyThrows
    void artLandAggregateTest() {
        Resource eventData = new ClassPathResource("event/artLandEvent.json");
        ArtLand enrich = getEnrichedObject(eventData);
        assertEquals("3827e0bf-7543-4d85-aba2-7a387a842dec", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void dataSection9AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection9Event.json");
        DataSection9 enrich = getEnrichedObject(eventData);
        assertEquals("2fbebdbd-b049-4912-811a-47a4de30929a", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("93d1e8be-9564-4a69-b5eb-65ea0c7a702a", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("83793248-06ad-4938-8bff-679c1a98a1f3", enrich.getGuidDocPreviousVersion().get(0));
        assertEquals("3827e0bf-7543-4d85-aba2-7a387a842dec", enrich.getArtLand().get(0));
    }

    @Test
    @SneakyThrows
    void specialZoneAggregateTest() {
        Resource eventData = new ClassPathResource("event/specialZoneEvent.json");
        SpecialZone enrich = getEnrichedObject(eventData);
        assertEquals("a6860109-8929-42cd-8f36-05e6d4ef2456", enrich.getGuid());
        assertEquals("eff96bd7-611d-4b11-8d64-981016cafc15", enrich.getDocument());
    }

    @Test
    @SneakyThrows
    void dataSection10AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection10Event.json");
        DataSection10 enrich = getEnrichedObject(eventData);
        assertEquals("eff96bd7-611d-4b11-8d64-981016cafc15", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("76c02446-0f2d-4d7f-b7ca-9faaeb0292b3", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("8b5fa7c6-8d6a-4c95-8591-f19526ce2ef2", enrich.getGuidDocPreviousVersion().get(0));
        assertEquals("a6860109-8929-42cd-8f36-05e6d4ef2456", enrich.getSpecialZone().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection12AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection12Event.json");
        DataSection12 enrich = getEnrichedObject(eventData);
        assertEquals("d9fb68c9-0d1a-4541-aab6-e4cec44eb891", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("48121bb8-250c-4195-9de1-b0c44fcf397b", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("1c76af07-9acd-48b4-850d-a4329b8737b0", enrich.getGuidDocPreviousVersion().get(0));
        assertEquals("9caf0279-dc2e-427b-b568-045d9398aa68", enrich.getLandPlot().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection17AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection17Event.json");
        DataSection17 enrich = getEnrichedObject(eventData);
        assertEquals("9659f5cd-ef5f-4413-8c9a-83522fd15210", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("602a027c-e309-4b42-b505-11a9c664bbc7", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("2b86f691-c773-4269-a38b-4a0b816aa69e", enrich.getGuidDocPreviousVersion().get(0));

        assertEquals("9caf0279-dc2e-427b-b568-045d9398aa68", enrich.getLandPlot());
        assertEquals("1272e0d6-1c48-47ad-9d4f-df16b1fa1fba", enrich.getOKS());
        assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", enrich.getDeveloper());
    }

    @Test
    @SneakyThrows
    void dataSection18AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection18Event.json");
        DataSection18 enrich = getEnrichedObject(eventData);
        assertEquals("19cce5be-1c55-4fe5-96c9-a02375ee3c8e", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("9cfccce8-cdbf-45bb-814e-c13f4f68cd0b", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("d3df5a90-4dc0-4ef0-8a2b-3b1baffa7471", enrich.getGuidDocPreviousVersion().get(0));
    }

    @Test
    @SneakyThrows
    void elementPlanningStructureAggregateTest() {
        Resource eventData = new ClassPathResource("event/elementPlanningStructureEvent.json");
        ElementPlanningStructure enrich = getEnrichedObject(eventData);
        assertEquals("f76ab723-6aaa-4574-941a-23962023a4cc", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void publicTerritoryBordersAggregateTest() {
        Resource eventData = new ClassPathResource("event/publicTerritoryBordersEvent.json");
        PublicTerritoryBorders enrich = getEnrichedObject(eventData);
        assertEquals("80617593-c720-4ee8-bbb6-0e0ef0ee70b8", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void constructionZonesBordersAggregateTest() {
        Resource eventData = new ClassPathResource("event/constructionZoneBordersEvent.json");
        ConstructionZonesBorders enrich = getEnrichedObject(eventData);
        assertEquals("fd578c7b-4e6f-4e0a-bdd3-6290511bfe71", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void redLineAggregateTest() {
        Resource eventData = new ClassPathResource("event/redLIneEvent.json");
        RedLine enrich = getEnrichedObject(eventData);
        assertEquals("63629798-ed6b-4889-9d56-bd11e7d2d835", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void formedLandAggregateTest() {
        Resource eventData = new ClassPathResource("event/formedLandEvent.json");
        FormedLand enrich = getEnrichedObject(eventData);
        assertEquals("7199f6d1-a823-4840-8294-3b1c2f5fa00f", enrich.getGuid());
        assertEquals("1.0", enrich.getPermittedUseType().get(0));
        assertEquals("d5ef5fce-cd16-4d85-9df7-7b4f33a381a2", enrich.getEasement());
    }

    @Test
    @SneakyThrows
    void indentLineAggregateTest() {
        Resource eventData = new ClassPathResource("event/identLineEvent.json");
        IndentLine enrich = getEnrichedObject(eventData);
        assertEquals("9c5defbf-e3d9-442c-9f38-40494bdeaf34", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void powerLinesAggregateTest() {
        Resource eventData = new ClassPathResource("event/powerLinesEvent.json");
        PowerLines enrich = getEnrichedObject(eventData);
        assertEquals("294a9b53-b719-4379-a155-9e96069956a9", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void dataSection7AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection7Event.json");
        DataSection7 enrich = getEnrichedObject(eventData);
        assertEquals("68ee7310-6a66-4e97-a5b3-4faca0dda317", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("b2edcebe-7f2c-442b-83f1-7405635593e9", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("cce8efe5-9128-4651-9a2e-8a8466af4b08", enrich.getGuidDocPreviousVersion().get(0));

        assertEquals("f76ab723-6aaa-4574-941a-23962023a4cc", enrich.getElementPlanningStructure().get(0));
        assertEquals("80617593-c720-4ee8-bbb6-0e0ef0ee70b8", enrich.getPublicTerritoryBorders().get(0));
        assertEquals("fd578c7b-4e6f-4e0a-bdd3-6290511bfe71", enrich.getConstructionZonesBorders().get(0));
        assertEquals("8277cd35-fd2a-4e6f-8830-3ff9cd8ce52b", enrich.getRedLine().get(0));
        assertEquals("7199f6d1-a823-4840-8294-3b1c2f5fa00f", enrich.getFormedLand().get(0));
        assertEquals("9c5defbf-e3d9-442c-9f38-40494bdeaf34", enrich.getIndentLine().get(0));
        assertEquals("e9ed026a-c481-49e6-b6bd-646cd00bc51f", enrich.getEasement().get(0));
    }

    @Test
    @SneakyThrows
    void pipeLineAggregateTest() {
        Resource eventData = new ClassPathResource("event/pipeLineEvent.json");
        Pipeline enrich = getEnrichedObject(eventData);
        assertEquals("d38151cb-1f95-43ea-90a2-4e41f020996b", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void waterDisposalObjectAggregateTest() {
        Resource eventData = new ClassPathResource("event/waterDisposalObjectEvent.json");
        WaterDisposalObject enrich = getEnrichedObject(eventData);
        assertEquals("a59ba392-9d98-4656-9985-3d7ad665119a", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void waterSupplyObjectAggregateTest() {
        Resource eventData = new ClassPathResource("event/waterSupplyObjectEvent.json");
        WaterSupplyObject enrich = getEnrichedObject(eventData);
        assertEquals("f911ebfe-eb10-4ec8-b5e0-2137dd1b9b13", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void gasSupplyObjectAggregateTest() {
        Resource eventData = new ClassPathResource("event/gasSupplyObjectEvent.json");
        GasSupplyObject enrich = getEnrichedObject(eventData);
        assertEquals("df1a5e39-e4a1-48f6-b140-964e1ef9b848", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void oilSupplyObjectAggregateTest() {
        Resource eventData = new ClassPathResource("event/oilSupplyObjectEvent.json");
        OilSupplyObject enrich = getEnrichedObject(eventData);
        assertEquals("f81874cc-dfd2-4383-a122-e946ed3a371c", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void communicationObjectAggregateTest() {
        Resource eventData = new ClassPathResource("event/communicationObjectEvent.json");
        CommunicationObject enrich = getEnrichedObject(eventData);
        assertEquals("7c091498-bacb-41e5-8f1f-e054a111955d", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void heatSupplyObjectAggregateTest() {
        Resource eventData = new ClassPathResource("event/heatSupplyObjectEvent.json");
        HeatSupplyObject enrich = getEnrichedObject(eventData);
        assertEquals("4609ca7f-1fdf-40ce-aaf9-34b176c7b7be", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void electricPowerObjectAggregateTest() {
        Resource eventData = new ClassPathResource("event/electricPowerObjectEvent.json");
        ElectricPowerObject enrich = getEnrichedObject(eventData);
        assertEquals("59fc16ba-66fc-4668-892c-81ccb375cb40", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void gasPipelineAggregateTest() {
        Resource eventData = new ClassPathResource("event/gasPipelineEvent.json");
        GasPipeline enrich = getEnrichedObject(eventData);
        assertEquals("d3371f13-c45a-4c01-926a-bae4ebde6915", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void waterDisposalNetworkAggregateTest() {
        Resource eventData = new ClassPathResource("event/waterDisposalNetworkEvent.json");
        WaterDisposalNetwork enrich = getEnrichedObject(eventData);
        assertEquals("444ca04b-720c-476f-81b3-373284ec1ebf", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void waterSupplyNetworkAggregateTest() {
        Resource eventData = new ClassPathResource("event/waterSupplyNetworkEvent.json");
        WaterSupplyNetwork enrich = getEnrichedObject(eventData);
        assertEquals("c3628f28-a928-4aa7-afc1-e4f4fb22a3fc", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void heatSupplyNetworkAggregateTest() {
        Resource eventData = new ClassPathResource("event/heatSupplyNetworkEvent.json");
        HeatSupplyNetwork enrich = getEnrichedObject(eventData);
        assertEquals("42a33a16-1185-464b-bca6-6d5b2118c302", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void telecomNetworkAggregateTest() {
        Resource eventData = new ClassPathResource("event/telecomNetworkEvent.json");
        TelecomNetwork enrich = getEnrichedObject(eventData);
        assertEquals("8f9d14fa-7b76-4d3c-b54c-84657ad702e8", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void utilityConnectionPointAggregateTest() {
        Resource eventData = new ClassPathResource("event/utilityConnectionPointEvent.json");
        UtilityConnectionPoint enrich = getEnrichedObject(eventData);
        assertEquals("046c03cf-3ed0-4adb-bcd4-ddaa607739b9", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void liquidPipelineAggregateTest() {
        Resource eventData = new ClassPathResource("event/liquidPipelineEvent.json");
        LiquidPipeline enrich = getEnrichedObject(eventData);
        assertEquals("6a0ec282-9129-45b8-b10b-178d5afcd45c", enrich.getGuid());
        assertEquals("52332d93-f04f-4880-af64-7aeb01e348ff", enrich.getDataSource());
    }

    @Test
    @SneakyThrows
    void dataSection11AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection11Event.json");
        DataSection11 enrich = getEnrichedObject(eventData);
        assertEquals("b304bede-8c21-42ef-bc4d-5639118c11c6", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("0c2eb5c8-1c29-402c-bec5-e1ecc2866df3", enrich.getInboxDataKey());
        assertEquals("ef16cf28-5c98-4a6a-a5f9-e9a413d6a608", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("ebd6c0e9-9874-4340-929d-4a656226b943", enrich.getGuidDocPreviousVersion().get(0));

        assertEquals("294a9b53-b719-4379-a155-9e96069956a9", enrich.getPowerLines());
        assertEquals("d38151cb-1f95-43ea-90a2-4e41f020996b", enrich.getPipeline());
        assertEquals("3cb2e940-35bf-45f0-8e75-2c57dbc8b380", enrich.getWaterDisposalObject());
        assertEquals("f911ebfe-eb10-4ec8-b5e0-2137dd1b9b13", enrich.getWaterSupplyObject());
        assertEquals("763cb019-544c-4fd9-a744-c66598533f0f", enrich.getGasSupplyObject());
        assertEquals("f81874cc-dfd2-4383-a122-e946ed3a371c", enrich.getOilSupplyObject());
        assertEquals("64a595d4-3f1c-4194-ad4c-5cf1ba0459d0", enrich.getCommunicationObject());
        assertEquals("e6132977-033f-4f34-b335-175305b20c1a", enrich.getHeatSupplyObject());
        assertEquals("59fc16ba-66fc-4668-892c-81ccb375cb40", enrich.getElectricPowerObject());
        assertEquals("d3371f13-c45a-4c01-926a-bae4ebde6915", enrich.getGasPipeline());
        assertEquals("444ca04b-720c-476f-81b3-373284ec1ebf", enrich.getWaterDisposalNetwork());
        assertEquals("c3628f28-a928-4aa7-afc1-e4f4fb22a3fc", enrich.getWaterSupplyNetwork());
        assertEquals("42a33a16-1185-464b-bca6-6d5b2118c302", enrich.getHeatSupplyNetwork());
        assertEquals("8f9d14fa-7b76-4d3c-b54c-84657ad702e8", enrich.getTelecomNetwork());
        assertEquals("046c03cf-3ed0-4adb-bcd4-ddaa607739b9", enrich.getUtilityConnectionPoint());
        assertEquals("6a0ec282-9129-45b8-b10b-178d5afcd45c", enrich.getLiquidPipeline());
    }

    @Test
    @SneakyThrows
    void workTypeAggregateTest() {
        Resource eventData = new ClassPathResource("event/workTypeEvent.json");
        WorkType enrich = getEnrichedObject(eventData);
        assertEquals("a8b119ad-6537-4408-af0b-0dd211b2b1a0", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void techPlanAggregateTest() {
        Resource eventData = new ClassPathResource("event/techPlanEvent.json");
        TechPlan enrich = getEnrichedObject(eventData);
        assertEquals("c5760916-2e04-4052-b710-1b825df1bf41", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void wheelchairLiftsAggregateTest() {
        Resource eventData = new ClassPathResource("event/wheelchairLiftsEvent.json");
        WheelchairLifts enrich = getEnrichedObject(eventData);
        assertEquals("f9d7cacd-121b-45c7-a7f2-2f236132998f", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void escalatorsAggregateTest() {
        Resource eventData = new ClassPathResource("event/escalatorsEvent.json");
        Escalators enrich = getEnrichedObject(eventData);
        assertEquals("d1bc675f-ecd2-4c5b-93ce-5845f19d34bd", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void liftsAggregateTest() {
        Resource eventData = new ClassPathResource("event/liftsEvent.json");
        Lifts enrich = getEnrichedObject(eventData);
        assertEquals("91e7a810-19a6-4fde-8d31-222b339dda67", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void gpzuAggregateTest() {
        Resource eventData = new ClassPathResource("event/gpzuEvent.json");
        GPZU enrich = getEnrichedObject(eventData);
        assertEquals("5bfa68c4-85a7-4dd8-b7d2-70c3a6647b75", enrich.getGuid());
        assertEquals("51eeabbf-c69a-47bb-a3c9-0889c5b71071", enrich.getDataSection13());
        assertEquals("c8e40303-06bf-4dd4-b73e-61e58b8c1b04", enrich.getProjectDeveloper());
        assertEquals("ba718dde-c49e-48b7-9c6d-cf7de1596505", enrich.getInfoP221().get(0));
        assertEquals("e75702f8-63db-456d-94e1-2f7251f58984", enrich.getInfoP222().get(0));
        assertEquals("ca11633e-7adc-4eff-81fb-8ae4f76d570a", enrich.getInfoP223().get(0));
    }

    @Test
    @SneakyThrows
    void gpzuInfoP23AggregateTest() {
        Resource eventData = new ClassPathResource("event/GPZUInfoP2_3Event.json");
        GPZUInfoP23 enrich = getEnrichedObject(eventData);
        assertEquals("211269b5-2e31-43c3-a754-da0588ab9773", enrich.getGuid());
        assertEquals("5bfa68c4-85a7-4dd8-b7d2-70c3a6647b75", enrich.getGPZU());
    }

    @Test
    @SneakyThrows
    void gpzuInfoP24AggregateTest() {
        Resource eventData = new ClassPathResource("event/GPZUInfoP2_4Event.json");
        GPZUInfoP24 enrich = getEnrichedObject(eventData);
        assertEquals("21ba6462-5c5f-4341-af74-d9fdfbcc75d5", enrich.getGuid());
        assertEquals("5bfa68c4-85a7-4dd8-b7d2-70c3a6647b75", enrich.getGPZU());
    }

    @Test
    @SneakyThrows
    void gpzuInfoP25AggregateTest() {
        Resource eventData = new ClassPathResource("event/GPZUInfoP2_5Event.json");
        GPZUInfoP25 enrich = getEnrichedObject(eventData);
        assertEquals("c69e6bcb-6a0d-4278-8c76-450df4faae43", enrich.getGuid());
        assertEquals("5bfa68c4-85a7-4dd8-b7d2-70c3a6647b75", enrich.getGPZU());
    }

    @Test
    @SneakyThrows
    void gpzuInfoP41AggregateTest() {
        Resource eventData = new ClassPathResource("event/GPZUInfoP4_1Event.json");
        GPZUInfoP41 enrich = getEnrichedObject(eventData);
        assertEquals("9a168f48-7114-4bad-bf7a-28eac4638da8", enrich.getGuid());
        assertEquals("5bfa68c4-85a7-4dd8-b7d2-70c3a6647b75", enrich.getGPZU());
    }

    @Test
    @SneakyThrows
    void gpzuInfoP6AggregateTest() {
        Resource eventData = new ClassPathResource("event/GPZUInfoP6Event.json");
        GPZUInfoP6 enrich = getEnrichedObject(eventData);
        assertEquals("87e1bfa9-0968-4579-b2a7-788a71927378", enrich.getGuid());
        assertEquals("5bfa68c4-85a7-4dd8-b7d2-70c3a6647b75", enrich.getGPZU());
        assertTrue(enrich.getBorder().contains("MultiPolygon"));
    }

    @Test
    @SneakyThrows
    void ugeAggregateTest() {
        Resource eventData = new ClassPathResource("event/ugeEvent.json");
        UGE enrich = getEnrichedObject(eventData);
        assertEquals("9391ab96-d293-4023-b0dc-2c427d314ef0", enrich.getGuid());
        assertEquals("fd80adbc-82ef-4806-9e40-b283347ea123", enrich.getDataSection13());
        assertEquals("a8b119ad-6537-4408-af0b-0dd211b2b1a0", enrich.getWorkType());
        assertEquals("c8e40303-06bf-4dd4-b73e-61e58b8c1b04", enrich.getProjectDeveloper());
    }

    @Test
    @SneakyThrows
    void rsoksAggregateTest() {
        Resource eventData = new ClassPathResource("event/rsoksEvent.json");
        RSOKS enrich = getEnrichedObject(eventData);
        assertEquals("0c682142-68f8-44fe-a33c-b6f8c4f2e4ae", enrich.getGuid());
        assertEquals("fd80adbc-82ef-4806-9e40-b283347ea123", enrich.getDataSection13());
        assertEquals("9391ab96-d293-4023-b0dc-2c427d314ef0", enrich.getExpertise());
        assertEquals("5bfa68c4-85a7-4dd8-b7d2-70c3a6647b75", enrich.getGPZU().get(0));
        assertEquals("19cce5be-1c55-4fe5-96c9-a02375ee3c8e", enrich.getSRZU());
        assertEquals("68ee7310-6a66-4e97-a5b3-4faca0dda317", enrich.getPPM());
        assertEquals("68ee7310-6a66-4e97-a5b3-4faca0dda317", enrich.getPPT());
        assertEquals("c8e40303-06bf-4dd4-b73e-61e58b8c1b04", enrich.getProjectDeveloper());
        assertEquals("19cce5be-1c55-4fe5-96c9-a02375ee3c8e", enrich.getProjectDoc());
        assertEquals("19cce5be-1c55-4fe5-96c9-a02375ee3c8e", enrich.getTAR());
        assertEquals("b5eb5604-fca6-47d0-9e66-9449f531464c", enrich.getGECE());
        assertEquals("19cce5be-1c55-4fe5-96c9-a02375ee3c8e", enrich.getPS3849());
        assertEquals("19cce5be-1c55-4fe5-96c9-a02375ee3c8e", enrich.getPS3949());

    }

    @Test
    @SneakyThrows
    void udrizsAggregateTest() {
        Resource eventData = new ClassPathResource("event/udrizsEvent.json");
        UDRIZS enrich = getEnrichedObject(eventData);
        assertEquals("826b273e-9ec6-434a-bd43-dbf25aef5fc9", enrich.getGuid());
        assertEquals("b5eb5604-fca6-47d0-9e66-9449f531464c", enrich.getDataSection13());
    }

    @Test
    @SneakyThrows
    void uszizsAggregateTest() {
        Resource eventData = new ClassPathResource("event/uszizsEvent.json");
        USZIZS enrich = getEnrichedObject(eventData);
        assertEquals("7d500b3a-3a48-47b6-988c-4162576239be", enrich.getGuid());
        assertEquals("fd80adbc-82ef-4806-9e40-b283347ea123", enrich.getDataSection13());
    }

    @Test
    @SneakyThrows
    void territoryAggregateTest() {
        Resource eventData = new ClassPathResource("event/territoryEvent.json");
        Territory enrich = getEnrichedObject(eventData);
        assertEquals("0dfaa71b-a4b9-4870-8692-42a4ecaa01d1", enrich.getGuid());
        assertTrue(enrich.getLocation().contains("MultiPolygon"));
    }

    @Test
    @SneakyThrows
    void rveoksAggregateTest() {
        Resource eventData = new ClassPathResource("event/rveoksEvent.json");
        RVEOKS enrich = getEnrichedObject(eventData);
        assertEquals("af727d1d-9830-4464-a1fd-9bfd40357248", enrich.getGuid());
        assertEquals("fd80adbc-82ef-4806-9e40-b283347ea123", enrich.getDataSection13());
        assertEquals("0c682142-68f8-44fe-a33c-b6f8c4f2e4ae", enrich.getRSOKS());
        assertEquals("c5760916-2e04-4052-b710-1b825df1bf41", enrich.getTechPlan().get(0));
    }

    @Test
    @SneakyThrows
    void rsoksPartAggregateTest() {
        Resource eventData = new ClassPathResource("event/rsoksPartEvent.json");
        RSOKSPart enrich = getEnrichedObject(eventData);
        assertEquals("b25e2de5-a968-4274-8266-2295e7094ca4", enrich.getGuid());
        assertEquals("14b6a960-e1fa-4c2e-b14d-68ffdb1c3f6e",  enrich.getOKS());
        assertEquals("0c682142-68f8-44fe-a33c-b6f8c4f2e4ae", enrich.getRSOKS());
        assertEquals("16.1.7.10",  enrich.getOkSPurpose());
        assertEquals("91e7a810-19a6-4fde-8d31-222b339dda67",  enrich.getElevatorsNonProd());
        assertEquals("d1bc675f-ecd2-4c5b-93ce-5845f19d34bd",  enrich.getEscalatorsNonProd());
        assertEquals("fb94e9c4-4c4a-4435-affe-a44b2876e45c", enrich.getWheelchairLiftsNonProd());
        assertEquals("6cdef4ac-5e40-47e9-8e2c-ace38cc50b22",  enrich.getEscalators());
        assertEquals("fb94e9c4-4c4a-4435-affe-a44b2876e45c",  enrich.getWheelchairLifts());
    }

    @Test
    @SneakyThrows
    void rveoksPartAggregateTest() {
        Resource eventData = new ClassPathResource("event/rveoksPartEvent.json");
        RVEOKSPart enrich = getEnrichedObject(eventData);
        assertEquals("7d860af7-be8c-4f95-bcaf-ceb3b8639dff", enrich.getGuid());
        assertEquals("14b6a960-e1fa-4c2e-b14d-68ffdb1c3f6e", enrich.getOKS());
        assertEquals("af727d1d-9830-4464-a1fd-9bfd40357248", enrich.getRVEOKS());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("6591740e-4de0-480e-a92e-acfa56801fc4", enrich.getCustomer());
        assertEquals("7bff3a6d-16a6-4f4f-b157-6c5eec0aac49", enrich.getLandPlot());
        assertEquals("c5760916-2e04-4052-b710-1b825df1bf41", enrich.getTechPlan());
        assertEquals("91e7a810-19a6-4fde-8d31-222b339dda67", enrich.getElevatorsNonProd());
        assertEquals("6cdef4ac-5e40-47e9-8e2c-ace38cc50b22", enrich.getEscalatorsNonProd());
        assertEquals("fb94e9c4-4c4a-4435-affe-a44b2876e45c", enrich.getWheelchairLiftsNonProd());
        assertEquals("6cdef4ac-5e40-47e9-8e2c-ace38cc50b22", enrich.getEscalators());
        assertEquals("fb94e9c4-4c4a-4435-affe-a44b2876e45c", enrich.getWheelchairLifts());
    }

    @Test
    @SneakyThrows
    void protectedNaturalAreasAggregateTest() {
        Resource eventData = new ClassPathResource("event/protectedNaturalAreasEvent.json");
        ProtectedNaturalAreas enrich = getEnrichedObject(eventData);
        assertEquals("4d851b95-91af-4c4c-807c-164b7a0e0145", enrich.getGuid());
    }

    @Test
    @SneakyThrows
    void dataSection14AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection14Event.json");
        DataSection14 enrich = getEnrichedObject(eventData);
        assertEquals("6d5098a6-489b-458c-996a-14a58b13b138", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("a2195d83-775e-4949-88f6-c9469bcd84b9", enrich.getInboxDataKey());
        assertEquals("c3528c0f-08f0-40c4-8f64-018cc09278dc", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("5e6d1fc6-a66c-41e7-8eb1-1b96bb13e636", enrich.getGuidDocPreviousVersion().get(0));
    }

    @Test
    @SneakyThrows
    void dataSection15AggregateTest() {
        Resource eventData = new ClassPathResource("event/dataSection15Event.json");
        DataSection15 enrich = getEnrichedObject(eventData);
        assertEquals("f6d5bc44-a6c1-43b5-a17e-7e28a6860e77", enrich.getGuid());
        assertEquals("64391931-e93e-4bfe-8ded-059091f4514b", enrich.getOrgName());
        assertEquals("13f0def9-d6ef-4123-a4f7-6bdb35228d03", enrich.getInboxDataKey());
        assertEquals("5758fa80-bc69-4bde-a3d2-c1d6853ff4a9", enrich.getTerritoryKey());
        assertEquals("153ebb0c-d1db-4793-9e3a-1b3218dd6c57", enrich.getSupplierEmployee());
        assertEquals("1d418885-b6bd-4e9b-9dd9-cb08710788cd", enrich.getGuidDocPreviousVersion().get(0));
        assertEquals("4d851b95-91af-4c4c-807c-164b7a0e0145", enrich.getProtectedNaturalAreas().get(0));
    }

    @SneakyThrows
    private <T extends RfGuid> T getEnrichedObject(Resource resource) {
        PublishToGisogdRfEvent event = objectMapper.readValue(resource.getFile(), PublishToGisogdRfEvent.class);
        T parent = converter.convert(event.getParent());
        return aggregateService.aggregate(parent, event);
    }
}
