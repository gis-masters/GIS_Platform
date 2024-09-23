package ru.mycrg.data_service.service.smev3.request.register_rnv;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.smev3.RegisterRequestDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rnv_1_0_8.*;
import ru.mycrg.data_service.service.smev3.fields.*;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.model.SmevRequestConst;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcessor;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.CADASTRALNUM;
import static ru.mycrg.data_service.service.smev3.fields.FieldsSection.*;

public class RegisterRnvXmlBuildProcessor extends AXmlBuildProcessor {

    private final Logger log = LoggerFactory.getLogger(RegisterRnvXmlBuildProcessor.class);
    private final ReusableElements rue = new ReusableElements();

    public RegisterRnvXmlBuildProcessor(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public RequestAndSources<Request> run(@NotNull RegisterRequestDto dto) {
        try {
            loadRecords(dto.getRecId());

            // бизнес часть запроса
            var request = requestType();

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка при построении запрос в СМЭВ: :" + e.getMessage());
        }
    }

    private void loadRecords(Long section13Id) {
        // section13Record
        rue.section13Record = getRecordById(
                FieldsSection.TABLE_13,
                FieldsSection.TABLE_13,
                section13Id
        );
        log.debug("section13Record read. is not null {}", rue.section13Record != null);

        rue.developer_CustomerRecord = asRefRecord(
                rue.section13Record,
                FieldsSection.PROPERTY_DEVELOPER_DATA_CONNECTION
        ).orElse(null);
        log.debug("developer_CustomerRecord read. is not null {}", rue.developer_CustomerRecord != null);

        rue.supplier_SupplierRecord = asRefRecord(
                rue.section13Record,
                FieldsSection.PROPERTY_SUPPLIER_DATA_CONNECTION
        ).orElse(null);
        log.debug("supplier_SupplierRecord read. is not null {}", rue.supplier_SupplierRecord != null);

        rue.rveoksRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRveoks.TABLE,
                FieldsRveoks.TABLE,
                FieldsRveoks.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION,
                rue.section13Record.getId()
        );
        log.debug("rveoksRecord read. is not null {}", rue.rveoksRecord != null);

        rue.oks13Record = getRecordByJsonIdValue(
                ResourceType.FEATURE,
                FieldsOks13.WORKSPACE,
                FieldsOks13.SCHEMA,
                FieldsOks13.TABLE,
                FieldsOks13.PROPERTY_FILE,
                rue.section13Record.getId()
        );
        log.debug("oks13Record read. is not null {}", rue.oks13Record != null);

        rue.oks13LineRecord = getRecordByJsonIdValue(
                ResourceType.FEATURE,
                FieldsOks13Line.WORKSPACE,
                FieldsOks13Line.SCHEMA,
                FieldsOks13Line.TABLE,
                FieldsOks13Line.PROPERTY_FILE,
                rue.section13Record.getId()
        );
        log.debug("oks13LineRecord read. is not null {}", rue.oks13LineRecord != null);

        rue.landplotRecord = getRecordByJsonIdValue(
                ResourceType.FEATURE,
                FieldsLandplot.WORKSPACE,
                FieldsLandplot.SCHEMA,
                FieldsLandplot.TABLE,
                FieldsLandplot.PROPERTY_FILE,
                rue.section13Record.getId()
        );
        log.debug("landplotRecord read. is not null {}", rue.landplotRecord != null);

        // developer_CustomerRecord
        rue.developerOrganizationRecord = asRefRecord(
                rue.developer_CustomerRecord,
                FieldsCustomer.PROPERTY_ORGANIZATION
        ).orElse(null);
        log.debug("developerOrganizationRecord read. is not null {}", rue.developerOrganizationRecord != null);

        // rveoksRecord
        rue.rveoksPartRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRveoksPart.TABLE,
                FieldsRveoksPart.TABLE,
                FieldsRveoksPart.PROPERTY_DL_DATA_RVEOKS_DATA_CONNECTION,
                rue.rveoksRecord.getId()
        );
        log.debug("rveoksPartRecord read. is not null {}", rue.rveoksPartRecord != null);

        rue.techPlanRecord = asRefRecord(
                rue.rveoksRecord,
                FieldsRveoks.PROPERTY_DL_DATA_TECH_PLAN_DATA_CONNECTION
        ).orElse(null);
        log.debug("techPlanRecord read. is not null {}", rue.techPlanRecord != null);

        rue.rsoksRecord = asRefRecord(
                rue.rveoksRecord,
                FieldsRveoks.PROPERTY_DL_DATA_RSOKS_DATA_CONNECTION
        ).orElse(null);
        log.debug("rsoksRecord read. is not null {}", rue.rsoksRecord != null);

