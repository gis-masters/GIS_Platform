package ru.mycrg.data_service.service.smev3.request.register_rns;

import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.smev3.RegisterRequestDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rns_1_0_10.*;
import ru.mycrg.data_service.service.smev3.fields.*;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcessor;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.CADASTRALNUM;
import static ru.mycrg.data_service.service.smev3.fields.FieldsSection.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_REF_VALUE_5;
import static ru.mycrg.data_service.service.smev3.model.SmevRequestConst.CRIMEA_REGION;

public class RegisterRnsXmlBuildProcessor extends AXmlBuildProcessor {

    private final Logger log = LoggerFactory.getLogger(RegisterRnsXmlBuildProcessor.class);
    private final ReusableElements rue = new ReusableElements();

    public RegisterRnsXmlBuildProcessor(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public RequestAndSources<Request> run(@NotNull RegisterRequestDto dto) {
        try {
            loadRecords(dto.getRecId());

            // бизнес часть запроса
            Request request = prepareRequest();

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("Не удалось построить запрос: " + e.getMessage());
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

        rue.issuePerson_afterTriggerRecord = asRefRecord(
                rue.section13Record,
                FieldsSection.PROPERTY_ISSUE_PERSON_CONNECTION
        ).orElse(null);
        log.debug("issuePerson_afterTriggerRecord read. is not null {}", rue.issuePerson_afterTriggerRecord != null);

        rue.supplier_SupplierRecord = asRefRecord(
                rue.section13Record,
                FieldsSection.PROPERTY_SUPPLIER_DATA_CONNECTION
        ).orElse(null);
        log.debug("supplier_SupplierRecord read. is not null {}", rue.supplier_SupplierRecord != null);

        rue.rsoksRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRsoks.TABLE,
                FieldsRsoks.TABLE,
                FieldsRsoks.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION,
                rue.section13Record.getId()
        );

        rue.oks13Record = findRecordByJsonIdValue(
                FieldsOks13.WORKSPACE,
                FieldsOks13.SCHEMA,
                FieldsOks13.TABLE,
                FieldsOks13.PROPERTY_FILE,
                rue.section13Record.getId()
        );
        log.debug("oks13Record read. is not null {}", rue.oks13Record != null);

        rue.oks13LineRecord = findRecordByJsonIdValue(
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

        // developer_CustomerRecord
        rue.developerOrganizationRecord = asRefRecord(
                rue.developer_CustomerRecord,
                FieldsCustomer.PROPERTY_ORGANIZATION
        ).orElse(null);
        log.debug("developerOrganozationRecord read. is not null {}", rue.developerOrganizationRecord != null);

        // supplierRecord
        rue.supplierOrganizationRecord = asRefRecord(
                rue.supplier_SupplierRecord,
                FieldsSupplier.PROPERTY_ORGANIZATION_DATA_CONNECTION
        ).orElse(null);
        log.debug("supplierOrganizationRecord read. is not null {}", rue.supplierOrganizationRecord != null);

        // rsoks
        rue.rsoksPartRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRsoksPart.TABLE,
                FieldsRsoksPart.TABLE,
                FieldsRsoksPart.PROPERTY_DL_DATA_RSOKS_DATA_CONNECTION,
                rue.rsoksRecord.getId()
        );

        rue.gpzuRecord = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_GPZU_DATA_CONNECTION
        ).orElse(null);
        log.debug("rsoksGpzuRecord read. is not null {}", rue.gpzuRecord != null);

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

        rue.gece_Section13Record = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_GECE_DATA_CONNECTION
        );
        log.debug("gece_Section13Record read. is not null {}", rue.gece_Section13Record.isPresent());

