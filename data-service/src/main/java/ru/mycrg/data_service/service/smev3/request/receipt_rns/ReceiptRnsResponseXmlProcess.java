package ru.mycrg.data_service.service.smev3.request.receipt_rns;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.fields.FieldsEisZs;
import ru.mycrg.data_service.receipt_rns_1_0_9.*;
import ru.mycrg.data_service.service.smev3.request.AResponseXmlProcess;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;


public class ReceiptRnsResponseXmlProcess extends AResponseXmlProcess {
    // папка для РНС имеет id=1
    private static final String ROOT_1 = "/root/1";
    private final HashMap<String, Object> content = new HashMap<>();
    private final List<HashMap<String, Object>> contentList = new ArrayList<>();

    public IRecord processOne(@NotNull ResponseConstructionType type) {
        try {
            changesConstPermitType(type.getChangesConstPermit());
            constructionType(type.getConstruction());

            content.put(FieldsEisZs.PROPERTY_PATH, ROOT_1);
            return new RecordEntity(content);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }

    public List<IRecord> processList(@NotNull List<ResponseConstructionShortInfoType> constructionShortInfoTypes) {
        try {
            constructionShortInfoTypes
                    .stream()
                    .map(ResponseConstructionShortInfoType::getVersionInfo)
                    .forEach(constructionVersionInfoType -> {
                        var content = new HashMap<String, Object>();
                        constructionVersionInfoType(content, constructionVersionInfoType);
                        contentList.add(content);
                    });

            return contentList
                    .stream()
                    .peek(map -> map.put(FieldsEisZs.PROPERTY_PATH, "/root/1"))
                    .map(RecordEntity::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }

    // collection
    private void constructionVersionInfoType(HashMap<String, Object> content, ConstructionVersionInfoType type) {
        asString(type.getConstPermitID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PREV_CONST_PERMIT_ID, s));
        asString(type.getConstPermitNumber())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PREV_CONST_PERMIT_NUMBER, s));
        asLocalDateTime(type.getConstPermitDate())
                .ifPresent(localDateTime -> content.put(FieldsEisZs.PROPERTY_PREV_CONST_PERMIT_DATE, localDateTime));
        asLocalDateTime(type.getChangesDate())
                .ifPresent(localDateTime -> content.put(FieldsEisZs.PROPERTY_PREV_CONST_CHANGES_DATE, localDateTime));
        ofNullable(type.getReasonChanges())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_REASON_CHANGES_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_REASON_CHANGES_CODE, s));
                });
        ofNullable(type.getObjectShortInfo())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(shortInfoType -> objectShortInfoType(content, shortInfoType));
    }

    private void objectShortInfoType(HashMap<String, Object> content, ObjectShortInfoType type) {
        asString(type.getObjectName())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_OBJECT_NAME, s));
        asString(type.getObjectID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_OBJECT_ID, s));
        asString(type.getObjectBusinessID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_BUSINESS_ID, s));
    }

    // one record
    private void changesConstPermitType(ChangesConstPermitType type) {
        asString(type.getPrevConstPermitID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PREV_CONST_PERMIT_ID, s));
        asString(type.getPrevConstPermitNumber())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PREV_CONST_PERMIT_NUMBER, s));
        asLocalDateTime(type.getPrevConstPermitDate())
                .ifPresent(localDateTime -> content.put(FieldsEisZs.PROPERTY_PREV_CONST_PERMIT_DATE, localDateTime));
        asLocalDateTime(type.getChangesDate())
                .ifPresent(localDateTime -> content.put(FieldsEisZs.PROPERTY_PREV_CONST_CHANGES_DATE, localDateTime));
        ofNullable(type.getReasonChanges())
                .flatMap(ref -> ref.stream().findFirst())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_REASON_CHANGES_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_REASON_CHANGES_CODE, s));
                });
        asString(type.getBasisChanges())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_BASIC_CHANGES, s));
        asLocalDateTime(type.getExtendedTo())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXTENDED_TO, s));
    }

    private void constructionType(ConstructionType type) {
        asString(type.getConstPermitID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_PERMITED_ID, s));
        asString(type.getConstPermitNumber())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_PERMITED_NUMBER, s));
        asInt(type.getConstGovernmentOrderId())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_GOVERNMENT_ORDER_ID, s));
        asString(type.getConstCadastralDistrict())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CADASTRAL_DISTRICT, s));
        asString(type.getConstCadastralArea())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CADASTRAL_AREA, s));
        asLocalDateTime(type.getExpireDate())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPIRE_DATE, s));
        ofNullable(type.getConstructionKind())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONSTRUCTION_KIND_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONSTRUCTION_KIND_CODE, s));
                });
        ofNullable(type.getConstPermissionType())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_PERMISSION_TYPE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_PERMISSION_TYPE_CODE, s));
                });
        asString(type.getObjectNameProjectDoc())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_NAME_PROJECT_DOC, s));
        ofNullable(type.getStatusConstruction())
                .map(Enum::name)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_STATUS, s));
        ofNullable(type.getScans())
                .flatMap(fileTypes -> fileTypes.stream().findFirst())
                .map(FileType::getName)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_FILE, s));

        recipientInfoType(type.getRecipientInfo());
        issueOrgan_OrganizationInfoType(type.getIssueOrgan());
        issueOrgan_FIOType(type.getIssuePerson());

        ofNullable(type.getObjectInfo())
                .flatMap(objectInfoTypes -> objectInfoTypes.stream().findFirst())
                .ifPresent(this::objectInfoType);
    }

    private void recipientInfoType(RecipientInfoType type) {
        ofNullable(type.getOrganizationInfo())
                .ifPresent(organizationInfoType -> {
                    asString(organizationInfoType.getOrganizationName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_ORGANIZATION_NAME, s));
                    asString(organizationInfoType.getOGRN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_OGRN, s));
                    asString(organizationInfoType.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_INN, s));
                    asString(organizationInfoType.getKPP())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_KPP, s));
                });
        asString(type.getEmail())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_EMAIL, s));
        ofNullable(type.getMailingAddress())
                .ifPresent(addressFullType -> {
                    asString(addressFullType.getFIAS())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_FIAS, s));
                    asString(addressFullType.getOKTMO())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_OKTMO, s));
                    asString(addressFullType.getRegion())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_REGION, s));
                    asString(addressFullType.getNote())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_NOTE, s));
                });
        ofNullable(type.getMailingAddress())
                .map(AddressFullType::getLocality)
                .ifPresent(addressElementType -> {
                    var locality = String.format("%s %s", addressElementType.getType(), addressElementType.getName());
                    content.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_LOCALITY, locality);
                });
    }

    private void issueOrgan_OrganizationInfoType(OrganizationInfoType type) {
        asString(type.getOrganizationName())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_PERMIT_ISSUE_ORGAN_ORGANIZATION_NAME, s));
        asString(type.getOGRN())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_PERMIT_ISSUE_ORGAN_OGRN, s));
        asString(type.getKPP())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_PERMIT_ISSUE_ORGAN_KPP, s));
        asString(type.getINN())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_PERMIT_ISSUE_ORGAN_INN, s));
    }

    private void issueOrgan_FIOType(FIOType type) {
        asString(type.getSurname())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ISSUE_PERSON_SURNAME, s));
        asString(type.getName())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ISSUE_PERSON_NAME, s));
        asString(type.getMiddleName())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ISSUE_PERSON_MIDDLE_NAME, s));
    }

    private void objectInfoType(ObjectInfoType type) {
        asString(type.getObjectName())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_OBJECT_NAME, s));
        asString(type.getObjectID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_OBJECT_ID, s));
        asString(type.getObjectBusinessID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_BUSINESS_ID, s));
        ofNullable(type.getObjectAddress())
                .ifPresent(addressFullType -> {
                    asString(addressFullType.getFIAS())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_FIAS, s));
                    asString(addressFullType.getOKTMO())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_OKTMO, s));
                    asString(addressFullType.getRegion())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_REGION, s));
                    asString(addressFullType.getNote())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_NOTE, s));
                });
        ofNullable(type.getObjectAddress())
                .map(AddressFullType::getLocality)
                .ifPresent(addressElementType -> {
                    var locality = String.format("%s %s", addressElementType.getType(), addressElementType.getName());
                    content.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_LOCALITY, locality);
                });
        ofNullable(type.getObjectKind())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_KIND_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_KIND_CODE, s));
                });
        ofNullable(type.getObjectPurpose())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_PURPOSE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_PURPOSE_CODE, s));
                });
        ofNullable(type.getObjectPurposeFunctional())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_CODE, s));
                });
        ofNullable(type.getBuildCapitalType())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_BUILD_CAPITAL_TYPE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_BUILD_CAPITAL_TYPE_CODE, s));
                });
        asString(type.getCadastralNumberOKS())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CADASTRAL_NUMBER_OKS, s));

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
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_TOTAL_AREA, s));
        asString(type.getBuildingArea())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_BUILDING_AREA, s));
        asString(type.getAreaObjectCap())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_AREA_OBJECT_CAP, s));
        asString(type.getAreaBuildingPartObject())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_AREA_BUILDING_PART_OBJECT, s));
        asString(type.getBuildingVolume())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_BUILDING_VOLUME, s));
        asString(type.getBuildingVolume())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_BUILDING_VOLUME, s));
        asString(type.getUndergroundPart())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_UNDER_GROUND_PART, s));
        asString(type.getCapacity())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CAPACITY, s));
        asString(type.getHeightObject())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_HEIGHT_OBJECT, s));
        asString(type.getMinNumberFloors())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_MIN_NUMBER_FLOORS, s));
        asString(type.getMaxNumberFloors())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_MAX_NUMBER_FLOORS, s));
        asString(type.getMinUndergroundFloors())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_MIN_UNDERGROUND_FLOORS, s));
        asString(type.getMaxUndergroundFloors())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_MAX_UNDERGROUND_FLOORS, s));
    }

    private void projectLongObjectsType(ProjectLongObjectsType type) {
        ofNullable(type.getCategory())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_CATEGORY_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_CATEGORY_CODE, s));
                });
        asString(type.getExtension())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_EXTENSION, s));
        asString(type.getLengthPart())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_LENGTH_PART, s));
        asString(type.getPower())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER, s));
        ofNullable(type.getPowerMeasure())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_MEASURE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_MEASURE_CODE, s));
                });
        asString(type.getPipeCharacteristics())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_PIPE_CHARACTERISTICS, s));
        ofNullable(type.getPowerLinesType())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_TYPE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_TYPE_CODE, s));
                });
        asString(type.getPowerLinesLevel())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_LEVEL, s));
        asString(type.getStructuralElements())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_LEVEL_2, s));
        asString(type.getOtherIndex())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_OTHER_INDEX, s));
    }

    private void otherProjectObjectType(OtherProjectObjectType type) {
        asString(type.getNumberApartments())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_NUMBER_APARTMENTS, s));
        asString(type.getNumberOneRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_NUMBER_ONE_ROOM, s));
        asString(type.getAreaOneRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_AREA_ONE_ROOM, s));
        asString(type.getNumberTwoRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_NUMBER_TWO_ROOM, s));
        asString(type.getAreaTwoRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_AREA_TWO_ROOM, s));
        asString(type.getNumberThreeRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_NUMBER_THREE_ROOM, s));
        asString(type.getAreaThreeRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_AREA_THREE_ROOM, s));
        asString(type.getNumberFourRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_NUMBER_FOUR_ROOM, s));
        asString(type.getAreaFourRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_AREA_FOUR_ROOM, s));
        asString(type.getNumberMoreRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_NUMBER_MORE_ROOM, s));
        asString(type.getAreaMoreRoom())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_AREA_MORE_ROOM, s));
        asString(type.getLivingArea())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LIVING_AREA, s));
        asString(type.getLivingArea2())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LIVING_AREA_2, s));
        asString(type.getUnlivingArea())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_UNLIVING_AREA, s));
        asString(type.getNumberUnlivigPremise())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_NUMBER_UNLIVING_AREA, s));
        asString(type.getPremisesLivingCount())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PREMISES_LIVING_COUNT, s));
        asString(type.getPremisesCount())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PREMISES_COUNT, s));
        asString(type.getNumberParkingSpase())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_NUMBER_PARKING_SPASE, s));
        asString(type.getElevators())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ELEVATORS, s));
        asString(type.getEscalators())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ESCALATORS, s));
        asString(type.getWheelchairLifts())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_WHEELCHAIR_LIFTS, s));
        ofNullable(type.getMaterialsFoundations())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_CODE, s));
                });
        asString(type.getCorrectMaterialsFoundations())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_FOUNDATIONS, s));
        ofNullable(type.getMaterialsWall())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE, s));
                });
        asString(type.getCorrectMaterialsWall())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_WALL, s));
        ofNullable(type.getCeilingMaterials())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_CODE, s));
                });
        asString(type.getCorrectCeilingMaterials())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CORRECT_CEILING_MATERIALS, s));
        ofNullable(type.getRoofingMaterials())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE, s));
                });
        asString(type.getCorrectRoofingMaterials())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CORRECT_ROOFING_MATERIALS, s));
        asString(type.getOtherIndex())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OTHER_INDEX, s));
    }

    private void infoDocDescriptionType(InfoDocDescriptionType type) {
        ofNullable(type.getStandardArchitecturalSolutionAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_AVAILABILITY, s));

        ofNullable(type.getStandardArchitecturalSolutionDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::standardArchitecturalSolutionDescriptionType);

        ofNullable(type.getLandCadastralAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LAND_PLOT_AVAILABILITY, s));

        ofNullable(type.getLandCadastralDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::landCadastralDescriptionType);

        ofNullable(type.getProjectDocumentationAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_AVAILABILITY, s));

        ofNullable(type.getDemarcationAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_AVAILABILITY, s));

        ofNullable(type.getDemarcationDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::demarcationDescriptionType);

        ofNullable(type.getProjectDocumentationDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::projectDocumentationDescriptionType);

        ofNullable(type.getDevPlanLandPlotAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_AVAILABILITY, s));

        ofNullable(type.getDevPlanLandPlotDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::devPlanLandPlotDescriptionType);

        ofNullable(type.getEcologicalExpertiseAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_AVAILABILITY, s));

        ofNullable(type.getEcologicalExpertiseDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::ecologicalExpertiseDescriptionType);

        ofNullable(type.getExpertiseProjectDocAvailability())
                .map(AvailabilityDocType::value)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_DOC_AVAILABILITY, s));

        ofNullable(type.getExpertiseProjectDocDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(this::expertiseProjectDocDescriptionType);
    }

    private void standardArchitecturalSolutionDescriptionType(StandardArchitecturalSolutionDescriptionType type) {
        asBigInteger(type.getStandArchSolutionYear())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_YEAR, s));
        asString(type.getStandArchSolutionCode())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_CODE, s));
        asString(type.getNameDoc())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_NAME_DOC, s));
        asFileType(type.getAttachments())
                .ifPresent(s -> {
                    content.put(FieldsEisZs.PROPERTY_SOLUTION_ATTACHMENS, s.getName());
                });
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_ORGAN_ORGN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_ORGAN_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_SOLUTION_ORGAN_IS_RES, s));
                });
    }

    private void landCadastralDescriptionType(LandCadastralDescriptionType type) {
        asString(type.getCadastralNumberZU())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LAND_PLOT_CAD_NUM, s));
        asString(type.getLandPlotArea())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_LAND_PLOT_AREA, s));
        asFileType(type.getAttachments())
                .ifPresent(s -> {
                    content.put(FieldsEisZs.PROPERTY_LAND_PLOT_ATTACHMENS, s.getName());
                });
    }

    private void projectDocumentationDescriptionType(ProjectDocumentationDescriptionType type) {
        asLocalDateTime(type.getDocumentationDate())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_DOC_DATE, s));
        asString(type.getProjectDocCode())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_DOC_CODE, s));
        asBoolean(type.isIsResident())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_IS_RES, s));
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_ORGAN_OGRN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_IS_RES, s));
                });
        ofNullable(type.getDeveloperType())
                .map(DocumentDeveloperType::value)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_DEVELOPER_TYPE, s));
        ofNullable(type.getIPDocInfo())
                .ifPresent(ipDocInfoType -> {
                    ofNullable(ipDocInfoType.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_OPF_CODE, s));
                            });
                    asString(ipDocInfoType.getOrganizationName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_IP_DOCUMENTATION_ORGANIZATION_NAME, s));
                    asString(ipDocInfoType.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_IP_DOCUMENTATION_PHYSICAL_ORGAN_INN, s));
                    asString(ipDocInfoType.getOGRNIP())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_IP_DOCUMENTATION_PHYSICAL_ORGAN_OGRN, s));
                    ofNullable(ipDocInfoType.getFIO())
                            .ifPresent(fioType -> {
                                asString(fioType.getSurname())
                                        .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_SURNAME, s));
                                asString(fioType.getName())
                                        .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_NAME, s));
                                asString(fioType.getMiddleName())
                                        .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_MIDDLE_NAME, s));
                            });
                });

        ofNullable(type.getPhysicalDocInfo())
                .ifPresent(physicalDocInfoType -> {
                    asString(physicalDocInfoType.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_IP_DOCUMENTATION_PHYSICAL_ORGAN_INN, s));
                    ofNullable(physicalDocInfoType.getFIO())
                            .ifPresent(fioType -> {
                                asString(fioType.getSurname())
                                        .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_SURNAME, s));
                                asString(fioType.getName())
                                        .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_NAME, s));
                                asString(fioType.getMiddleName())
                                        .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_PHYSICAL_MIDDLE_NAME, s));
                            });
                });
        asBigInteger(type.getProjectDocYear())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_PROJECT_DOCUMENTATION_YEAR, s));
    }

    private void demarcationDescriptionType(DemarcationDescriptionType type) {
        asString(type.getDemarcationNumber())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_NUMBER, s));
        asLocalDateTime(type.getDemarcationDate())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_DATE, s));
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_ORGAN_OGRN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_IS_RES, s));
                });
        ofNullable(type.getDocType())
                .ifPresent(docTpe -> {
                    asString(docTpe.getName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_DOC_TYPE_NAME, s));
                    asString(docTpe.getCode())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_DOC_TYPE_CODE, s));
                });
        ofNullable(type.getAdministrativeDocType())
                .ifPresent(docTpe -> {
                    asString(docTpe.getName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_ADM_DOC_TYPE_NAME, s));
                    asString(docTpe.getCode())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_ADM_DOC_TYPE_CODE, s));
                });
        asString(type.getURL())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_URL, s));
        asFileType(type.getTextDocs())
                .ifPresent(s -> {
                    content.put(FieldsEisZs.PROPERTY_DEMARCATION_TEXT_DOC_NAME, s.getName());
                    content.put(FieldsEisZs.PROPERTY_DEMARCATION_TEXT_DOC_ATTACHMENTID, s.getAttachmentId());
                });
        asFileType(type.getGraphDocs())
                .ifPresent(s -> {
                    content.put(FieldsEisZs.PROPERTY_DEMARCATION_GRAPH_DOC_NAME, s.getName());
                    content.put(FieldsEisZs.PROPERTY_DEMARCATION_GRAPH_DOC_ATTACHMENTID, s.getAttachmentId());
                });
        asFileType(type.getAttachmentDocs())
                .ifPresent(s -> {
                    content.put(FieldsEisZs.PROPERTY_DEMARCATION_ATTACH_NAME, s.getName());
                    content.put(FieldsEisZs.PROPERTY_DEMARCATION_ATTACH_ID, s.getAttachmentId());
                });
        ofNullable(type.getConditionalNumberZu())
                .flatMap(types -> types.stream().findFirst())
                .map(ConditionalNumberZuInfoType::getConditionalNumberZu)
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEMARCATION_CONDITIONAL_NUMBER_ZU, s));
    }

    private void devPlanLandPlotDescriptionType(DevPlanLandPlotDescriptionType type) {
        asString(type.getDevPlanLandPlotNumber())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_NUMBER, s));
        asLocalDateTime(type.getDevPlanLandPlotDate())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_DATE, s));
        ofNullable(type.getLandCadastralDescription())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(landCadastralDescription -> {
                    asString(landCadastralDescription.getCadastralNumberZU())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_CAD_NUM, s));
                    asString(landCadastralDescription.getLandPlotArea())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_AREA, s));
                    asFileType(landCadastralDescription.getAttachments())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_ATTACHMENS, s));
                });
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_ORGAN_ORGN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_ORGAN_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_ORGAN_IS_RES, s));
                });
        asFileType(type.getDevPlanLandPlotDocs())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_DOC_NAME, s));
        asFileType(type.getLandPlotPlanningOrganisationDocs())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_DEV_LAND_PLOT_ORG_NAME, s));
    }

    private void ecologicalExpertiseDescriptionType(EcologicalExpertiseDescriptionType type) {
        asString(type.getEcologicalExpertiseNumber())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_NUM, s));
        asLocalDateTime(type.getEcologicalExpertiseDate())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_DATE, s));
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_ORGN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_IS_RES, s));
                });
        asFileType(type.getAttachments())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_ECOLOGICAL_EXPERTISE_ATTACHMENTS, s));
    }

    private void expertiseProjectDocDescriptionType(ExpertiseProjectDocDescriptionType type) {
        asString(type.getExpertiseProjectDocNumber())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_DOC_NUM, s));
        asLocalDateTime(type.getExpertiseProjectDocDate())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_DOC_DATE, s));
        ofNullable(type.getProjectDocType())
                .ifPresent(ref -> {
                    asString(ref.getName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_DOC_TYPE_NAME, s));
                    asString(ref.getCode())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_DOC_TYPE_CODE, s));
                });
        ofNullable(type.getOrganDocInfo())
                .ifPresent(organDocInfo -> {
                    ofNullable(organDocInfo.getOrganizationOPF())
                            .ifPresent(ref -> {
                                asString(ref.getName()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_OPF_NAME, s));
                                asString(ref.getCode()).ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_OPF_CODE, s));
                            });
                    asString(organDocInfo.getOrganizationName())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_ORGANIZATION_NAME, s));
                    asString(organDocInfo.getINN())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_ORGAN_INN, s));
                    asString(organDocInfo.getOGRNCompany())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_ORGAN_ORGN, s));
                    asString(organDocInfo.getOrganizationRegNumber())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_ORGAN_REG_NUM, s));
                    asBoolean(organDocInfo.isIsResident())
                            .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_ORGAN_IS_RES, s));
                });
        asFileType(type.getAttachments())
                .ifPresent(s -> {
                    content.put(FieldsEisZs.PROPERTY_EXPERTISE_PROJECT_EXPERTISE_ATTACHMENTS, s.getName());
                });
    }
}
