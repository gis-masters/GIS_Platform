package ru.mycrg.data_service.service.smev3.request.receipt_rns;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rns_1_0_9.*;
import ru.mycrg.data_service.service.smev3.request.AResponseXmlProcessor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;
import static ru.mycrg.data_service.service.smev3.fields.FieldsEisZs.*;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

public class ReceiptRnsResponseXmlProcessor extends AResponseXmlProcessor {

    // папка для РНС имеет id=2
    private static final String RNS_FOLDER = "/root/2";
    private static final String RNS_CONTENT_TYPE = "doc_rns";

    private Map<String, Object> record = null;
    private List<Map<String, Object>> records = null;

    public IRecord processOne(@NotNull ResponseConstructionType type) {
        try {
            record = new HashMap<>();

            asString(RNS_FOLDER)
                    .ifPresent(s -> record.put(PATH.getName(), s));
            asString(RNS_CONTENT_TYPE)
                    .ifPresent(s -> record.put(PROPERTY_CONTENT_TYPE_ID, s));
            asBoolean(true)
                    .ifPresent(b -> record.put(PROPERTY_IS_RECORD_FULL, b));

            ofNullable(type.getChangesConstPermit())
                    .ifPresent(this::changesConstPermitType);
            ofNullable(type.getConstruction())
                    .ifPresent(this::constructionType);

            return new RecordEntity(record);
        } catch (Exception e) {
            throw new SmevRequestException("Не удалось сформировать сущность. По причине:" + e.getMessage());
        }
    }