        //  rsoksRecord
        rue.rsoksPartRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRsoksPart.TABLE,
                FieldsRsoksPart.TABLE,
                FieldsRsoksPart.PROPERTY_DL_DATA_RSOKS_DATA_CONNECTION,
                rue.rsoksRecord.getId()
        );
        log.debug("rsoksPartRecord read. is not null {}", rue.rsoksPartRecord != null);

        rue.rsoksSection13Record = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION
        ).orElse(null);
        log.debug("rsoksSection13Record read. is not null {}", rue.rsoksSection13Record != null);

        // rsoksSection13
        rue.rsoksSection13SupplierRecord = asRefRecord(
                rue.rsoksSection13Record,
                FieldsSection.PROPERTY_SUPPLIER_DATA_CONNECTION
        ).orElse(null);
        log.debug("rsoksSection13SupplierRecord read. is not null {}", rue.rsoksSection13SupplierRecord != null);

        rue.usersAfterTriggerRecord = asRefRecord(
                rue.rsoksSection13Record,
                FieldsSection.PROPERTY_ISSUE_PERSON_CONNECTION
        ).orElse(null);
        log.debug("usersAfterTriggerRecord read. is not null {}", rue.usersAfterTriggerRecord != null);

        // rsoksSection13SupplierRecord
        rue.rsoksSection13SupplierOrganizationRecord = asRefRecord(
                rue.rsoksSection13SupplierRecord,
                FieldsSupplier.PROPERTY_ORGANIZATION_DATA_CONNECTION
        ).orElse(null);
        log.debug("rsoksSection13SupplierOrganizationRecord read. is not null {}",
                  rue.rsoksSection13SupplierOrganizationRecord != null);

        // supplierRecord
        rue.supplierOrganizationRecord = asRefRecord(
                rue.supplier_SupplierRecord,
                FieldsSupplier.PROPERTY_ORGANIZATION_DATA_CONNECTION
        ).orElse(null);
        log.debug("supplierOrganizationRecord read. is not null {}", rue.supplierOrganizationRecord != null);
    }

    /**
     * Корневая сущность
     */
    private Request requestType() {
        var type = new ExploitationType();

        // section13Record
        asString(rue.section13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setPermitNumber);
        asXMLGregorianCalendar(rue.section13Record, FieldsSection.PROPERTY_DOC_DATE)
                .ifPresent(type::setPermitDate);
        asInt(rue.section13Record, FieldsSection.PROPERTY_CONST_GOVERNMENT_ORDER_ID)
                .ifPresent(type::setGovernmentOrderId);
        asString(rue.section13Record, FieldsSection.PROPERTY_CONST_CADASTRAL_DISTRICT)
                .ifPresent(type::setCadastralDistrict);
        asString(rue.section13Record, FieldsSection.PROPERTY_CONST_CADASTRAL_AREA)
                .ifPresent(type::setCadastralArea);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_CONSTRUCTION_TYPE)
                .ifPresent(type::setConstructionKind);

        // usersAfterTriggerRecord
        asString(rue.usersAfterTriggerRecord, FieldsUsersAfterTrigger.PROPERTY_POSITION1)
                .ifPresent(type::setIssuePersonPosition);
        type.setIssuePerson(supplierIssuePerson());

        // rsoksSection13Record
        asString(rue.rsoksSection13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setConstPermitNumber);
        asXMLGregorianCalendar(rue.rsoksSection13Record, FieldsSection.PROPERTY_DOC_DATE)
                .ifPresent(type::setConstPermitDate);

        // Добавляем вложение
        asAttachment(rue.section13Record);

        type.setRecipientInfo(developerRecipientInfo());
        type.setIssueOrgan(issueOrgan());
        type.setConstPermitIssueOrgan(constPermitIssueOrgan());
        type.getObjectInfo().add(objectInfo());

        var request = new Request();
        request.setRegisterNewExploitation(type);

        return request;
    }

    private OrganizationInfoType constPermitIssueOrgan() {
        var rsoksOrganizationInfoType = new OrganizationInfoType();
        asString(rue.rsoksSection13SupplierOrganizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(rsoksOrganizationInfoType::setOrganizationName);
        asString(rue.rsoksSection13SupplierOrganizationRecord, FieldsOrganization.PROPERTY_INN)
                .ifPresent(rsoksOrganizationInfoType::setINN);
        asString(rue.rsoksSection13SupplierOrganizationRecord, FieldsOrganization.PROPERTY_ORGN)
                .ifPresent(rsoksOrganizationInfoType::setOGRN);
        asString(rue.rsoksSection13SupplierOrganizationRecord, FieldsOrganization.PROPERTY_KPP)
                .ifPresent(rsoksOrganizationInfoType::setKPP);
        return rsoksOrganizationInfoType;
    }

    private OrganizationInfoType issueOrgan() {
        var organizationInfoType = new OrganizationInfoType();
        asString(rue.supplierOrganizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(organizationInfoType::setOrganizationName);
        asString(rue.supplierOrganizationRecord, FieldsOrganization.PROPERTY_INN)
                .ifPresent(organizationInfoType::setINN);
        asString(rue.supplierOrganizationRecord, FieldsOrganization.PROPERTY_ORGN)
                .ifPresent(organizationInfoType::setOGRN);
        asString(rue.supplierOrganizationRecord, FieldsOrganization.PROPERTY_KPP)
                .ifPresent(organizationInfoType::setKPP);
        return organizationInfoType;
    }

    private FIOType supplierIssuePerson() {
        var fioType = new FIOType();
        asString(rue.usersAfterTriggerRecord, FieldsUsersAfterTrigger.PROPERTY_NAME)
                .ifPresent(fioType::setName);
        asString(rue.usersAfterTriggerRecord, FieldsUsersAfterTrigger.PROPERTY_SUR_NAME)
                .ifPresent(fioType::setSurname);
        asString(rue.usersAfterTriggerRecord, FieldsUsersAfterTrigger.PROPERTY_MIDDLE_NAME)
                .ifPresent(fioType::setMiddleName);
        return fioType;
    }

    private RecipientInfoType developerRecipientInfo() {
        var developerOrganizationAddress = new AddressFullType();
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_ACTUAL_ADDRESS)
                .ifPresent(s -> {
                    developerOrganizationAddress.setNote(s);
                    developerOrganizationAddress.setRegion(SmevRequestConst.CRIMEA_REGION);
                });

        var developerOrganizationInfoType = new OrganizationInfoType();
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(developerOrganizationInfoType::setOrganizationName);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_ORGN)
                .ifPresent(developerOrganizationInfoType::setOGRN);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_INN)
                .ifPresent(developerOrganizationInfoType::setINN);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_KPP)
                .ifPresent(developerOrganizationInfoType::setKPP);

        var developerOrganizationInfo = new RecipientInfoType();
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_EMAIL)
                .ifPresent(developerOrganizationInfo::setEmail);
        developerOrganizationInfo.setMailingAddress(developerOrganizationAddress);
        developerOrganizationInfo.setOrganizationInfo(developerOrganizationInfoType);

        return developerOrganizationInfo;
    }

    private ObjectInfoType objectInfo() {
        var type = new ObjectInfoType();

        // section13Record
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_OBJECT_KIND)
                .ifPresent(type::setObjectKind);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_OBJECT_PURPOSE)
                .ifPresent(type::setObjectPurpose);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL)
                .ifPresent(type::setObjectPurposeFunctional);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_BUILD_CAPITAL_TYPE)
                .ifPresent(type::setBuildCapitalType);
        asString(rue.section13Record, FieldsSection.PROPERTY_OBJECT_NAME_EIS)
                .ifPresent(type::setObjectName);

        //TODO обратить внимание
        asString(rue.section13Record, FieldsSection.PROPERTY_LACOTEAN)
                .ifPresent(s -> {
                    var addressFullType = new AddressFullType();
                    addressFullType.setRegion(SmevRequestConst.CRIMEA_REGION);
                    addressFullType.setNote(s);
                    var addressAttrType = new AddressAttrType();
                    addressAttrType.setAddressFull(addressFullType);
                    type.setObjectAddress(addressAttrType);
                });

        // section13viaRsoksRecord
        asString(rue.rsoksSection13Record, FieldsSection.PROPERTY_NAME_FROM_P_D)
                .ifPresent(type::setConstObjectName);
        asString(rue.rsoksSection13Record, FieldsSection.PROPERTY_IDENTIFIER)
                .ifPresent(type::setConstObjectID);

        // rveoksRecord
        asString(rue.rveoksRecord, FieldsRveoks.PROPERTY_BUILDING_ADDRESS)
                .ifPresent(s -> {
                    var addressFullType = new AddressFullType();
                    addressFullType.setNote(s);
                    addressFullType.setRegion(SmevRequestConst.CRIMEA_REGION);
                    type.setObjectBuildingAddress(addressFullType);
                });

        //TODO обратить внимание
        asString(rue.rveoksRecord, FieldsRveoks.PROPERTY_ADDRESS_ASSIGNMENT_DOC)
                .ifPresent(s -> {
                    var docType = new DocType();
                    docType.setDocNumber(s);
                    type.getObjectAddressDoc().add(docType);
                });

        type.getTechnicalPlan().add(technicalPlanType());
        setCadastralNumberZU(type);
        setCadastralNumberOKS(type);
        type.setObjectDescription(objectDescriptionType());
        return type;
    }

    private void setCadastralNumberZU(ObjectInfoType type) {
        asString(rue.oks13Record, CADASTRALNUM)
                .ifPresent(s -> type.getCadastralNumberOKS().add(s));

        asString(rue.oks13LineRecord, CADASTRALNUM)
                .ifPresent(s -> type.getCadastralNumberOKS().add(s));
    }

    private void setCadastralNumberOKS(ObjectInfoType type) {
        asString(rue.landplotRecord, CADASTRALNUM)
                .ifPresent(s -> type.getCadastralNumberZU().add(s));
    }

    private ObjectDescriptionType objectDescriptionType() {
        var type = new ObjectDescriptionType();
        type.setOverallPerformance(overallPerformanceType());
        type.setEnergyEfficiency(energyEfficiencyType());

        asString(rue.section13Record, FieldsSection.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL)
                .ifPresentOrElse(objecPpurposeFunctional -> {
                    switch (objecPpurposeFunctional) {
                        case PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_REF_VALUE_4: {
                            type.setUnlivingObjects(unlivingObjectsType());
                        }
                        break;
                        case PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_REF_VALUE_3: {
                            type.setLivingObjects(livingObjectsType());
                        }
                        break;
                        case PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_REF_VALUE_2: {
                            type.setProductiveObjects(productiveObjectsType());
                        }
                        break;
                        case PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_REF_VALUE_5: {
                            type.setLongObjects(longObjectsType());
                        }
                        break;
                        default: {
                            // ничего не заполняем
                        }
                    }
                }, () -> {
                    throw new SmevRequestException("field 'object_purpose_functional' is empty");
                });

        return type;
    }

    private OverallPerformanceType overallPerformanceType() {
        var type = new OverallPerformanceType();

        var heightObject = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_HEIGHT_FA)
                .ifPresent(heightObject::setInFact);
        type.setHeightObject(heightObject);

        var premisesCount = new ProjectFactType();
        asString(rue.rveoksRecord, FieldsRveoks.PROPERTY_NUMBER_ROOM_PR)
                .ifPresent(premisesCount::setInProject);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_NUMBER_ROOM_FA)
                .ifPresent(premisesCount::setInFact);
        type.setPremisesCount(premisesCount);

        var buildingArea = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_BUILDING_AREA_FA)
                .ifPresent(buildingArea::setInFact);
        type.setBuildingArea(buildingArea);

        var areaBuildingPartObject = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_BUILDING_AREA_OKS_PART_FA)
                .ifPresent(areaBuildingPartObject::setInProject);
        type.setAreaBuildingPartObject(areaBuildingPartObject);

        var areaObjectCap = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_AREA_OKS_PART_FA)
                .ifPresent(areaObjectCap::setInFact);
        type.setAreaObjectCap(areaObjectCap);

        var numberBuildings = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_NUMBER_BUILDINGS_FA)
                .ifPresent(numberBuildings::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_NUMBER_BUILDINGS_PR)
                .ifPresent(numberBuildings::setInProject);
        type.setNumberBuildings(numberBuildings);

        var outbuildingArea = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_BUILT_IN_AREA_FA)
                .ifPresent(outbuildingArea::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_BUILT_IN_AREA_PR)
                .ifPresent(outbuildingArea::setInProject);
        type.setOutbuildingArea(outbuildingArea);

        var unlivingArea = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_TOTAL_AREA_NOT_LIVING_PR)
                .ifPresent(unlivingArea::setInProject);
        type.setUnlivingArea(unlivingArea);

        var totalArea = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_TOTAL_AREA_FA)
                .ifPresent(totalArea::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_TOTAL_AREA_PR)
                .ifPresent(totalArea::setInProject);
        type.setTotalArea(totalArea);

        var groundPart = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_BUILDING_VOLUME_TOTAL_ABOVE_GROUND_FA)
                .ifPresent(groundPart::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_BUILDING_VOLUME_TOTAL_ABOVE_GROUND_PR)
                .ifPresent(groundPart::setInProject);
        type.setGroundPart(groundPart);

        var buildingVolume = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_BUILDING_VOLUME_TOTAL_FA)
                .ifPresent(buildingVolume::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_BUILDING_VOLUME_TOTAL_PR)
                .ifPresent(buildingVolume::setInProject);
        type.setBuildingVolume(buildingVolume);

        return type;
    }

    private UnlivingObjectsType unlivingObjectsType() {
        var type = new UnlivingObjectsType();
        // rveoksPartRecord
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_OTHER_INDICATORS_NON_PROD_FAC_PR)
                .ifPresent(type::setOtherIndex);

        var roofingMaterials = new RefBookProjectFactType();
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_ROOF_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(roofingMaterials::setInProject);
        type.setRoofingMaterials(roofingMaterials);

        var ceilingMaterials = new RefBookProjectFactType();
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_FLOOR_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(ceilingMaterials::setInProject);
        type.setCeilingMaterials(ceilingMaterials);

        var materialsWall = new RefBookProjectFactType();
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_WALL_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(materialsWall::setInProject);
        type.setMaterialsWall(materialsWall);

        var materialsFoundations = new RefBookProjectFactType();
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_FOUNDATION_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(materialsFoundations::setInProject);
        type.setMaterialsFoundations(materialsFoundations);

        var wheelchairLifts = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_WHEELCHAIR_LIFTS_NON_PROD_FAC_FA)
                .ifPresent(wheelchairLifts::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_WHEELCHAIR_LIFTS_NON_PROD_FAC_PR)
                .ifPresent(wheelchairLifts::setInProject);
        type.setWheelchairLifts(wheelchairLifts);

        var escalators = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ESCALATORS_NON_PROD_FAC_FA)
                .ifPresent(escalators::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ESCALATORS_NON_PROD_FAC_PR)
                .ifPresent(escalators::setInProject);
        type.setEscalators(escalators);

        var elevators = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ELEVATORS_NON_PROD_FAC_FA)
                .ifPresent(elevators::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ELEVATORS_NON_PROD_FAC_PR)
                .ifPresent(elevators::setInProject);
        type.setElevators(elevators);

        var capacity = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_CAPACITY_NON_PROD_FAC_FA)
                .ifPresent(capacity::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_CAPACITY_NON_PROD_FAC_PR)
                .ifPresent(capacity::setInProject);
        type.setCapacity(capacity);

        var numberRooms = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_NUMBER_ROOM_NON_PROD_FAC_FA)
                .ifPresent(numberRooms::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_NUMBER_ROOM_NON_PROD_FAC_PR)
                .ifPresent(numberRooms::setInProject);
        type.setNumberRooms(numberRooms);

        var numberSeats = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_NUMBER_PLACE_NON_PROD_FAC_FA)
                .ifPresent(numberSeats::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_NUMBER_PLACE_NON_PROD_FAC_PR)
                .ifPresent(numberSeats::setInProject);
        type.setNumberSeats(numberSeats);

        // rsoksRecord
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ROOF_MATERIALS_FA)
                .ifPresent(type::setCorrectRoofingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FLOOR_MATERIALS_FA)
                .ifPresent(type::setCorrectCeilingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_WALL_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsWall);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUNDATION_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsFoundations);

        var maxUndergroundFloors = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MAX_UNDERGROUND_FLOORS)
                .ifPresent(maxUndergroundFloors::setInFact);
        type.setMaxUndergroundFloors(maxUndergroundFloors);

        var minUndergroundFloors = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MIN_UNDERGROUND_FLOORS)
                .ifPresent(minUndergroundFloors::setInFact);
        type.setMinUndergroundFloors(minUndergroundFloors);

        var maxNumberFloors = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MAX_NUMBER_FLOOR_FA)
                .ifPresent(maxNumberFloors::setInFact);
        type.setMaxNumberFloors(maxNumberFloors);

        var minNumberFloors = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MIN_NUMBER_FLOOR_FA)
                .ifPresent(minNumberFloors::setInFact);
        type.setMinNumberFloors(minNumberFloors);

        return type;
    }

    private LivingObjectsType livingObjectsType() {
        var type = new LivingObjectsType();

        // rveoksPartRecord
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_OTHER_INDICATORS_NON_PROD_FAC_PR)
                .ifPresent(type::setOtherIndex);
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_ROOF_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(refBookType -> {
                    var ref = new RefBookProjectFactType();
                    ref.setInProject(refBookType);
                    type.setRoofingMaterials(ref);
                });
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_FLOOR_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(refBookType -> {
                    var ref = new RefBookProjectFactType();
                    ref.setInProject(refBookType);
                    type.setCeilingMaterials(ref);
                });
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_WALL_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(refBookType -> {
                    var ref = new RefBookProjectFactType();
                    ref.setInProject(refBookType);
                    type.setMaterialsWall(ref);
                });
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_FOUNDATION_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(refBookType -> {
                    var ref = new RefBookProjectFactType();
                    ref.setInProject(refBookType);
                    type.setMaterialsFoundations(ref);
                });

        var wheelchairLifts = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_WHEELCHAIR_LIFTS_NON_PROD_FAC_PR)
                .ifPresent(wheelchairLifts::setInProject);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_WHEELCHAIR_LIFTS_NON_PROD_FAC_FA)
                .ifPresent(wheelchairLifts::setInFact);
        type.setWheelchairLifts(wheelchairLifts);

        var escalators = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ESCALATORS_NON_PROD_FAC_FA)
                .ifPresent(escalators::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ESCALATORS_NON_PROD_FAC_PR)
                .ifPresent(escalators::setInProject);
        type.setEscalators(escalators);

        var elevators = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ELEVATORS_NON_PROD_FAC_FA)
                .ifPresent(elevators::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ELEVATORS_NON_PROD_FAC_PR)
                .ifPresent(elevators::setInProject);
        type.setElevators(escalators);

        // rsoksPartRecord
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ROOF_MATERIALS_FA)
                .ifPresent(type::setCorrectRoofingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FLOOR_MATERIALS_FA)
                .ifPresent(type::setCorrectCeilingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_WALL_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsWall);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUNDATION_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsFoundations);

        var livingArea2 = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITH_BALCONY_FA)
                .ifPresent(livingArea2::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITH_BALCONY_PR)
                .ifPresent(livingArea2::setInProject);
        type.setLivingArea2(livingArea2);

        var areaMoreRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MORE_THEN_FOUR_ROOM_AREA_FA)
                .ifPresent(areaMoreRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MORE_THEN_FOUR_ROOM_AREA_PR)
                .ifPresent(areaMoreRoom::setInProject);
        type.setAreaMoreRoom(areaMoreRoom);

        var numberMoreRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MORE_THEN_FOUR_ROOM_AREA_FA)
                .ifPresent(numberMoreRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MORE_THEN_FOUR_ROOM_AREA_PR)
                .ifPresent(numberMoreRoom::setInProject);
        type.setNumberMoreRoom(numberMoreRoom);

        var areaFourRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUR_ROOM_AREA_FA)
                .ifPresent(areaFourRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUR_ROOM_AREA_PR)
                .ifPresent(areaFourRoom::setInProject);
        type.setAreaFourRoom(areaFourRoom);

        var numberFourRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUR_ROOM_FA)
                .ifPresent(numberFourRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUR_ROOM_PR)
                .ifPresent(numberFourRoom::setInProject);
        type.setNumberFourRoom(numberFourRoom);

        var areaThreeRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_THREE_ROOM_AREA_FA)
                .ifPresent(areaThreeRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_THREE_ROOM_AREA_PR)
                .ifPresent(areaThreeRoom::setInProject);
        type.setAreaThreeRoom(areaThreeRoom);

        var numberThreeRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_THREE_ROOM_FA)
                .ifPresent(numberThreeRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_THREE_ROOM_PR)
                .ifPresent(numberThreeRoom::setInProject);
        type.setNumberThreeRoom(numberThreeRoom);

        var areaTwoRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_TWO_ROOM_AREA_FA)
                .ifPresent(areaTwoRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_TWO_ROOM_AREA_PR)
                .ifPresent(areaTwoRoom::setInProject);
        type.setAreaTwoRoom(areaTwoRoom);

        var numberTwoRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_TWO_ROOM_FA)
                .ifPresent(numberTwoRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_TWO_ROOM_PR)
                .ifPresent(numberTwoRoom::setInProject);
        type.setNumberTwoRoom(numberTwoRoom);

        var areaOneRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ONE_ROOM_AREA_FA)
                .ifPresent(areaOneRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ONE_ROOM_AREA_PR)
                .ifPresent(areaOneRoom::setInProject);
        type.setAreaOneRoom(areaOneRoom);

        var numberOneRoom = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ONE_ROOM_FA)
                .ifPresent(numberOneRoom::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ONE_ROOM_PR)
                .ifPresent(numberOneRoom::setInProject);
        type.setNumberOneRoom(numberOneRoom);

        var areaApartments = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_APPARTMENTS_TOTAL_AREA_FA)
                .ifPresent(areaApartments::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_APPARTMENTS_TOTAL_AREA_PR)
                .ifPresent(areaApartments::setInProject);
        type.setAreaApartments(areaApartments);

        var premisesLivingCount = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_LIVING_ROOM_FA)
                .ifPresent(premisesLivingCount::setInFact);
        type.setPremisesLivingCount(premisesLivingCount);

        var numberSections = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_SECTIONS_FA)
                .ifPresent(numberSections::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_SECTIONS_PR)
                .ifPresent(numberSections::setInProject);
        type.setNumberSections(numberSections);

        var maxUndergroundFloors = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MAX_UNDERGROUND_FLOORS)
                .ifPresent(maxUndergroundFloors::setInFact);
        type.setMaxUndergroundFloors(maxUndergroundFloors);

        var minUndergroundFloors = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MIN_UNDERGROUND_FLOORS)
                .ifPresent(minUndergroundFloors::setInFact);
        type.setMinUndergroundFloors(minUndergroundFloors);

        var maxNumberFloors = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MAX_NUMBER_FLOOR_FA)
                .ifPresent(maxNumberFloors::setInFact);
        type.setMaxNumberFloors(maxNumberFloors);

        var minNumberFloors = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MIN_NUMBER_FLOOR_FA)
                .ifPresent(minNumberFloors::setInFact);
        type.setMinNumberFloors(minNumberFloors);

        var unlivingArea = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_AREA_NOT_LIVING_FA)
                .ifPresent(unlivingArea::setInFact);
        type.setUnlivingArea(unlivingArea);

        var livingArea = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITHOUT_BALCONY_FA)
                .ifPresent(livingArea::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITHOUT_BALCONY_PR)
                .ifPresent(livingArea::setInProject);
        type.setLivingArea(livingArea);

        return type;
    }

    private ProductiveObjectsType productiveObjectsType() {
        var type = new ProductiveObjectsType();

        // rveoksPartRecord
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_OTHER_INDICATORS_NON_PROD_FAC_PR)
                .ifPresent(type::setOtherIndex);
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_ROOF_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(refBookType -> {
                    var ref = new RefBookProjectFactType();
                    ref.setInProject(refBookType);
                    type.setRoofingMaterials(ref);
                });
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_FLOOR_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(refBookType -> {
                    var ref = new RefBookProjectFactType();
                    ref.setInProject(refBookType);
                    type.setCeilingMaterials(ref);
                });
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_WALL_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(refBookType -> {
                    var ref = new RefBookProjectFactType();
                    ref.setInProject(refBookType);
                    type.setMaterialsWall(ref);
                });
        asRefBookType(rue.rveoksPartRecord, FieldsRveoksPart.TABLE,
                      FieldsRveoksPart.PROPERTY_FOUNDATION_MATERIALS_NON_PROD_FAC_PR)
                .ifPresent(refBookType -> {
                    var ref = new RefBookProjectFactType();
                    ref.setInProject(refBookType);
                    type.setMaterialsFoundations(ref);
                });

        var wheelchairLifts = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_WHEELCHAIR_LIFTS_NON_PROD_FAC_PR)
                .ifPresent(wheelchairLifts::setInProject);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_WHEELCHAIR_LIFTS_NON_PROD_FAC_FA)
                .ifPresent(wheelchairLifts::setInFact);
        type.setWheelchairLifts(wheelchairLifts);

        var escalators = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ESCALATORS_NON_PROD_FAC_FA)
                .ifPresent(escalators::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ESCALATORS_NON_PROD_FAC_PR)
                .ifPresent(escalators::setInProject);
        type.setEscalators(escalators);

        var elevators = new ProjectFactType();
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ELEVATORS_NON_PROD_FAC_FA)
                .ifPresent(elevators::setInFact);
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_ELEVATORS_NON_PROD_FAC_PR)
                .ifPresent(elevators::setInProject);
        type.setElevators(escalators);

        // rsoksPartRecord
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ROOF_MATERIALS_FA)
                .ifPresent(type::setCorrectRoofingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ROOF_MATERIALS_FA)
                .ifPresent(type::setCorrectRoofingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FLOOR_MATERIALS_FA)
                .ifPresent(type::setCorrectCeilingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_WALL_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsWall);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUNDATION_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsFoundations);

        var performance = new MesProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_PERFORMANCE_PR)
                .ifPresent(elevators::setInProject);
        type.setPerformance(performance);

        var powerProjectFactType = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_POWER)
                .ifPresent(powerProjectFactType::setInProject);
        var power = new MesProjectFactType();
        power.setProjectFact(powerProjectFactType);
        type.setPower(power);

        var objectType = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_OKS_TYPE_FA)
                .ifPresent(objectType::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_OKS_TYPE_PR)
                .ifPresent(objectType::setInProject);
        type.setObjectType(objectType);

        // section13
        asString(rue.section13Record, FieldsSection.PROPERTY_OBJECT_NAME_EIS)
                .ifPresent(type::setObjectName);

        return type;
    }

    private LongObjectsType longObjectsType() {
        var type = new LongObjectsType();

        // rveoksPartRecord
        asString(rue.rveoksPartRecord, FieldsRveoksPart.PROPERTY_OTHER_INDICATORS_NON_PROD_FAC_PR)
                .ifPresent(type::setOtherIndex);

        // rsoksPartRecord
        var projectFactType = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_STRUCTURAL_ELEMENTS_SAFETY_FA)
                .ifPresent(projectFactType::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_STRUCTURAL_ELEMENTS_SAFETY_PR)
                .ifPresent(projectFactType::setInProject);
        type.setStructuralElements(projectFactType);

        var powerLinesLevel = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_POWER_LINES_LEVEL)
                .ifPresent(powerLinesLevel::setInFact);
        type.setPowerLinesLevel(powerLinesLevel);

        var powerLinesType = new RefBookProjectFactType();
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_POWER_LINES_TYPE)
                .ifPresent(powerLinesType::setInProject);
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_POWER_LINES_TYPE_FA)
                .ifPresent(powerLinesType::setInFact);
        type.setPowerLinesType(powerLinesType);

        var pipeCharacteristics = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_PIPELINES_INFO_FA)
                .ifPresent(pipeCharacteristics::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_PIPELINES_INFO_PR)
                .ifPresent(pipeCharacteristics::setInProject);
        type.setPipeCharacteristics(pipeCharacteristics);

        var mesProjectFactType = new MesProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_POWER)
                .ifPresent(s -> {
                    var powerProjectFactType = new ProjectFactType();
                    powerProjectFactType.setInProject(s);
                    mesProjectFactType.setProjectFact(powerProjectFactType);
                });
        type.setPower(mesProjectFactType);

        var lengthPart = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_LENGTH_PART)
                .ifPresent(lengthPart::setInFact);
        type.setLengthPart(lengthPart);

        var extension = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_LENGTH)
                .ifPresent(extension::setInFact);
        type.setExtension(extension);

        var category = new RefBookProjectFactType();
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_LINE_OBJECT_CLASSES)
                .ifPresent(category::setInProject);
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_LINE_OBJECT_CLASSES_FA)
                .ifPresent(category::setInFact);
        type.setCategory(category);

        return type;
    }

    private EnergyEfficiencyType energyEfficiencyType() {
        var type = new EnergyEfficiencyType();

        var energyEfficiency = new RefBookProjectFactType();
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_ENERGY_EFFICIENCY_CLASS_PR)
                .ifPresent(energyEfficiency::setInProject);
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_ENERGY_EFFICIENCY_CLASS_FA)
                .ifPresent(energyEfficiency::setInFact);
        type.setEnergyEfficiency(energyEfficiency);

        var heatConsumption = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_SPECIFIC_CONSUMPTION_THERMAL_ENERGY_FA)
                .ifPresent(heatConsumption::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_SPECIFIC_CONSUMPTION_THERMAL_ENERGY_PR)
                .ifPresent(heatConsumption::setInProject);
        type.setHeatConsumption(heatConsumption);

        var insulatedMaterials = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_INSULATION_MATERIALS_EXTERNAL_ENCLOSING_STRUCTURES_FA)
                .ifPresent(insulatedMaterials::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_INSULATION_MATERIALS_EXTERNAL_ENCLOSING_STRUCTURES_PR)
                .ifPresent(insulatedMaterials::setInProject);
        type.setInsulatedMaterials(insulatedMaterials);

        var skylights = new ProjectFactType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FILLING_LIGHT_OPENINGS_FA)
                .ifPresent(skylights::setInFact);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FILLING_LIGHT_OPENINGS_PR)
                .ifPresent(skylights::setInProject);
        type.setSkylights(skylights);

        return type;
    }

    private TechnicalPlanType technicalPlanType() {
        var type = new TechnicalPlanType();
        asString(rue.techPlanRecord, FieldsTechPlan.PROPERTY_TITLE)
                .ifPresent(type::setTechnicalPlanID);
        asXMLGregorianCalendar(rue.techPlanRecord, FieldsTechPlan.PROPERTY_ISSUE_DATE)
                .ifPresent(type::setDTechnicalPlan);

        var engineerType = new EngineerType();
        asString(rue.techPlanRecord, FieldsTechPlan.PROPERTY_SNILS_CADASTER_ENGINEER)
                .ifPresent(engineerType::setEngineerSnils);
        asXMLGregorianCalendar(rue.techPlanRecord, FieldsTechPlan.PROPERTY_CADASTRE_ENGINEER_REGISTRY_DATE)
                .ifPresent(engineerType::setDCertificate);
        asString(rue.techPlanRecord, FieldsTechPlan.PROPERTY_CADASTRE_ENGINEER_FULL_NAME)
                .map(RegisterRnvXmlBuildProcessor::mapFio)
                .ifPresent(engineerType::setEngineerFIO);

        var docType = new DocType();
        asString(rue.techPlanRecord, FieldsTechPlan.PROPERTY_CADASTRE_ENGINEER_CERTIFICATE_NUMBER)
                .ifPresent(docType::setDocNumber);
        asXMLGregorianCalendar(rue.techPlanRecord, FieldsTechPlan.PROPERTY_CADASTRE_ENGINEER_CERTIFICATE_DATE)
                .ifPresent(docType::setDocDate);
        asString(rue.techPlanRecord, FieldsTechPlan.PROPERTY_CADASTRE_ENGINEER_CERTIFICATE_ORGANIZATION)
                .ifPresent(docType::setDocIssueOrganization);

        engineerType.setCertificateDoc(docType);
        type.setEngineer(engineerType);

        return type;
    }

    /**
     * Порядок "фамилия имя отчество"
     */
    private static FIOType mapFio(String source) {
        if (source == null) {
            return null;
        }

        // Разбиваем на
        var strArr = new ArrayList<>(Arrays.asList(source.split(" ")));

        // добавляем недостающих элементов
        while (strArr.size() < 3) {
            strArr.add("_");
        }

        var fioType = new FIOType();
        fioType.setSurname(strArr.get(0));
        fioType.setName(strArr.get(1));
        fioType.setMiddleName(strArr.get(2));
        return fioType;
    }

    private Optional<RefBookType> asRefBookType(IRecord record,
                                                String tableName,
                                                String fieldName) {
        return asRefType(record, tableName, fieldName)
                .map(valueTitle -> {
                    var refType = new RefBookType();
                    refType.setCode(valueTitle.getCode());
                    refType.setName(valueTitle.getName());
                    return refType;
                });
    }

    /**
     * Для хранения объектов, который будут переиспользоваться
     */
    static class ReusableElements {

        private IRecord section13Record;
        private IRecord developer_CustomerRecord;
        private IRecord developerOrganizationRecord;
        private IRecord rveoksRecord;
        private IRecord rveoksPartRecord;
        private IRecord techPlanRecord;
        private IRecord rsoksRecord;
        private IRecord rsoksPartRecord;
        private IRecord rsoksSection13Record;
        private IRecord rsoksSection13SupplierRecord;
        private IRecord rsoksSection13SupplierOrganizationRecord;
        private IRecord oks13Record;
        private IRecord oks13LineRecord;
        private IRecord landplotRecord;
        private IRecord usersAfterTriggerRecord;
        private IRecord supplier_SupplierRecord;
        private IRecord supplierOrganizationRecord;
    }
}