        rue.uge_UgeRecord = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_UGE_DATA_CONNECTION
        );
        log.debug("ugeRecord read. is not null {}", rue.uge_UgeRecord.isPresent());

        rue.projectDocumentation_Section13Record = asRefRecord(
                rue.rsoksRecord,
                FieldsRsoks.PROPERTY_DL_DATA_PROJECT_DOCUMENTATION_DESCRIPTION_CONNECTION
        );
        log.debug("rprojectDocumentation_Section13Record read. is not null {}",
                rue.projectDocumentation_Section13Record.isPresent());

        // ugeRecord
        rue.uge_Section13record = rue.uge_UgeRecord
                .flatMap(iRecord -> asRefRecord(iRecord, FieldsUge.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION));
        log.debug("uge_Section13record read. is not null {}", rue.uge_Section13record.isPresent());

        // gpzuRecord
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

        // gece_Section13Record
        rue.gece_Section13Record
                .flatMap(iRecord -> asRefRecord(iRecord, FieldsSection.PROPERTY_SUPPLIER_DATA_CONNECTION))
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
                });
    }

    /**
     * Корневая сущность
     */
    private Request prepareRequest() {
        ConstructionType construction = new ConstructionType();
        asString(rue.section13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(construction::setConstPermitNumber);
        asXMLGregorianCalendar(rue.section13Record, FieldsSection.PROPERTY_DOC_DATE)
                .ifPresent(construction::setConstPermitDate);
        asString(rue.section13Record, FieldsSection.PROPERTY_IDENTIFIER)
                .ifPresent(construction::setConstPermitID);
        asInt(rue.section13Record, FieldsSection.PROPERTY_CONST_GOVERNMENT_ORDER_ID)
                .ifPresent(construction::setConstGovernmentOrderId);
        asString(rue.section13Record, FieldsSection.PROPERTY_CONST_CADASTRAL_DISTRICT)
                .ifPresent(construction::setConstCadastralDistrict);
        asString(rue.section13Record, FieldsSection.PROPERTY_CONST_CADASTRAL_AREA)
                .ifPresent(construction::setConstCadastralArea);
        asConstructorKind(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_CONSTRUCTION_TYPE)
                .ifPresent(construction::setConstructionKind);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_PERMISSION_TYPE)
                .ifPresent(construction::setConstPermissionType);
        asString(rue.section13Record, FieldsSection.PROPERTY_NAME_FROM_P_D)
                .ifPresent(construction::setObjectNameProjectDoc);
        asString(rue.section13Record, FieldsSection.PROPERTY_NUMBER_OBJECTS)
                .ifPresent(construction::setNumberObjects);
        asString(rue.section13Record, FieldsSection.PROPERTY_NUMBER_LONG_OBJECTS)
                .ifPresent(construction::setNumberLongObjects);
        asStatus(rue.section13Record, FieldsSection.PROPERTY_DOC_STATUS)
                .ifPresent(construction::setStatusConstruction);
        asXMLGregorianCalendar(rue.section13Record, FieldsSection.PROPERTY_VALID_UNTIL)
                .ifPresent(construction::setExpireDate);

        // issuePerson_afterTriggerRecord
        asString(rue.issuePerson_afterTriggerRecord, FieldsUsersAfterTrigger.PROPERTY_POSITION1)
                .ifPresent(construction::setIssuePersonPosition);
        construction.setIssuePerson(supplierIssuePerson());

        construction.setIssueOrgan(issueOrgan());
        construction.setRecipientInfo(recipientInfo());
        construction.getObjectInfo().add(objectInfo());

        // Добавляем вложение
        var attachments = asAttachment(rue.section13Record);

        if (!attachments.isEmpty()) {
            attachments.forEach(smevAttachment -> {
                var attachmentRefType = new AttachmentRefType();
                attachmentRefType.setAttachmentId(smevAttachment.getAttachmentId().toString());

                var fileType = new FileType();
                fileType.setAttachmentRef(attachmentRefType);
                fileType.setName(smevAttachment.getFileName());

                construction.getScans().add(fileType);
            });
        }

        Request request = new Request();
        request.setRegisterNewConstruction(construction);

        return request;
    }

    private FIOType supplierIssuePerson() {
        var fioType = new FIOType();
        asString(rue.issuePerson_afterTriggerRecord, FieldsUsersAfterTrigger.PROPERTY_NAME)
                .ifPresent(fioType::setName);
        asString(rue.issuePerson_afterTriggerRecord, FieldsUsersAfterTrigger.PROPERTY_SUR_NAME)
                .ifPresent(fioType::setSurname);
        asString(rue.issuePerson_afterTriggerRecord, FieldsUsersAfterTrigger.PROPERTY_MIDDLE_NAME)
                .ifPresent(fioType::setMiddleName);
        return fioType;
    }

    private RecipientInfoType recipientInfo() {
        var recipientInfoType = new RecipientInfoType();
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_EMAIL)
                .ifPresent(recipientInfoType::setEmail);

        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_ACTUAL_ADDRESS)
                .ifPresent(s -> {
                    var addressFullType = new AddressFullType();
                    addressFullType.setNote(s);
                    addressFullType.setRegion(CRIMEA_REGION);
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
        // section13Record
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_BUILD_CAPITAL_TYPE)
                .ifPresent(type::setBuildCapitalType);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL)
                .ifPresent(type::setObjectPurposeFunctional);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_OBJECT_PURPOSE)
                .ifPresent(type::setObjectPurpose);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_OBJECT_KIND)
                .ifPresent(type::setObjectKind);
        asString(rue.section13Record, FieldsSection.PROPERTY_OBJECT_NAME_EIS)
                .ifPresent(type::setObjectName);

        // rsoksRecord
        asString(rue.rsoksRecord, FieldsRsoks.PROPERTY_BUILDING_ADDRESS)
                .ifPresent(s -> {
                    var addressFullType = new AddressFullType();
                    addressFullType.setRegion(CRIMEA_REGION);
                    addressFullType.setNote(s);
                    type.setObjectAddress(addressFullType);
                });
        asString(rue.rsoksRecord, FieldsRsoks.PROPERTY_OBJECT_BUSINESS_ID)
                .ifPresent(type::setObjectBusinessID);

        // oks13Record
        if (rue.oks13Record != null) {
            asString(rue.oks13Record, CADASTRALNUM)
                    .ifPresent(type::setCadastralNumberOKS);
        }

        // oks13LineRecord
        // Вариант работает, только если мы не вычитали CadastralNumberOKS на предыдущем шаге
        if (type.getCadastralNumberOKS() == null && rue.oks13LineRecord != null) {
            asString(rue.oks13LineRecord, CADASTRALNUM)
                    .ifPresent(type::setCadastralNumberOKS);
        }

        type.setObjectProjectDescription(objectProjectDescriptionType());
        type.setInfoDocDescription(infoDocDescriptionType());

        return type;
    }

    private ObjectProjectDescriptionType objectProjectDescriptionType() {
        var type = new ObjectProjectDescriptionType();

        asString(rue.section13Record, FieldsSection.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL)
                .ifPresentOrElse(objecPpurposeFunctional -> {
                    switch (objecPpurposeFunctional) {
                        case PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_REF_VALUE_5: {
                            type.setProjectLongObjects(projectLongObjectsType());
                        }
                        break;
                        default: {
                            type.setOtherProjectObject(otherProjectObjectType());
                            type.setShortProjectObject(shortProjectObjectType());
                        }
                    }
                }, () -> {
                    throw new SmevRequestException("field 'object_purpose_functional' is empty");
                });

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
        Optional.of(landCadastralDescriptionType())
                .ifPresentOrElse(tp -> {
                            type.getLandCadastralDescription().add(tp);
                            type.setLandCadastralAvailability(AvailabilityDocType.AVAILABLE);
                        },
                        () -> type.setLandCadastralAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        // Demarcation
        Optional.of(demarcationDescriptionType())
                .ifPresentOrElse(tp -> {
                            type.getDemarcationDescription().add(tp);
                            type.setDemarcationAvailability(AvailabilityDocType.AVAILABLE);
                        },
                        () -> type.setDemarcationAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        // DevPlanLandPlot
        Optional.of(devPlanLandPlotDescriptionType())
                .ifPresentOrElse(tp -> {
                            type.getDevPlanLandPlotDescription().add(tp);
                            type.setDevPlanLandPlotAvailability(AvailabilityDocType.AVAILABLE);
                        }, () -> type.setDevPlanLandPlotAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        // EcologicalExpertise
        ecologicalExpertiseDescriptionType().ifPresentOrElse(tp -> {
            type.getEcologicalExpertiseDescription().add(tp);
            type.setEcologicalExpertiseAvailability(AvailabilityDocType.AVAILABLE);
        }, () -> type.setEcologicalExpertiseAvailability(AvailabilityDocType.NOT_AVAILABLE));

        // ExpertiseProject
        if (rue.uge_UgeRecord.isPresent()) {
            type.getExpertiseProjectDocDescription().add(expertiseProjectDocDescriptionType());
            type.setExpertiseProjectDocAvailability(AvailabilityDocType.AVAILABLE);
        } else {
            type.setExpertiseProjectDocAvailability(AvailabilityDocType.NOT_AVAILABLE);
        }

        // ProjectDocumentation
        projectDocumentationDescriptionType().ifPresentOrElse(tp -> {
            type.getProjectDocumentationDescription().add(tp);
            type.setProjectDocumentationAvailability(AvailabilityDocType.AVAILABLE);
        }, () -> type.setProjectDocumentationAvailability(AvailabilityDocType.NOT_AVAILABLE));

        return type;
    }

    private Optional<ProjectDocumentationDescriptionType> projectDocumentationDescriptionType() {
        return rue.projectDocumentation_Section13Record
                .map(iRecord -> {
                    var type = new ProjectDocumentationDescriptionType();
                    asString(iRecord, FieldsSection.PROPERTY_DOC_NUM)
                            .ifPresent(type::setProjectDocCode);
                    asXMLGregorianCalendar(iRecord, FieldsSection.PROPERTY_DOC_DATE)
                            .ifPresent(type::setDocumentationDate);
                    asString(iRecord, FieldsSection.PROPERTY_DEVELOPER_TYPE)
                            .map(this::mapDocumentDeveloperType)
                            .ifPresent(type::setDeveloperType);
                    asBigInteger(iRecord, FieldsSection.PROPERTY_PROJECT_DOC_YEAR)
                            .ifPresent(type::setProjectDocYear);
                    type.setIsResident(rue.organDocInfo.isIsResident());
                    type.setOrganDocInfo(rue.organDocInfo);
                    return type;
                });
    }

    private ExpertiseProjectDocDescriptionType expertiseProjectDocDescriptionType() {
        var type = new ExpertiseProjectDocDescriptionType();

        rue.uge_UgeRecord
                .flatMap(iRecord -> asRefBookType(iRecord, FieldsUge.TABLE, FieldsUge.PROPERTY_PROJECT_DOC_TYPE))
                .ifPresent(type::setProjectDocType);

        rue.uge_Section13record
                .flatMap(iRecord -> asString(iRecord, FieldsSection.PROPERTY_DOC_NUM))
                .ifPresent(type::setExpertiseProjectDocNumber);

        rue.uge_Section13record
                .flatMap(iRecord -> asXMLGregorianCalendar(iRecord, FieldsSection.PROPERTY_DOC_DATE))
                .ifPresent(type::setExpertiseProjectDocDate);

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

    private Optional<EcologicalExpertiseDescriptionType> ecologicalExpertiseDescriptionType() {
        return rue.gece_Section13Record.map(iRecord -> {
            var type = new EcologicalExpertiseDescriptionType();
            asString(iRecord, FieldsSection.PROPERTY_DOC_NUM)
                    .ifPresent(type::setEcologicalExpertiseNumber);
            asXMLGregorianCalendar(iRecord, FieldsSection.PROPERTY_DOC_DATE)
                    .ifPresent(type::setEcologicalExpertiseDate);
            type.setOrganDocInfo(rue.organDocInfo);

            return type;
        });
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

        asXMLGregorianCalendar(rue.gpzuSection13Record, FieldsSection.PROPERTY_DOC_DATE)
                .ifPresent(type::setDevPlanLandPlotDate);
        asString(rue.gpzuSection13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setDevPlanLandPlotNumber);

        type.getLandCadastralDescription().add(gpzuLandCadastralDescriptionType());
        type.setOrganDocInfo(rue.organDocInfo);

        return type;
    }

    private LandCadastralDescriptionType gpzuLandCadastralDescriptionType() {
        var type = new LandCadastralDescriptionType();
        asString(rue.gpzuSection13LandplotRecord, CADASTRALNUM)
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
        asXMLGregorianCalendar(rue.pptRecord, FieldsSection.PROPERTY_DOC_DATE)
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
        asString(rue.landplotRecord, CADASTRALNUM)
                .ifPresent(type::setCadastralNumberZU);
        asString(rue.landplotRecord, FieldsLandplot.PROPERTY_AREA)
                .ifPresent(type::setLandPlotArea);
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

    private Optional<RefBookType> asConstructorKind(IRecord record,
                                                    String tableName,
                                                    String fieldName) {
        return asRefType(record, tableName, fieldName)
                .map(refType -> {
                    var ref = new RefBookType();
                    ref.setName(refType.getName());

                    switch (refType.getCode()) {
                        // Строительство объекта капитального строительства
                        case "0I.1":
                            ref.setCode("1");
                            break;
                        // Строительство линейного объекта
                        case "0I.2":
                            ref.setCode("2");
                            break;
                        // Строительство объекта капитального строительства, входящего в состав линейного
                        case "0I.3":
                            ref.setCode("3");
                            break;
                        // Реконструкция объекта капитального строительства
                        case "0I.4":
                            ref.setCode("4");
                            break;
                        // Реконструкция линейного объекта
                        case "0I.5":
                            ref.setCode("5");
                            break;
                        // Реконструкция объекта капитального строительства, входящего в состав линейного
                        case "0I.6":
                            ref.setCode("6");
                            break;
                        // Работы по сохранению объекта культурного наследия
                        case "0I.7":
                            ref.setCode("7");
                            break;
                        default:
                            throw new SmevRequestException(
                                    "document constructor kind is undefined :" + refType.getCode());
                    }

                    return ref;
                });
    }

    private Optional<StatusConstructionType> asStatus(IRecord record,
                                                      String fieldName) {
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

    private DocumentDeveloperType mapDocumentDeveloperType(String value) {
        if (StringUtils.isEmpty(value)) {
            return null;
        }
        switch (value) {
            case "legal":
                return DocumentDeveloperType.LEGAL;
            case "individual":
                return DocumentDeveloperType.INDIVIDUAL;
            case "physical":
                return DocumentDeveloperType.PHYSICAL;
            default: {
                throw new SmevRequestException("unknown DocumentDeveloperType: " + value);
            }
        }
    }

    /**
     * Для хранения объектов, который будут переиспользоваться
     */
    static class ReusableElements {

        private IRecord section13Record;
        private IRecord developer_CustomerRecord;
        private IRecord developerOrganizationRecord;
        private IRecord supplier_SupplierRecord;
        private IRecord supplierOrganizationRecord;
        private IRecord rsoksRecord;
        private IRecord rsoksPartRecord;
        private IRecord gpzuRecord;
        private IRecord gpzuSection13Record;
        private IRecord gpzuSection13LandplotRecord;
        private IRecord tarRecord;
        private IRecord pptRecord;
        private Optional<IRecord> gece_Section13Record;
        private Optional<IRecord> projectDocumentation_Section13Record;
        private Optional<IRecord> uge_UgeRecord;
        private Optional<IRecord> uge_Section13record;
        private IRecord issuePerson_afterTriggerRecord;
        private IRecord oks13Record;
        private IRecord oks13LineRecord;
        private IRecord landplotRecord;

        // Сведения об организации, выдавшей документ
        private OrganDocInfoType organDocInfo = new OrganDocInfoType();
    }
}
