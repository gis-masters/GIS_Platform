package ru.mycrg.data_service.service.smev3.request.register_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.smev3.RegisterRnsRequestDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.fields.*;
import ru.mycrg.data_service.register_rns_1_0_10.*;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.model.SmevRequestConst;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcess;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.util.xml.XmlMapper;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;

public class RegisterRnsXmlBuildProcess extends AXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(RegisterRnsXmlBuildProcess.class);
    private final ReusableElements rue = new ReusableElements();

    // Заглушка
    private final FileType stubScan = new FileType();

    public RegisterRnsXmlBuildProcess(RequestProcessor requestProcessor) {
        super(requestProcessor);

        var attachmentRefType = new AttachmentRefType();
        attachmentRefType.setAttachmentId("37850413882942517_PHC_08.04.2022_19.01.53.pdf");
        this.stubScan.setName("PHC_08.04.2022_19.01.53.pdf");
        this.stubScan.setAttachmentRef(attachmentRefType);
    }

    public BuildRequestAndSources<Request> run(@NotNull RegisterRnsRequestDto dto) {
        try {
            loadRecords(dto.getRecId());
            var request = requestType();

            // TODO временная мера
            if (dto.getStubFields()) {
                Stub.fillStubFields(request, rue);
            }

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }

    private void loadRecords(Long section13Id) {
        rue.section13Record = getRecordById(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsSection.TABLE_13,
                FieldsSection.TABLE_13,
                section13Id
        );
        log.debug("section13Record read. is not null {}", rue.section13Record != null);

        rue.developerRecord = asRefRecord(
                rue.section13Record,
                FieldsSection.PROPERTY_DEVELOPER_DATA_CONNECTION
        ).orElse(null);
        log.debug("developerRecord read. is not null {}", rue.developerRecord != null);

        rue.developerOrganizationRecord = asRefRecord(
                rue.developerRecord,
                FieldsCustomer.PROPERTY_ORGANIZATION
        ).orElse(null);
        log.debug("developerOrganozationRecord read. is not null {}", rue.developerOrganizationRecord != null);

        rue.supplierRecord = asRefRecord(
                rue.section13Record,
                FieldsSection.PROPERTY_SUPPLIER_DATA_CONNECTION
        ).orElse(null);
        log.debug("supplierRecord read. is not null {}", rue.supplierRecord != null);

        rue.supplierOrganizationRecord = asRefRecord(
                rue.supplierRecord,
                FieldsSupplier.PROPERTY_ORGANIZATION_DATA_CONNECTION
        ).orElse(null);
        log.debug("supplierOrganizationRecord read. is not null {}", rue.supplierOrganizationRecord != null);

        rue.rsoksRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRsoks.TABLE,
                FieldsRsoks.TABLE,
                FieldsRsoks.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION,
                rue.section13Record.getId()
        );
        log.debug("rsoksRecord read. is not null {}", rue.rsoksRecord != null);

        // rsoks
        rue.rsoksPartRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRsoksPart.TABLE,
                FieldsRsoksPart.TABLE,
                FieldsRsoksPart.PROPERTY_DL_DATA_RSOKS_DATA_CONNECTION,
                rue.rsoksRecord.getId()
        );
        log.debug("rsoksPartRecord read. is not null {}", rue.rsoksPartRecord != null);

        rue.gpzuRecord = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_GPZU_DATA_CONNECTION
        ).orElse(null);
        log.debug("rsoksGpzuRecord read. is not null {}", rue.gpzuRecord != null);

        rue.gpzuSection13Record = asRefRecord(
                rue.gpzuRecord,
                FieldsGpzu.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION
        ).orElse(null);
        log.debug("gpzuSection13Record read. is not null {}", rue.gpzuSection13Record != null);

        rue.gpzuSection13LandplotRecord = getRecordByJsonIdValue(
                ResourceType.FEATURE,
                FieldsLandplot.WORKSPACE,
                FieldsLandplot.SCHEMA,
                FieldsLandplot.TABLE,
                FieldsLandplot.PROPERTY_FILE,
                rue.gpzuSection13Record.getId()
        );
        log.debug("gpzuSection13LandplotRecord read. is not null {}", rue.gpzuSection13LandplotRecord != null);

        rue.tarRecord = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_TAR_DATA_CONNECTION
        ).orElse(null);
        log.debug("tarRecord read. is not null {}", rue.tarRecord != null);

        rue.pptRecord = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_PPT_DATA_CONNECTION
        ).orElse(null);
        log.debug("pptRecord read. is not null {}", rue.pptRecord != null);

        rue.rsoksSection13_geceRecord = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_GECE_DATA_CONNECTION
        ).orElse(null);
        log.debug("geceRecord read. is not null {}", rue.rsoksSection13_geceRecord != null);

        rue.landplotRecord = getRecordByJsonIdValue(
                ResourceType.FEATURE,
                FieldsLandplot.WORKSPACE,
                FieldsLandplot.SCHEMA,
                FieldsLandplot.TABLE,
                FieldsLandplot.PROPERTY_FILE,
                rue.section13Record.getId()
        );
        log.debug("landplotRecord read. is not null {}", rue.landplotRecord != null);
    }

    /**
     * Корневая сущность
     */
    private Request requestType() {
        var type = new ConstructionType();
        asString(rue.section13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setConstPermitNumber);
        asLocalDateTime(rue.section13Record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setConstPermitDate);
        asString(rue.section13Record, FieldsSection.PROPERTY_IDENTIFIER)
                .ifPresent(type::setConstPermitID);
        asInt(rue.section13Record, FieldsSection.PROPERTY_CONST_GOVERNMENT_ORDER_ID)
                .ifPresent(type::setConstGovernmentOrderId);
        asString(rue.section13Record, FieldsSection.PROPERTY_CONST_CADASTRAL_DISTRICT)
                .ifPresent(type::setConstCadastralDistrict);
        asString(rue.section13Record, FieldsSection.PROPERTY_CONST_CADASTRAL_AREA)
                .ifPresent(type::setConstCadastralArea);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_CONSTRUCTION_TYPE)
                .ifPresent(type::setConstructionKind);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_PERMISSION_TYPE)
                .ifPresent(type::setConstPermissionType);
        asString(rue.section13Record, FieldsSection.PROPERTY_NAME_FROM_P_D)
                .ifPresent(type::setObjectNameProjectDoc);
        asString(rue.section13Record, FieldsSection.PROPERTY_NUMBER_OBJECTS)
                .ifPresent(type::setNumberObjects);
        asString(rue.section13Record, FieldsSection.PROPERTY_NUMBER_LONG_OBJECTS)
                .ifPresent(type::setNumberLongObjects);
        asStatus(rue.section13Record, FieldsSection.PROPERTY_DOC_STATUS)
                .ifPresent(type::setStatusConstruction);
        asLocalDateTime(rue.section13Record, FieldsSection.PROPERTY_VALID_UNTIL)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setExpireDate);

        // Добавляем вложение
        asAttachment(rue.section13Record, FieldsSection.PROPERTY_FILE);

        // Вставляем заглушку. Это валидное поведение
        type.getScans().add(stubScan);

        type.setIssueOrgan(issueOrgan());
        type.setRecipientInfo(recipientInfo());
        type.getObjectInfo().add(objectInfo());

        var request = new Request();
        request.setRegisterNewConstruction(type);

        return request;
    }

    private RecipientInfoType recipientInfo() {
        var recipientInfoType = new RecipientInfoType();
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_EMAIL)
                .ifPresent(recipientInfoType::setEmail);

        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_ACTUAL_ADDRESS)
                .ifPresent(s -> {
                    var addressFullType = new AddressFullType();
                    addressFullType.setNote(s);
                    addressFullType.setRegion(SmevRequestConst.CRIMEA_REGION);
                    recipientInfoType.setMailingAddress(addressFullType);
                });

        var organizationInfoType = new OrganizationInfoType();
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(organizationInfoType::setOrganizationName);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_ORGN)
                .ifPresent(organizationInfoType::setOGRN);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_INN)
                .ifPresent(organizationInfoType::setINN);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_KPP)
                .ifPresent(organizationInfoType::setKPP);
        recipientInfoType.setOrganizationInfo(organizationInfoType);

        return recipientInfoType;
    }

    private OrganizationInfoType issueOrgan() {
        var type = new OrganizationInfoType();
        asString(rue.supplierOrganizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(type::setOrganizationName);
        asString(rue.supplierOrganizationRecord, FieldsOrganization.PROPERTY_INN)
                .ifPresent(type::setINN);
        asString(rue.supplierOrganizationRecord, FieldsOrganization.PROPERTY_ORGN)
                .ifPresent(type::setOGRN);
        asString(rue.supplierOrganizationRecord, FieldsOrganization.PROPERTY_KPP)
                .ifPresent(type::setKPP);

        return type;
    }

    private ObjectInfoType objectInfo() {
        var type = new ObjectInfoType();
        type.setObjectProjectDescription(objectProjectDescriptionType());
        type.setInfoDocDescription(infoDocDescriptionType());

        return type;
    }

    private ObjectProjectDescriptionType objectProjectDescriptionType() {
        var type = new ObjectProjectDescriptionType();
        type.setProjectLongObjects(projectLongObjectsType());
        type.setOtherProjectObject(otherProjectObjectType());
        type.setShortProjectObject(shortProjectObjectType());

        return type;
    }

    private OtherProjectObjectType otherProjectObjectType() {
        var type = new OtherProjectObjectType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_APPARTMENTS_TOTAL)
                .ifPresent(type::setNumberApartments);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ONE_ROOM_PR)
                .ifPresent(type::setNumberOneRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ONE_ROOM_AREA_PR)
                .ifPresent(type::setAreaOneRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_TWO_ROOM_PR)
                .ifPresent(type::setNumberTwoRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_TWO_ROOM_AREA_PR)
                .ifPresent(type::setAreaTwoRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_THREE_ROOM_PR)
                .ifPresent(type::setNumberThreeRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_THREE_ROOM_AREA_PR)
                .ifPresent(type::setAreaThreeRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUR_ROOM_PR)
                .ifPresent(type::setNumberFourRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUR_ROOM_AREA_FA)
                .ifPresent(type::setAreaFourRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MORE_THEN_FOUR_ROOM_FA)
                .ifPresent(type::setNumberMoreRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MORE_THEN_FOUR_ROOM_AREA_FA)
                .ifPresent(type::setAreaMoreRoom);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITH_BALCONY_FA)
                .ifPresent(type::setLivingArea2);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITHOUT_BALCONY_FA)
                .ifPresent(type::setLivingArea);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITHOUT_BALCONY_FA)
                .ifPresent(type::setLivingArea);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_AREA_NOT_LIVING_FA)
                .ifPresent(type::setUnlivingArea);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_NOT_LIVING_ROOM_FA)
                .ifPresent(type::setNumberUnlivigPremise);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_LIVING_ROOM_FA)
                .ifPresent(type::setPremisesLivingCount);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_ROOM_FA)
                .ifPresent(type::setPremisesCount);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_PARKING_SPACE_FA)
                .ifPresent(type::setNumberParkingSpase);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ESCALATORS_FA)
                .ifPresent(type::setElevators);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_WHEELCHAIR_LIFTS_FA)
                .ifPresent(type::setWheelchairLifts);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUNDATION_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsFoundations);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_WALL_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsWall);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_FLOOR_MATERIALS_FA)
                .ifPresent(type::setCorrectCeilingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_ROOF_MATERIALS_FA)
                .ifPresent(type::setCorrectRoofingMaterials);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_OTHER_INDICATORS_FA)
                .ifPresent(type::setOtherIndex);

        return type;
    }

    private ShortProjectObjectType shortProjectObjectType() {
        var type = new ShortProjectObjectType();
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LAND_AREA)
                .ifPresent(type::setTotalArea);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_BUILDING_AREA)
                .ifPresent(type::setBuildingArea);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_BUILDING_AREA_OKS_PART)
                .ifPresent(type::setAreaObjectCap);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_BUILDING_AREA_OKS_PART)
                .ifPresent(type::setAreaBuildingPartObject);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_VOLUME)
                .ifPresent(type::setBuildingVolume);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_UNDERGROUND_PART)
                .ifPresent(type::setUndergroundPart);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_CAPACITY_FA)
                .ifPresent(type::setCapacity);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_HEIGHT_FA)
                .ifPresent(type::setHeightObject);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MIN_NUMBER_FLOOR_FA)
                .ifPresent(type::setMinNumberFloors);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MAX_NUMBER_FLOOR_FA)
                .ifPresent(type::setMaxNumberFloors);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MIN_UNDERGROUND_FLOORS)
                .ifPresent(type::setMinUndergroundFloors);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_MAX_UNDERGROUND_FLOORS)
                .ifPresent(type::setMaxUndergroundFloors);

        return type;
    }

    private ProjectLongObjectsType projectLongObjectsType() {
        var type = new ProjectLongObjectsType();
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_LINE_OBJECT_CLASSES)
                .ifPresent(type::setCategory);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_LENGTH)
                .ifPresent(type::setExtension);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_LENGTH)
                .ifPresent(type::setLengthPart);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_POWER)
                .ifPresent(type::setPower);
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_POWER_MEASURE)
                .ifPresent(type::setPowerMeasure);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_PIPELINES_INFO_FA)
                .ifPresent(type::setPipeCharacteristics);
        asRefBookType(rue.rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_POWER_LINES_TYPE)
                .ifPresent(type::setPowerLinesType);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_POWER_LINES_LEVEL).
                ifPresent(type::setPowerLinesLevel);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_STRUCTURAL_ELEMENTS_SAFETY_FA)
                .ifPresent(type::setStructuralElements);
        asString(rue.rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_OTHER_INFO)
                .ifPresent(type::setOtherIndex);

        return type;
    }

    private InfoDocDescriptionType infoDocDescriptionType() {
        var type = new InfoDocDescriptionType();

        // StandardArchitecturalSolution
        Optional.of(standardArchitecturalSolutionDescriptionType()).ifPresentOrElse(tp -> {
            type.getStandardArchitecturalSolutionDescription().add(tp);
            type.setStandardArchitecturalSolutionAvailability(AvailabilityDocType.AVAILABLE);
        }, () -> {
            type.setStandardArchitecturalSolutionAvailability(AvailabilityDocType.NOT_AVAILABLE);
        });

        // LandCadastral
        Optional.of(landCadastralDescriptionType()).ifPresentOrElse(tp -> {
                    type.getLandCadastralDescription().add(tp);
                    type.setLandCadastralAvailability(AvailabilityDocType.AVAILABLE);
                },
                () -> type.setLandCadastralAvailability(AvailabilityDocType.NOT_AVAILABLE)
        );

        // Demarcation
        Optional.of(demarcationDescriptionType()).ifPresentOrElse(tp -> {
                    type.getDemarcationDescription().add(tp);
                    type.setDemarcationAvailability(AvailabilityDocType.AVAILABLE);
                },
                () -> type.setDemarcationAvailability(AvailabilityDocType.NOT_AVAILABLE)
        );

        // DevPlanLandPlot
        Optional.of(devPlanLandPlotDescriptionType()).ifPresentOrElse(tp -> {
                    type.getDevPlanLandPlotDescription().add(tp);
                    type.setDevPlanLandPlotAvailability(AvailabilityDocType.AVAILABLE);
                }, () -> type.setDevPlanLandPlotAvailability(AvailabilityDocType.NOT_AVAILABLE)
        );

        // EcologicalExpertise
        Optional.of(ecologicalExpertiseDescriptionType()).ifPresentOrElse(tp -> {
            type.getEcologicalExpertiseDescription().add(tp);
            type.setEcologicalExpertiseAvailability(AvailabilityDocType.AVAILABLE);
        }, () -> type.setEcologicalExpertiseAvailability(AvailabilityDocType.NOT_AVAILABLE));

        // ExpertiseProject
        asRefRecord(rue.rsoksRecord, FieldsRsoks.PROPERTY_DL_DATA_UGE_DATA_CONNECTION)
                .map(this::expertiseProjectDocDescriptionType)
                .ifPresentOrElse(tp -> {
                            type.getExpertiseProjectDocDescription().add(tp);
                            type.setExpertiseProjectDocAvailability(AvailabilityDocType.AVAILABLE);
                        }, () -> type.setExpertiseProjectDocAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        // ProjectDocumentation
        asRefRecord(rue.rsoksRecord, FieldsRsoks.PROPERTY_DL_DATA_PROJECT_DOCUMENTATION_DESCRIPTION_CONNECTION)
                .map(this::projectDocumentationDescriptionType)
                .ifPresentOrElse(tp -> {
                            type.getProjectDocumentationDescription().add(tp);
                            type.setProjectDocumentationAvailability(AvailabilityDocType.AVAILABLE);
                        }, () -> type.setProjectDocumentationAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        return type;
    }

    private ProjectDocumentationDescriptionType projectDocumentationDescriptionType(IRecord section18Record) {
        var type = new ProjectDocumentationDescriptionType();
        asString(section18Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setProjectDocCode);
        asLocalDateTime(section18Record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setDocumentationDate);
        type.setOrganDocInfo(rue.organDocInfo);

        return type;
    }

    private ExpertiseProjectDocDescriptionType expertiseProjectDocDescriptionType(IRecord ugeRecord) {
        var section13record = asRefRecord(ugeRecord, FieldsUge.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION)
                .orElseThrow(() -> SmevRequestException.recordNotFound("section13", null));
        var type = new ExpertiseProjectDocDescriptionType();
        asString(section13record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setExpertiseProjectDocNumber);
        asLocalDateTime(section13record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setExpertiseProjectDocDate);

        //TODO не понятно что в итоге с вложениями. Но вроде как они не нужны тут
        /*
        asFileRecord(section13record, FieldsSection.PROPERTY_FILE)
                .map(this::attachments)
                .ifPresent(file -> type.getAttachments().addAll(file));
         */

        asRefBookType(ugeRecord, FieldsUge.TABLE, FieldsUge.PROPERTY_PROJECT_DOC_TYPE)
                .ifPresent(type::setProjectDocType);
        type.setOrganDocInfo(rue.organDocInfo);

        return type;
    }

    private OrganDocInfoType organDocInfo_Organization(IRecord organizationRecord) {
        var type = new OrganDocInfoType();
        asBoolean(organizationRecord, FieldsOrganization.PROPERTY_IS_RESIDENT)
                .ifPresent(type::setIsResident);
        asString(organizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(type::setOrganizationName);
        asString(organizationRecord, FieldsOrganization.PROPERTY_INN)
                .ifPresent(type::setINN);
        asString(organizationRecord, FieldsOrganization.PROPERTY_ORGN)
                .ifPresent(type::setOGRNCompany);
        asString(organizationRecord, FieldsOrganization.PROPERTY_ORGANIZATION_REG_NUMBER)
                .ifPresent(type::setOrganizationRegNumber);

        return type;
    }

    private EcologicalExpertiseDescriptionType ecologicalExpertiseDescriptionType() {
        var type = new EcologicalExpertiseDescriptionType();
        asString(rue.rsoksSection13_geceRecord, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setEcologicalExpertiseNumber);
        asLocalDateTime(rue.rsoksSection13_geceRecord, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setEcologicalExpertiseDate);

        //TODO не понятно что в итоге с вложениями. Но вроде как они не нужны тут
        /*
        asFileRecord(rue.rsoksSection13_geceRecord, FieldsSection.PROPERTY_FILE)
                .map(this::attachments)
                .ifPresent(file -> type.getAttachments().addAll(file));
         */

        asRefRecord(rue.rsoksSection13_geceRecord, FieldsSection.PROPERTY_SUPPLIER_DATA_CONNECTION)
                .flatMap(record -> asRefRecord(record, FieldsSupplier.PROPERTY_ORGANIZATION_DATA_CONNECTION))
                .map(this::organDocInfo_Organization)
                .ifPresent(organDocInfoType -> {
                    // информация, полученные на этом шаге используется в других местах
                    rue.organDocInfo.setOrganizationName(organDocInfoType.getOrganizationName());
                    rue.organDocInfo.setOrganizationRegNumber(organDocInfoType.getOrganizationRegNumber());
                    rue.organDocInfo.setOGRNCompany(organDocInfoType.getOGRNCompany());
                    rue.organDocInfo.setINN(organDocInfoType.getINN());
                    rue.organDocInfo.setOrganizationOPF(organDocInfoType.getOrganizationOPF());
                    rue.organDocInfo.setIsResident(organDocInfoType.isIsResident());

                    type.setOrganDocInfo(rue.organDocInfo);
                });

        return type;
    }

    private DevPlanLandPlotDescriptionType devPlanLandPlotDescriptionType() {
        var type = new DevPlanLandPlotDescriptionType();
        asString(rue.gpzuRecord, FieldsGpzu.PROPERTY_LAND_PLOT_PLANNING_ORGANISATION_DOCS)
                .map(string -> {
                    var file = new FileType();
                    file.setName(string);
                    return file;
                })
                .ifPresent(file -> type.getLandPlotPlanningOrganisationDocs().add(file));

        //TODO не понятно что в итоге с вложениями. Но вроде как они не нужны тут
        /*
        asFileRecord(rue.gpzuSection13Record, FieldsSection.PROPERTY_FILE)
                .map(this::attachments)
                .ifPresent(file -> type.getDevPlanLandPlotDocs().addAll(file));
         */

        asLocalDateTime(rue.gpzuSection13Record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setDevPlanLandPlotDate);
        asString(rue.gpzuSection13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setDevPlanLandPlotNumber);

        type.getLandCadastralDescription().add(gpzuLandCadastralDescriptionType());
        type.setOrganDocInfo(rue.organDocInfo);

        return type;
    }

    private LandCadastralDescriptionType gpzuLandCadastralDescriptionType() {
        var type = new LandCadastralDescriptionType();
        asString(rue.gpzuSection13LandplotRecord, FieldsLandplot.PROPERTY_CADASTRALNUM)
                .ifPresent(type::setCadastralNumberZU);
        asString(rue.gpzuSection13LandplotRecord, FieldsLandplot.PROPERTY_AREA)
                .ifPresent(type::setLandPlotArea);

        return type;
    }

    private DemarcationDescriptionType demarcationDescriptionType() {
        var type = new DemarcationDescriptionType();
        asRefBookType(rue.pptRecord, FieldsSection.TABLE_7, FieldsSection.PROPERTY_CONTENT_TYPE_ID)
                .ifPresent(type::setDocType);
        asRefBookType(rue.pptRecord, FieldsSection.TABLE_7, FieldsSection.PROPERTY_ADMINISTRATIVE_DOC_TYPE)
                .ifPresent(type::setAdministrativeDocType);
        asString(rue.pptRecord, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setDemarcationNumber);
        asLocalDateTime(rue.pptRecord, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setDemarcationDate);
        type.setOrganDocInfo(rue.organDocInfo);

        return type;
    }

    private StandardArchitecturalSolutionDescriptionType standardArchitecturalSolutionDescriptionType() {
        var type = new StandardArchitecturalSolutionDescriptionType();
        asString(rue.tarRecord, FieldsSection.PROPERTY_DOC_NAME)
                .ifPresent(type::setNameDoc);
        asString(rue.tarRecord, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setStandArchSolutionCode);
        asLocalDateTime(rue.tarRecord, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::getYear)
                .map(BigInteger::valueOf)
                .ifPresent(type::setStandArchSolutionYear);
        type.setOrganDocInfo(rue.organDocInfo);

        return type;
    }

    private LandCadastralDescriptionType landCadastralDescriptionType() {
        var type = new LandCadastralDescriptionType();
        asString(rue.landplotRecord, FieldsLandplot.PROPERTY_CADASTRALNUM)
                .ifPresent(type::setCadastralNumberZU);
        asString(rue.landplotRecord, FieldsLandplot.PROPERTY_AREA)
                .ifPresent(type::setLandPlotArea);

//        if (stubAttachments == false) {
//            asFileRecord(landplotRecord, FieldsLandplot.PROPERTY_ATTACHMENTS)
//                    .map(this::attachments)
//                    .ifPresent(fileType -> type.getAttachments().addAll(fileType));
//        }

        return type;
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

    private Optional<StatusConstructionType> asStatus(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(s -> {
                    switch (s) {
                        // Выдан
                        case "0С.1":
                            return StatusConstructionType.ISSUED;
                        //Действие прекращено
                        case "0С.2":
                            return StatusConstructionType.TERMINATED;
                        default:
                            throw new SmevRequestException("document status is undefined :" + s);
                    }
                });
    }

    /**
     * Для хранения объектов, который будут переиспользоваться
     */
    static class ReusableElements {
        private IRecord section13Record;
        private IRecord developerRecord;
        private IRecord developerOrganizationRecord;
        private IRecord supplierRecord;
        private IRecord supplierOrganizationRecord;
        private IRecord rsoksRecord;
        private IRecord rsoksPartRecord;
        private IRecord gpzuRecord;
        private IRecord gpzuSection13Record;
        private IRecord gpzuSection13LandplotRecord;
        private IRecord tarRecord;
        private IRecord pptRecord;
        private IRecord rsoksSection13_geceRecord;
        private IRecord landplotRecord;

        // Сведения об организации, выдавшей документ
        OrganDocInfoType organDocInfo = new OrganDocInfoType();
    }
}