    public List<IRecord> processList(@NotNull List<ResponseConstructionShortInfoType> types) {
        try {
            records = new ArrayList<>();

            types.stream()
                    .map(ResponseConstructionShortInfoType::getVersionInfo)
                    .forEach(constructionVersionInfoType -> {
                        record = new HashMap<>();
                        constructionVersionInfoType(constructionVersionInfoType);
                        records.add(record);
                    });

            return records.stream()
                    .map(RecordEntity::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new SmevRequestException("Не удалось сформировать сущности. По причине:" + e.getMessage());
        }
    }

    // collection
    private void constructionVersionInfoType(ConstructionVersionInfoType type) {
        asString(RNS_FOLDER)
                .ifPresent(s -> record.put(PATH.getName(), s));
        asString(RNS_CONTENT_TYPE)
                .ifPresent(s -> record.put(PROPERTY_CONTENT_TYPE_ID, s));
        asBoolean(false)
                .ifPresent(b -> record.put(PROPERTY_IS_RECORD_FULL, b));

        asString(type.getConstPermitID())
                .ifPresent(s -> record.put(PROPERTY_CONST_PERMIT_ID, s));
        asString(type.getConstPermitNumber())
                .ifPresent(s -> record.put(PROPERTY_CONST_PERMIT_NUMBER, s));
        asLocalDateTime(type.getConstPermitDate())
                .ifPresent(localDateTime -> record.put(PROPERTY_CONST_PERMIT_DATE, localDateTime));
        asLocalDateTime(type.getChangesDate())
                .ifPresent(localDateTime -> record.put(PROPERTY_PREV_CONST_CHANGES_DATE, localDateTime));
        asLocalDateTime(type.getExpireDate())
                .ifPresent(s -> record.put(PROPERTY_EXPIRE_DATE, s));
        ofNullable(type.getStatusConstruction())
                .map(Enum::name)
                .ifPresent(s -> record.put(PROPERTY_STATUS, s));
        ofNullable(type.getReasonChanges())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_REASON_CHANGES_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_REASON_CHANGES_CODE, s));
                });
        ofNullable(type.getIssueOrgan())
                .ifPresent(this::issueOrgan_OrganizationInfoType);
        ofNullable(type.getRecipientInfo())
                .ifPresent(this::recipientInfoType);
        ofNullable(type.getObjectShortInfo())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::objectShortInfoType);
    }

    private void objectShortInfoType(ObjectShortInfoType type) {
        asString(type.getObjectName())
                .ifPresent(s -> record.put(PROPERTY_CONST_OBJECT_NAME, s));
        asString(type.getObjectID())
                .ifPresent(s -> record.put(PROPERTY_CONST_OBJECT_ID, s));
        asString(type.getObjectBusinessID())
                .ifPresent(s -> record.put(PROPERTY_OBJECT_BUSINESS_ID, s));
    }

    // one record
    private void changesConstPermitType(ChangesConstPermitType type) {
        asString(type.getPrevConstPermitID())
                .ifPresent(s -> record.put(PROPERTY_PREV_CONST_PERMIT_ID, s));
        asString(type.getPrevConstPermitNumber())
                .ifPresent(s -> record.put(PROPERTY_PREV_CONST_PERMIT_NUMBER, s));
        asLocalDateTime(type.getPrevConstPermitDate())
                .ifPresent(localDateTime -> record.put(PROPERTY_PREV_CONST_PERMIT_DATE, localDateTime));
        asLocalDateTime(type.getChangesDate())
                .ifPresent(localDateTime -> record.put(PROPERTY_PREV_CONST_CHANGES_DATE, localDateTime));
        ofNullable(type.getReasonChanges())
                .flatMap(ref -> ref.stream().findFirst())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_REASON_CHANGES_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_REASON_CHANGES_CODE, s));
                });
        asString(type.getBasisChanges())
                .ifPresent(s -> record.put(PROPERTY_BASIC_CHANGES, s));
        asLocalDateTime(type.getExtendedTo())
                .ifPresent(s -> record.put(PROPERTY_EXTENDED_TO, s));
    }

    private void constructionType(ConstructionType type) {
        asString(type.getConstPermitID())
                .ifPresent(s -> record.put(PROPERTY_CONST_PERMIT_ID, s));
        asString(type.getConstPermitNumber())
                .ifPresent(s -> record.put(PROPERTY_CONST_PERMIT_NUMBER, s));
        asInt(type.getConstGovernmentOrderId())
                .ifPresent(s -> record.put(PROPERTY_CONST_GOVERNMENT_ORDER_ID, s));
        asString(type.getConstCadastralDistrict())
                .ifPresent(s -> record.put(PROPERTY_CADASTRAL_DISTRICT, s));
        asString(type.getConstCadastralArea())
                .ifPresent(s -> record.put(PROPERTY_CADASTRAL_AREA, s));
        asLocalDateTime(type.getExpireDate())
                .ifPresent(s -> record.put(PROPERTY_EXPIRE_DATE, s));
        ofNullable(type.getConstructionKind())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_CONSTRUCTION_KIND_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_CONSTRUCTION_KIND_CODE, s));
                });
        ofNullable(type.getConstPermissionType())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(
                            s -> record.put(PROPERTY_CONST_PERMISSION_TYPE_NAME, s));
                    asString(ref.getCode()).ifPresent(
                            s -> record.put(PROPERTY_CONST_PERMISSION_TYPE_CODE, s));
                });
        asString(type.getObjectNameProjectDoc())
                .ifPresent(s -> record.put(PROPERTY_OBJECT_NAME_PROJECT_DOC, s));
        ofNullable(type.getStatusConstruction())
                .map(Enum::name)
                .ifPresent(s -> record.put(PROPERTY_STATUS, s));
        ofNullable(type.getScans())
                .flatMap(fileTypes -> fileTypes.stream().findFirst())
                .map(FileType::getName)
                .ifPresent(s -> record.put(PROPERTY_FILE, s));
        ofNullable(type.getIssuePersonPosition())
                .ifPresent(s -> record.put(PROPERTY_ISSUE_PERSON_POSITION, s));

        ofNullable(type.getRecipientInfo())
                .ifPresent(this::recipientInfoType);
        ofNullable(type.getIssuePerson())
                .ifPresent(this::issueOrgan_FIOType);
        ofNullable(type.getIssueOrgan())
                .ifPresent(this::issueOrgan_OrganizationInfoType);
        ofNullable(type.getObjectInfo())
                .flatMap(objectInfoTypes -> objectInfoTypes.stream().findFirst())
                .ifPresent(this::objectInfoType);
    }

    private void recipientInfoType(RecipientInfoType type) {
        ofNullable(type.getOrganizationInfo())
                .ifPresent(organizationInfoType -> {
                    asString(organizationInfoType.getOrganizationName())
                            .ifPresent(s -> record.put(PROPERTY_RECEPIENT_INFO_ORGANIZATION_NAME, s));
                    asString(organizationInfoType.getOGRN())
                            .ifPresent(s -> record.put(PROPERTY_RECEPIENT_INFO_OGRN, s));
                    asString(organizationInfoType.getINN())
                            .ifPresent(s -> record.put(PROPERTY_RECEPIENT_INFO_INN, s));
                    asString(organizationInfoType.getKPP())
                            .ifPresent(s -> record.put(PROPERTY_RECEPIENT_INFO_KPP, s));
                });
        asString(type.getEmail())
                .ifPresent(s -> record.put(PROPERTY_RECEPIENT_INFO_EMAIL, s));
        ofNullable(type.getMailingAddress())
                .ifPresent(addressFullType -> {
                    asString(addressFullType.getFIAS())
                            .ifPresent(s -> record.put(PROPERTY_RECIPIENT_INFO_FIAS, s));
                    asString(addressFullType.getOKTMO())
                            .ifPresent(s -> record.put(PROPERTY_RECIPIENT_INFO_OKTMO, s));
                    asString(addressFullType.getRegion())
                            .ifPresent(s -> record.put(PROPERTY_RECIPIENT_INFO_REGION, s));
                    asString(addressFullType.getNote())
                            .ifPresent(s -> record.put(PROPERTY_RECIPIENT_INFO_NOTE, s));
                    ofNullable(addressFullType.getLocality())
                            .ifPresent(l -> record.put(PROPERTY_RECIPIENT_INFO_LOCALITY, locality(l)));
                });
    }

    private void issueOrgan_OrganizationInfoType(OrganizationInfoType type) {
        asString(type.getOrganizationName())
                .ifPresent(s -> record.put(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_ORGANIZATION_NAME, s));
        asString(type.getOGRN())
                .ifPresent(s -> record.put(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_OGRN, s));
        asString(type.getKPP())
                .ifPresent(s -> record.put(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_KPP, s));
        asString(type.getINN())
                .ifPresent(s -> record.put(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_INN, s));
    }

    private void issueOrgan_FIOType(FIOType type) {
        asString(type.getSurname())
                .ifPresent(s -> record.put(PROPERTY_ISSUE_PERSON_SURNAME, s));
        asString(type.getName())
                .ifPresent(s -> record.put(PROPERTY_ISSUE_PERSON_NAME, s));
        asString(type.getMiddleName())
                .ifPresent(s -> record.put(PROPERTY_ISSUE_PERSON_MIDDLE_NAME, s));
    }

    private void objectInfoType(ObjectInfoType type) {
        asString(type.getObjectName())
                .ifPresent(s -> record.put(PROPERTY_CONST_OBJECT_NAME, s));
        asString(type.getObjectID())
                .ifPresent(s -> record.put(PROPERTY_CONST_OBJECT_ID, s));
        asString(type.getObjectBusinessID())
                .ifPresent(s -> record.put(PROPERTY_OBJECT_BUSINESS_ID, s));
        ofNullable(type.getObjectAddress())
                .ifPresent(addressFullType -> {
                    asString(addressFullType.getFIAS())
                            .ifPresent(s -> record.put(PROPERTY_OBJECT_ADDRESS_FIAS, s));
                    asString(addressFullType.getOKTMO())
                            .ifPresent(s -> record.put(PROPERTY_OBJECT_ADDRESS_OKTMO, s));
                    asString(addressFullType.getRegion())
                            .ifPresent(s -> record.put(PROPERTY_OBJECT_ADDRESS_REGION, s));
                    asString(addressFullType.getNote())
                            .ifPresent(s -> record.put(PROPERTY_OBJECT_ADDRESS_NOTE, s));
                    ofNullable(addressFullType.getLocality())
                            .ifPresent(l -> record.put(PROPERTY_OBJECT_ADDRESS_LOCALITY, locality(l)));
                });
        ofNullable(type.getObjectKind())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_OBJECT_KIND_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_OBJECT_KIND_CODE, s));
                });
        ofNullable(type.getObjectPurpose())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_OBJECT_PURPOSE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_OBJECT_PURPOSE_CODE, s));
                });
        ofNullable(type.getObjectPurposeFunctional())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_CODE, s));
                });
        ofNullable(type.getBuildCapitalType())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_BUILD_CAPITAL_TYPE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_BUILD_CAPITAL_TYPE_CODE, s));
                });
        asString(type.getCadastralNumberOKS())
                .ifPresent(s -> record.put(PROPERTY_CADASTRAL_NUMBER_OKS, s));

        ofNullable(type.getObjectProjectDescription())
                .map(ObjectProjectDescriptionType::getShortProjectObject)
                .ifPresent(this::shortProjectObject);

        ofNullable(type.getObjectProjectDescription())
                .map(ObjectProjectDescriptionType::getProjectLongObjects)
                .ifPresent(this::projectLongObjectsType);

        ofNullable(type.getObjectProjectDescription())
                .map(ObjectProjectDescriptionType::getOtherProjectObject)
                .ifPresent(this::otherProjectObjectType);

        ofNullable(type.getInfoDocDescription())
                .ifPresent(this::infoDocDescriptionType);
    }

    private void shortProjectObject(ShortProjectObjectType type) {
        asString(type.getTotalArea())
                .ifPresent(s -> record.put(PROPERTY_TOTAL_AREA, s));
        asString(type.getBuildingArea())
                .ifPresent(s -> record.put(PROPERTY_BUILDING_AREA, s));
        asString(type.getAreaObjectCap())
                .ifPresent(s -> record.put(PROPERTY_AREA_OBJECT_CAP, s));
        asString(type.getAreaBuildingPartObject())
                .ifPresent(s -> record.put(PROPERTY_AREA_BUILDING_PART_OBJECT, s));
        asString(type.getBuildingVolume())
                .ifPresent(s -> record.put(PROPERTY_BUILDING_VOLUME, s));
        asString(type.getBuildingVolume())
                .ifPresent(s -> record.put(PROPERTY_BUILDING_VOLUME, s));
        asString(type.getUndergroundPart())
                .ifPresent(s -> record.put(PROPERTY_UNDER_GROUND_PART, s));
        asString(type.getCapacity())
                .ifPresent(s -> record.put(PROPERTY_CAPACITY, s));
        asString(type.getHeightObject())
                .ifPresent(s -> record.put(PROPERTY_HEIGHT_OBJECT, s));
        asString(type.getMinNumberFloors())
                .ifPresent(s -> record.put(PROPERTY_MIN_NUMBER_FLOORS, s));
        asString(type.getMaxNumberFloors())
                .ifPresent(s -> record.put(PROPERTY_MAX_NUMBER_FLOORS, s));
        asString(type.getMinUndergroundFloors())
                .ifPresent(s -> record.put(PROPERTY_MIN_UNDERGROUND_FLOORS, s));
        asString(type.getMaxUndergroundFloors())
                .ifPresent(s -> record.put(PROPERTY_MAX_UNDERGROUND_FLOORS, s));
    }

    private void projectLongObjectsType(ProjectLongObjectsType type) {
        ofNullable(type.getCategory())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_CATEGORY_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_CATEGORY_CODE, s));
                });
        asString(type.getExtension())
                .ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_EXTENSION, s));
        asString(type.getLengthPart())
                .ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_LENGTH_PART, s));
        asString(type.getPower())
                .ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_POWER, s));
        ofNullable(type.getPowerMeasure())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_POWER_MEASURE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_POWER_MEASURE_CODE, s));
                });
        asString(type.getPipeCharacteristics())
                .ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_PIPE_CHARACTERISTICS, s));
        ofNullable(type.getPowerLinesType())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_POWER_LINES_TYPE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_POWER_LINES_TYPE_CODE, s));
                });
        asString(type.getPowerLinesLevel())
                .ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_POWER_LINES_LEVEL, s));
        asString(type.getStructuralElements())
                .ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_POWER_LINES_LEVEL_2, s));
        asString(type.getOtherIndex())
                .ifPresent(s -> record.put(PROPERTY_LONG_OBJECTS_OTHER_INDEX, s));
    }

    private void otherProjectObjectType(OtherProjectObjectType type) {
        asString(type.getNumberApartments())
                .ifPresent(s -> record.put(PROPERTY_NUMBER_APARTMENTS, s));
        asString(type.getNumberOneRoom())
                .ifPresent(s -> record.put(PROPERTY_NUMBER_ONE_ROOM, s));
        asString(type.getAreaOneRoom())
                .ifPresent(s -> record.put(PROPERTY_AREA_ONE_ROOM, s));
        asString(type.getNumberTwoRoom())
                .ifPresent(s -> record.put(PROPERTY_NUMBER_TWO_ROOM, s));
        asString(type.getAreaTwoRoom())
                .ifPresent(s -> record.put(PROPERTY_AREA_TWO_ROOM, s));
        asString(type.getNumberThreeRoom())
                .ifPresent(s -> record.put(PROPERTY_NUMBER_THREE_ROOM, s));
        asString(type.getAreaThreeRoom())
                .ifPresent(s -> record.put(PROPERTY_AREA_THREE_ROOM, s));
        asString(type.getNumberFourRoom())
                .ifPresent(s -> record.put(PROPERTY_NUMBER_FOUR_ROOM, s));
        asString(type.getAreaFourRoom())
                .ifPresent(s -> record.put(PROPERTY_AREA_FOUR_ROOM, s));
        asString(type.getNumberMoreRoom())
                .ifPresent(s -> record.put(PROPERTY_NUMBER_MORE_ROOM, s));
        asString(type.getAreaMoreRoom())
                .ifPresent(s -> record.put(PROPERTY_AREA_MORE_ROOM, s));
        asString(type.getLivingArea())
                .ifPresent(s -> record.put(PROPERTY_LIVING_AREA, s));
        asString(type.getLivingArea2())
                .ifPresent(s -> record.put(PROPERTY_LIVING_AREA_2, s));
        asString(type.getUnlivingArea())
                .ifPresent(s -> record.put(PROPERTY_UNLIVING_AREA, s));
        asString(type.getNumberUnlivigPremise())
                .ifPresent(s -> record.put(PROPERTY_NUMBER_UNLIVING_AREA, s));
        asString(type.getPremisesLivingCount())
                .ifPresent(s -> record.put(PROPERTY_PREMISES_LIVING_COUNT, s));
        asString(type.getPremisesCount())
                .ifPresent(s -> record.put(PROPERTY_PREMISES_COUNT, s));
        asString(type.getNumberParkingSpase())
                .ifPresent(s -> record.put(PROPERTY_NUMBER_PARKING_SPASE, s));
        asString(type.getElevators())
                .ifPresent(s -> record.put(PROPERTY_ELEVATORS, s));
        asString(type.getEscalators())
                .ifPresent(s -> record.put(PROPERTY_ESCALATORS, s));
        asString(type.getWheelchairLifts())
                .ifPresent(s -> record.put(PROPERTY_WHEELCHAIR_LIFTS, s));
        ofNullable(type.getMaterialsFoundations())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_MATERIALS_FOUNDATIONS_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_MATERIALS_FOUNDATIONS_CODE, s));
                });
        asString(type.getCorrectMaterialsFoundations())
                .ifPresent(s -> record.put(PROPERTY_CORRECT_MATERIALS_FOUNDATIONS, s));
        ofNullable(type.getMaterialsWall())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_MATERIALS_WALL_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_MATERIALS_WALL_CODE, s));
                });
        asString(type.getCorrectMaterialsWall())
                .ifPresent(s -> record.put(PROPERTY_CORRECT_MATERIALS_WALL, s));
        ofNullable(type.getCeilingMaterials())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_CEILING_MATERIALS_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_CEILING_MATERIALS_CODE, s));
                });
        asString(type.getCorrectCeilingMaterials())
                .ifPresent(s -> record.put(PROPERTY_CORRECT_CEILING_MATERIALS, s));
        ofNullable(type.getRoofingMaterials())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_ROOFING_MATERIALS_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_ROOFING_MATERIALS_CODE, s));
                });
        asString(type.getCorrectRoofingMaterials())
                .ifPresent(s -> record.put(PROPERTY_CORRECT_ROOFING_MATERIALS, s));
        asString(type.getOtherIndex())
                .ifPresent(s -> record.put(PROPERTY_OTHER_INDEX, s));
    }

    private void infoDocDescriptionType(InfoDocDescriptionType type) {
        ofNullable(type.getStandardArchitecturalSolutionAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> record.put(PROPERTY_SOLUTION_AVAILABILITY, s));

        ofNullable(type.getStandardArchitecturalSolutionDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::standardArchitecturalSolutionDescriptionType);

        ofNullable(type.getLandCadastralAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> record.put(PROPERTY_LAND_PLOT_AVAILABILITY, s));

        ofNullable(type.getLandCadastralDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::landCadastralDescriptionType);

        ofNullable(type.getProjectDocumentationAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_AVAILABILITY, s));

        ofNullable(type.getDemarcationAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> record.put(PROPERTY_DEMARCATION_AVAILABILITY, s));

        ofNullable(type.getDemarcationDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::demarcationDescriptionType);

        ofNullable(type.getProjectDocumentationDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::projectDocumentationDescriptionType);

        ofNullable(type.getDevPlanLandPlotAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_AVAILABILITY, s));

        ofNullable(type.getDevPlanLandPlotDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::devPlanLandPlotDescriptionType);

        ofNullable(type.getEcologicalExpertiseAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> record.put(PROPERTY_ECOLOGICAL_AVAILABILITY, s));

        ofNullable(type.getEcologicalExpertiseDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::ecologicalExpertiseDescriptionType);

        ofNullable(type.getExpertiseProjectDocAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_DOC_AVAILABILITY, s));

        ofNullable(type.getExpertiseProjectDocDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::expertiseProjectDocDescriptionType);
    }

    private void standardArchitecturalSolutionDescriptionType(StandardArchitecturalSolutionDescriptionType type) {
        asBigInteger(type.getStandArchSolutionYear())
                .ifPresent(s -> record.put(PROPERTY_SOLUTION_YEAR, s));
        asString(type.getStandArchSolutionCode())
                .ifPresent(s -> record.put(PROPERTY_SOLUTION_CODE, s));
        asString(type.getNameDoc())
                .ifPresent(s -> record.put(PROPERTY_SOLUTION_NAME_DOC, s));
        asFileType(type.getAttachments())
                .ifPresent(s -> {
                    record.put(PROPERTY_SOLUTION_ATTACHMENS, s.getName());
                });
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_SOLUTION_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_SOLUTION_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> record.put(PROPERTY_SOLUTION_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> record.put(PROPERTY_SOLUTION_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> record.put(PROPERTY_SOLUTION_ORGAN_ORGN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> record.put(PROPERTY_SOLUTION_ORGAN_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> record.put(PROPERTY_SOLUTION_ORGAN_IS_RES, s));
                });
    }

    private void landCadastralDescriptionType(LandCadastralDescriptionType type) {
        asString(type.getCadastralNumberZU())
                .ifPresent(s -> record.put(PROPERTY_LAND_PLOT_CAD_NUM, s));
        asString(type.getLandPlotArea())
                .ifPresent(s -> record.put(PROPERTY_LAND_PLOT_AREA, s));
        asFileType(type.getAttachments())
                .ifPresent(s -> {
                    record.put(PROPERTY_LAND_PLOT_ATTACHMENS, s.getName());
                });
    }

    private void projectDocumentationDescriptionType(ProjectDocumentationDescriptionType type) {
        asLocalDateTime(type.getDocumentationDate())
                .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_DOC_DATE, s));
        asString(type.getProjectDocCode())
                .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_DOC_CODE, s));
        asBoolean(type.isIsResident())
                .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_IS_RES, s));
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(
                                        s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(
                                        s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_ORGAN_OGRN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_IS_RES, s));
                });
        ofNullable(type.getDeveloperType())
                .map(DocumentDeveloperType::value)
                .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_DEVELOPER_TYPE, s));
        ofNullable(type.getIPDocInfo())
                .ifPresent(ipDocInfoType -> {
                    ofNullable(ipDocInfoType.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(
                                        s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(
                                        s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_OPF_CODE, s));
                            });
                    asString(ipDocInfoType.getOrganizationName())
                            .ifPresent(s -> record.put(PROPERTY_IP_DOCUMENTATION_ORGANIZATION_NAME, s));
                    asString(ipDocInfoType.getINN())
                            .ifPresent(s -> record.put(PROPERTY_IP_DOCUMENTATION_PHYSICAL_ORGAN_INN, s));
                    asString(ipDocInfoType.getOGRNIP())
                            .ifPresent(s -> record.put(PROPERTY_IP_DOCUMENTATION_PHYSICAL_ORGAN_OGRN, s));
                    ofNullable(ipDocInfoType.getFIO())
                            .ifPresent(fioType -> {
                                asString(fioType.getSurname())
                                        .ifPresent(
                                                s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_SURNAME, s));
                                asString(fioType.getName())
                                        .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_NAME, s));
                                asString(fioType.getMiddleName())
                                        .ifPresent(s -> record.put(
                                                PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_MIDDLE_NAME, s));
                            });
                });

        ofNullable(type.getPhysicalDocInfo())
                .ifPresent(physicalDocInfoType -> {
                    asString(physicalDocInfoType.getINN())
                            .ifPresent(s -> record.put(PROPERTY_IP_DOCUMENTATION_PHYSICAL_ORGAN_INN, s));
                    ofNullable(physicalDocInfoType.getFIO())
                            .ifPresent(fioType -> {
                                asString(fioType.getSurname())
                                        .ifPresent(
                                                s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_SURNAME, s));
                                asString(fioType.getName())
                                        .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_NAME, s));
                                asString(fioType.getMiddleName())
                                        .ifPresent(s -> record.put(
                                                PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_MIDDLE_NAME, s));
                            });
                });
        asBigInteger(type.getProjectDocYear())
                .ifPresent(s -> record.put(PROPERTY_PROJECT_DOCUMENTATION_YEAR, s));
    }

    private void demarcationDescriptionType(DemarcationDescriptionType type) {
        asString(type.getDemarcationNumber())
                .ifPresent(s -> record.put(PROPERTY_DEMARCATION_NUMBER, s));
        asLocalDateTime(type.getDemarcationDate())
                .ifPresent(s -> record.put(PROPERTY_DEMARCATION_DATE, s));
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> record.put(PROPERTY_DEMARCATION_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> record.put(PROPERTY_DEMARCATION_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_ORGAN_OGRN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_IS_RES, s));
                });
        ofNullable(type.getDocType())
                .ifPresent(docTpe -> {
                    asString(docTpe.getName())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_DOC_TYPE_NAME, s));
                    asString(docTpe.getCode())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_DOC_TYPE_CODE, s));
                });
        ofNullable(type.getAdministrativeDocType())
                .ifPresent(docTpe -> {
                    asString(docTpe.getName())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_ADM_DOC_TYPE_NAME, s));
                    asString(docTpe.getCode())
                            .ifPresent(s -> record.put(PROPERTY_DEMARCATION_ADM_DOC_TYPE_CODE, s));
                });
        asString(type.getURL())
                .ifPresent(s -> record.put(PROPERTY_DEMARCATION_URL, s));
        asFileType(type.getTextDocs())
                .ifPresent(s -> {
                    record.put(PROPERTY_DEMARCATION_TEXT_DOC_NAME, s.getName());
                    record.put(PROPERTY_DEMARCATION_TEXT_DOC_ATTACHMENTID, s.getAttachmentId());
                });
        asFileType(type.getGraphDocs())
                .ifPresent(s -> {
                    record.put(PROPERTY_DEMARCATION_GRAPH_DOC_NAME, s.getName());
                    record.put(PROPERTY_DEMARCATION_GRAPH_DOC_ATTACHMENTID, s.getAttachmentId());
                });
        asFileType(type.getAttachmentDocs())
                .ifPresent(s -> {
                    record.put(PROPERTY_DEMARCATION_ATTACH_NAME, s.getName());
                    record.put(PROPERTY_DEMARCATION_ATTACH_ID, s.getAttachmentId());
                });
        ofNullable(type.getConditionalNumberZu())
                .flatMap(types -> types.stream().findFirst())
                .map(ConditionalNumberZuInfoType::getConditionalNumberZu)
                .ifPresent(s -> record.put(PROPERTY_DEMARCATION_CONDITIONAL_NUMBER_ZU, s));
    }

    private void devPlanLandPlotDescriptionType(DevPlanLandPlotDescriptionType type) {
        asString(type.getDevPlanLandPlotNumber())
                .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_NUMBER, s));
        asLocalDateTime(type.getDevPlanLandPlotDate())
                .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_DATE, s));
        ofNullable(type.getLandCadastralDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(landCadastralDescription -> {
                    asString(landCadastralDescription.getCadastralNumberZU())
                            .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_CAD_NUM, s));
                    asString(landCadastralDescription.getLandPlotArea())
                            .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_AREA, s));
                    asFileType(landCadastralDescription.getAttachments())
                            .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_ATTACHMENS, s));
                });
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(
                                        s -> record.put(PROPERTY_DEV_LAND_PLOT_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(
                                        s -> record.put(PROPERTY_DEV_LAND_PLOT_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_ORGAN_ORGN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_ORGAN_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_ORGAN_IS_RES, s));
                });
        asFileType(type.getDevPlanLandPlotDocs())
                .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_DOC_NAME, s));
        asFileType(type.getLandPlotPlanningOrganisationDocs())
                .ifPresent(s -> record.put(PROPERTY_DEV_LAND_PLOT_ORG_NAME, s));
    }

    private void ecologicalExpertiseDescriptionType(EcologicalExpertiseDescriptionType type) {
        asString(type.getEcologicalExpertiseNumber())
                .ifPresent(s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_NUM, s));
        asLocalDateTime(type.getEcologicalExpertiseDate())
                .ifPresent(s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_DATE, s));
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(
                                        s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(
                                        s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(
                                    s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_ORGN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_IS_RES, s));
                });
        asFileType(type.getAttachments())
                .ifPresent(s -> record.put(PROPERTY_ECOLOGICAL_EXPERTISE_ATTACHMENTS, s));
    }

    private void expertiseProjectDocDescriptionType(ExpertiseProjectDocDescriptionType type) {
        asString(type.getExpertiseProjectDocNumber())
                .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_DOC_NUM, s));
        asLocalDateTime(type.getExpertiseProjectDocDate())
                .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_DOC_DATE, s));
        ofNullable(type.getProjectDocType())
                .ifPresent(ref -> {
                    asString(ref.getName())
                            .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_DOC_TYPE_NAME, s));
                    asString(ref.getCode())
                            .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_DOC_TYPE_CODE, s));
                });
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(
                                        s -> record.put(PROPERTY_EXPERTISE_PROJECT_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(
                                        s -> record.put(PROPERTY_EXPERTISE_PROJECT_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_ORGAN_ORGN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_ORGAN_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_ORGAN_IS_RES, s));
                });
        asFileType(type.getAttachments())
                .ifPresent(s -> record.put(PROPERTY_EXPERTISE_PROJECT_EXPERTISE_ATTACHMENTS, s.getName()));
    }

    private static String locality(@NotNull AddressElementType addressElementType) {
        return String.format("%s %s", addressElementType.getType(), addressElementType.getName());
    }
}
