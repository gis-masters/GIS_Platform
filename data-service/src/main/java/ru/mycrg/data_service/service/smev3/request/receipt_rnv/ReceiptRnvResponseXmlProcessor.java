package ru.mycrg.data_service.service.smev3.request.receipt_rnv;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rnv_1_0_9.*;
import ru.mycrg.data_service.service.smev3.fields.FieldsEisZs;
import ru.mycrg.data_service.service.smev3.request.AResponseXmlProcessor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;
import static ru.mycrg.data_service.service.smev3.fields.FieldsEisZs.PROPERTY_IS_RECORD_FULL;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

public class ReceiptRnvResponseXmlProcessor extends AResponseXmlProcessor {

    // папка для РНВ имеет id=1
    private static final String RNV_FOLDER = "/root/1";
    private static final String RNV_CONTENT_TYPE = "doc_rnv";

    private HashMap<String, Object> record = null;
    private List<HashMap<String, Object>> records = null;

    public IRecord processOne(@NotNull ExploitationType type) {
        try {
            record = new HashMap<>();

            asString(RNV_FOLDER)
                    .ifPresent(s -> record.put(PATH.getName(), s));
            asString(RNV_CONTENT_TYPE)
                    .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONTENT_TYPE_ID, s));
            asBoolean(true)
                    .ifPresent(b -> record.put(PROPERTY_IS_RECORD_FULL, b));

            asString(type.getPermitNumber())
                    .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PERMIT_NUMBER, s));
            asLocalDateTime(type.getPermitDate())
                    .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PERMIT_DATE, s));
            asString(type.getConstPermitNumber())
                    .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONST_PERMIT_NUMBER, s));
            asInt(type.getGovernmentOrderId())
                    .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONST_GOVERNMENT_ORDER_ID, s));
            asString(type.getCadastralDistrict())
                    .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CADASTRAL_DISTRICT, s));
            asString(type.getCadastralArea())
                    .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CADASTRAL_AREA, s));
            asString(type.getIssuePersonPosition())
                    .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ISSUE_PERSON_POSITION, s));
            ofNullable(type.getConstructionKind())
                    .ifPresent(ref -> {
                        asString(ref.getName()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONSTRUCTION_KIND_NAME, s));
                        asString(ref.getCode()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONSTRUCTION_KIND_CODE, s));
                    });

            ofNullable(type.getConstructionKind())
                    .ifPresent(ref -> {
                        asString(ref.getName()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONSTRUCTION_KIND_NAME, s));
                        asString(ref.getCode()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONSTRUCTION_KIND_CODE, s));
                    });

            ofNullable(type.getRecipientInfo())
                    .ifPresent(this::recipientInfoType);
            ofNullable(type.getIssueOrgan())
                    .ifPresent(this::issueOrgan);
            ofNullable(type.getIssuePerson())
                    .ifPresent(this::issueOrgan_FIOType);
            ofNullable(type.getConstPermitIssueOrgan())
                    .ifPresent(this::issueOrgan_OrganizationInfoType);
            ofNullable(type.getObjectInfo())
                    .flatMap(objectInfoTypes -> objectInfoTypes.stream().findFirst())
                    .ifPresent(this::objectInfoType);

            return new RecordEntity(record);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }

    public List<IRecord> processList(@NotNull List<ExploitationShortInfoType> constructionShortInfoTypes) {
        try {
            records = new ArrayList<>();

            constructionShortInfoTypes
                    .stream()
                    .map(ExploitationShortInfoType::getVersionInfo)
                    .forEach(constructionVersionInfoType -> {
                        record = new HashMap<>();
                        exploitationVersionInfoType(constructionVersionInfoType);
                        records.add(record);
                    });

            return records
                    .stream()
                    .map(RecordEntity::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }

    // collection
    private void exploitationVersionInfoType(ExploitationVersionInfoType type) {
        asString(RNV_FOLDER)
                .ifPresent(s -> record.put(PATH.getName(), s));
        asString(RNV_CONTENT_TYPE)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONTENT_TYPE_ID, s));
        asBoolean(false)
                .ifPresent(b -> record.put(PROPERTY_IS_RECORD_FULL, b));

        asString(type.getPermitNumber())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PERMIT_NUMBER, s));
        asLocalDateTime(type.getPermitDate())
                .ifPresent(localDateTime -> record.put(FieldsEisZs.PROPERTY_PERMIT_DATE, localDateTime));
        ofNullable(type.getIssueOrgan())
                .ifPresent(this::issueOrgan);

        ofNullable(type.getObjectShortInfo())
                .flatMap(types -> types.stream().findFirst())
                .ifPresent(shortInfoType -> objectShortInfoType(record, shortInfoType));
    }

    private void objectShortInfoType(HashMap<String, Object> content, ObjectShortInfoListType type) {
        asString(type.getObjectName())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_OBJECT_NAME, s));
        asLong(type.getObjectID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_CONST_OBJECT_ID, s));
        asString(type.getObjectBusinessID())
                .ifPresent(s -> content.put(FieldsEisZs.PROPERTY_OBJECT_BUSINESS_ID, s));
    }

    // one record

    private void objectInfoType(ObjectInfoType type) {
        asString(type.getObjectName())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ID, s));
        asString(type.getObjectID())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_NAME, s));
        asString(type.getConstObjectName())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONST_OBJECT_NAME, s));
        asString(type.getConstObjectID())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONST_OBJECT_NAME, s));
        asString(type.getObjectBusinessID())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_BUSINESS_ID, s));
        ofNullable(type.getObjectAddress())
                .map(AddressAttrType::getAddressFull)
                .ifPresent(addressFullType -> {
                    asString(addressFullType.getFIAS())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_FIAS, s));
                    asString(addressFullType.getOKTMO())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_OKTMO, s));
                    asString(addressFullType.getRegion())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_REGION, s));
                    asString(addressFullType.getNote())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_NOTE, s));
                    ofNullable(addressFullType.getLocality())
                            .ifPresent(l -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_LOCALITY, locality(l)));
                });
        ofNullable(type.getObjectAddressDoc())
                .flatMap(docTypes -> docTypes.stream().findFirst())
                .ifPresent(docType -> {
                    asString(docType.getDocNumber())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_DOC_NUM, s));
                    asLocalDateTime(docType.getDocDate())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_DOC_DATE, s));
                    asString(docType.getDocIssueOrganization())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_DOC_ISSUE, s));
                    ofNullable(docType.getDocIssueOrganOPF())
                            .ifPresent(refBookType -> {
                                asString(refBookType.getName())
                                        .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_DOC_OPF_NAME, s));
                                asString(refBookType.getCode())
                                        .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_DOC_OPF_CODE, s));
                            });
                    asString(docType.getDocIssueOrganINN())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_ADDRESS_DOC_ISSUE_ORGAN_INN, s));
                });
        ofNullable(type.getCadastralNumberOKS())
                .flatMap(docTypes -> docTypes.stream().findFirst())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CADASTRAL_NUMBER_OKS, s));
        ofNullable(type.getObjectBuildingAddress())
                .ifPresent(addressFullType -> {
                    asString(addressFullType.getFIAS())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CADASTRAL_NUMBER_OKS_FIAS, s));
                    asString(addressFullType.getOKTMO())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CADASTRAL_NUMBER_OKS_OKTMO, s));
                    asString(addressFullType.getRegion())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CADASTRAL_NUMBER_OKS_REGION, s));
                    asString(addressFullType.getNote())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CADASTRAL_NUMBER_OKS_NOTE, s));
                    ofNullable(addressFullType.getLocality())
                            .ifPresent(l -> record.put(FieldsEisZs.PROPERTY_CADASTRAL_NUMBER_OKS_LOCALITY, locality(l)));
                });
        ofNullable(type.getObjectKind())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_KIND_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_KIND_CODE, s));
                });
        ofNullable(type.getObjectPurpose())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_PURPOSE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_PURPOSE_CODE, s));
                });
        ofNullable(type.getObjectPurposeFunctional())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_CODE, s));
                });
        ofNullable(type.getBuildCapitalType())
                .ifPresent(ref -> {
                    asString(ref.getName()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_BUILD_CAPITAL_TYPE_NAME, s));
                    asString(ref.getCode()).ifPresent(s -> record.put(FieldsEisZs.PROPERTY_BUILD_CAPITAL_TYPE_CODE, s));
                });

        ofNullable(type.getTechnicalPlan())
                .flatMap(technicalPlanTypes -> technicalPlanTypes.stream().findFirst())
                .ifPresent(this::technicalPlanType);

        ofNullable(type.getObjectDescription())
                .ifPresent(this::objectDescription);
    }

    private void objectDescription(ObjectDescriptionType type) {
        ofNullable(type.getEnergyEfficiency())
                .ifPresent(this::energyEfficiencyType);

        ofNullable(type.getLongObjects())
                .ifPresent(this::longObjectsType);

        ofNullable(type.getProductiveObjects())
                .ifPresent(this::productiveObjectsType);

        ofNullable(type.getLivingObjects())
                .ifPresent(this::livingObjectsType);

        ofNullable(type.getUnlivingObjects())
                .ifPresent(this::unlivingObjectsType);

        ofNullable(type.getOverallPerformance())
                .ifPresent(this::overallPerformanceType);
    }

    private void energyEfficiencyType(EnergyEfficiencyType type) {
        ofNullable(type.getEnergyEfficiency())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ENERGY_EFFICIENCY_FA_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ENERGY_EFFICIENCY_FA_CODE, s));
                });
        ofNullable(type.getEnergyEfficiency())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ENERGY_EFFICIENCY_FA_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ENERGY_EFFICIENCY_FA_CODE, s));
                });
        ofNullable(type.getHeatConsumption())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_HEAT_CONSUMPTION_PR, s));
        ofNullable(type.getHeatConsumption())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_HEAT_CONSUMPTION_FA, s));
        ofNullable(type.getInsulatedMaterials())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_INSULATED_MATERIALS_PR, s));
        ofNullable(type.getInsulatedMaterials())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_INSULATED_MATERIALS_FA, s));
        ofNullable(type.getSkylights())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_SKYLIGHTS_IN_PROJECT, s));
        ofNullable(type.getSkylights())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_SKYLIGHTS_IN_FACT, s));
    }

    private void longObjectsType(LongObjectsType type) {
        ofNullable(type.getCategory())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(projectFactType -> {
                    asString(projectFactType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_CATEGORY_NAME_PR, s));
                    asString(projectFactType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_CATEGORY_CODE_PR, s));
                });
        ofNullable(type.getCategory())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(projectFactType -> {
                    asString(projectFactType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_CATEGORY_NAME, s));
                    asString(projectFactType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_CATEGORY_CODE, s));
                });

        ofNullable(type.getExtension())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_EXTENSION_PR, s));
        ofNullable(type.getExtension())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_EXTENSION, s));

        ofNullable(type.getLengthPart())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_LENGTH_PART_PR, s));
        ofNullable(type.getLengthPart())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_LENGTH_PART, s));

        ofNullable(type.getPower())
                .map(MesProjectFactType::getMeasure)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_MEASURE_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_MEASURE_CODE, s));
                });
        ofNullable(type.getPower())
                .map(MesProjectFactType::getProjectFact)
                .ifPresent(projectFactType -> {
                    asString(projectFactType.getInProject())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_PR, s));
                    asString(projectFactType.getInFact())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER, s));
                });

        ofNullable(type.getPipeCharacteristics())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_PIPE_CHARACTERISTICS_PR, s));
        ofNullable(type.getPipeCharacteristics())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_PIPE_CHARACTERISTICS, s));

        ofNullable(type.getPowerLinesType())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_TYPE_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_TYPE_CODE_PR, s));
                });
        ofNullable(type.getPowerLinesType())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_TYPE_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_TYPE_CODE, s));
                });

        ofNullable(type.getPowerLinesLevel())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_LEVEL_PR, s));
        ofNullable(type.getPowerLinesLevel())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_LEVEL, s));

        // todo почему такие же поля?
        ofNullable(type.getStructuralElements())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_LEVEL_PR, s));
        ofNullable(type.getStructuralElements())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_LINES_LEVEL, s));

        asString(type.getOtherIndex())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_OTHER_INDEX, s));
    }

    private void productiveObjectsType(ProductiveObjectsType type) {
        asString(type.getObjectName())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_CATEGORY_NAME, s));
        ofNullable(type.getObjectType())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECTS_TYPE_PR, s));
        ofNullable(type.getObjectType())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OBJECTS_TYPE, s));

        ofNullable(type.getPower())
                .map(MesProjectFactType::getMeasure)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_MEASURE_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_MEASURE_CODE, s));
                });
        ofNullable(type.getPower())
                .map(MesProjectFactType::getProjectFact)
                .ifPresent(projectFactType -> {
                    asString(projectFactType.getInProject())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_PR, s));
                    asString(projectFactType.getInFact())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER, s));
                });

        ofNullable(type.getPerformance())
                .map(MesProjectFactType::getMeasure)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PERFORMANCE_MEASURE_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PERFORMANCE_MEASURE_CODE, s));
                });
        ofNullable(type.getPerformance())
                .map(MesProjectFactType::getProjectFact)
                .ifPresent(projectFactType -> {
                    asString(projectFactType.getInProject())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER_PR, s));
                    asString(projectFactType.getInFact())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LONG_OBJECTS_POWER, s));
                });

        ofNullable(type.getElevators())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ELEVATORS_PR, s));
        ofNullable(type.getElevators())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ELEVATORS, s));

        ofNullable(type.getEscalators())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ESCALATORS_PR, s));
        ofNullable(type.getEscalators())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ESCALATORS, s));

        ofNullable(type.getWheelchairLifts())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_WHEELCHAIR_LIFTS_PR, s));
        ofNullable(type.getWheelchairLifts())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_WHEELCHAIR_LIFTS, s));

        ofNullable(type.getMaterialsFoundations())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_CODE_PR, s));
                });
        ofNullable(type.getMaterialsFoundations())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_CODE, s));
                });
        asString(type.getCorrectMaterialsFoundations())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_FOUNDATIONS, s));

        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE_PR, s));
                });
        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE, s));
                });
        asString(type.getCorrectMaterialsWall())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_WALL, s));

        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE_PR, s));
                });
        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE, s));
                });
        asString(type.getCorrectMaterialsWall())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_WALL, s));

        ofNullable(type.getCeilingMaterials())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_CODE_PR, s));
                });
        ofNullable(type.getCeilingMaterials())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_CODE, s));
                });
        asString(type.getCorrectCeilingMaterials())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_CEILING_MATERIALS, s));

        ofNullable(type.getRoofingMaterials())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_NAME, s));
                });
        ofNullable(type.getRoofingMaterials())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_NAME_FA, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE_FA, s));
                });
        asString(type.getCorrectRoofingMaterials())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_ROOFING_MATERIALS, s));

        asString(type.getOtherIndex())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OTHER_INDEX, s));

        ofNullable(type.getNetworkEngineering())
                .ifPresent(this::networkEngineeringType);
    }

    private void livingObjectsType(LivingObjectsType type) {
        ofNullable(type.getLivingArea())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LIVING_AREA_PR, s));
        ofNullable(type.getLivingArea())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LIVING_AREA, s));
        ofNullable(type.getUnlivingArea())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_UNLIVING_AREA_PR, s));
        ofNullable(type.getUnlivingArea())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_UNLIVING_AREA, s));
        ofNullable(type.getMinNumberFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MIN_NUMBER_FLOORS_PR, s));
        ofNullable(type.getMinNumberFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MIN_NUMBER_FLOORS, s));
        ofNullable(type.getMaxNumberFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_NUMBER_FLOORS_PR, s));
        ofNullable(type.getMaxNumberFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_NUMBER_FLOORS, s));
        ofNullable(type.getMinUndergroundFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MIN_UNDERGROUND_FLOORS_PR, s));
        ofNullable(type.getMinUndergroundFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MIN_UNDERGROUND_FLOORS, s));
        ofNullable(type.getMaxUndergroundFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_UNDERGROUND_FLOOR_PR, s));
        ofNullable(type.getMaxUndergroundFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_UNDERGROUND_FLOOR, s));
        ofNullable(type.getNumberSections())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_SECTIONS_PR, s));
        ofNullable(type.getNumberSections())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_SECTIONS, s));
        ofNullable(type.getPremisesLivingCount())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PREMISES_LIVING_COUNT_PR, s));
        ofNullable(type.getPremisesLivingCount())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PREMISES_LIVING_COUNT, s));
        ofNullable(type.getAreaApartments())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_APARTMENTS_PR, s));
        ofNullable(type.getAreaApartments())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_APARTMENTS, s));

        ofNullable(type.getNumberOneRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_ONE_ROOM_PR, s));
        ofNullable(type.getNumberOneRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_ONE_ROOM, s));
        ofNullable(type.getAreaOneRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_ONE_ROOM_PR, s));
        ofNullable(type.getAreaOneRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_ONE_ROOM, s));

        ofNullable(type.getNumberTwoRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_TWO_ROOM_PR, s));
        ofNullable(type.getNumberTwoRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_TWO_ROOM, s));
        ofNullable(type.getAreaTwoRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_TWO_ROOM_PR, s));
        ofNullable(type.getAreaTwoRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_TWO_ROOM, s));

        ofNullable(type.getNumberThreeRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_THREE_ROOM_PR, s));
        ofNullable(type.getNumberThreeRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_THREE_ROOM, s));
        ofNullable(type.getAreaThreeRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_THREE_ROOM_PR, s));
        ofNullable(type.getAreaThreeRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_THREE_ROOM, s));

        ofNullable(type.getNumberFourRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_FOUR_ROOM_PR, s));
        ofNullable(type.getNumberFourRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_FOUR_ROOM, s));
        ofNullable(type.getAreaFourRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_FOUR_ROOM_PR, s));
        ofNullable(type.getAreaFourRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_FOUR_ROOM, s));

        ofNullable(type.getNumberMoreRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_MORE_ROOM_PR, s));
        ofNullable(type.getNumberMoreRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_MORE_ROOM, s));
        ofNullable(type.getAreaMoreRoom())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_MORE_ROOM_PR, s));
        ofNullable(type.getAreaMoreRoom())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_MORE_ROOM, s));

        ofNullable(type.getLivingArea2())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LIVING_AREA_2_PR, s));
        ofNullable(type.getLivingArea2())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_LIVING_AREA_2, s));

        ofNullable(type.getElevators())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ELEVATORS_PR, s));
        ofNullable(type.getElevators())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ELEVATORS, s));

        ofNullable(type.getEscalators())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ESCALATORS_PR, s));
        ofNullable(type.getEscalators())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ESCALATORS, s));

        ofNullable(type.getWheelchairLifts())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_WHEELCHAIR_LIFTS_PR, s));
        ofNullable(type.getWheelchairLifts())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_WHEELCHAIR_LIFTS, s));

        ofNullable(type.getMaterialsFoundations())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_CODE_PR, s));
                });
        ofNullable(type.getMaterialsFoundations())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_CODE, s));
                });
        asString(type.getCorrectMaterialsFoundations())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_FOUNDATIONS, s));

        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE_PR, s));
                });
        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE, s));
                });
        asString(type.getCorrectMaterialsWall())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_WALL, s));

        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE_PR, s));
                });
        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE, s));
                });
        asString(type.getCorrectMaterialsWall())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_WALL, s));

        ofNullable(type.getCeilingMaterials())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_CODE_PR, s));
                });
        ofNullable(type.getCeilingMaterials())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_CODE, s));
                });
        asString(type.getCorrectCeilingMaterials())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_CEILING_MATERIALS, s));

        ofNullable(type.getRoofingMaterials())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_NAME, s));
                });
        ofNullable(type.getRoofingMaterials())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_NAME_FA, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE_FA, s));
                });
        asString(type.getCorrectRoofingMaterials())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_ROOFING_MATERIALS, s));

        asString(type.getOtherIndex())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OTHER_INDEX, s));

        ofNullable(type.getNetworkEngineering())
                .ifPresent(this::networkEngineeringType);
    }

    private void networkEngineeringType(NetworkEngineeringType type) {
        ofNullable(type.getNetworkHeatSupply())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_HEAT_SUPPLY_PR, s));
        ofNullable(type.getNetworkHeatSupply())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_HEAT_SUPPLY_FA, s));
        ofNullable(type.getNetworkHotWaterSupply())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_HOT_WATER_SUPPLY_PR, s));
        ofNullable(type.getNetworkHotWaterSupply())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_HOT_WATER_SUPPLY_FA, s));
        ofNullable(type.getNetworkLighting())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_LIGHTING_PR, s));
        ofNullable(type.getNetworkLighting())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_LIGHTING_FA, s));
        ofNullable(type.getNetworkStormWaterDisposal())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_STORM_WATER_DISPOSAL_PR, s));
        ofNullable(type.getNetworkLighting())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_STORM_WATER_DISPOSAL_FA, s));
        ofNullable(type.getNetworkEnergySaving())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_ENERGY_SAVING_PR, s));
        ofNullable(type.getNetworkEnergySaving())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_ENERGY_SAVING_FA, s));
        ofNullable(type.getNetworkGasSupply())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_GAS_SUPPLY_PR, s));
        ofNullable(type.getNetworkGasSupply())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NETWORK_GAS_SUPPLY_PR, s));
    }

    private void unlivingObjectsType(UnlivingObjectsType type) {
        ofNullable(type.getNumberSeats())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_SEATS_PR, s));
        ofNullable(type.getNumberSeats())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_SEATS_FA, s));
        ofNullable(type.getNumberRooms())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_ROOMS_PR, s));
        ofNullable(type.getNumberRooms())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_ROOMS_FA, s));
        ofNullable(type.getCapacity())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CAPACITY_PR, s));
        ofNullable(type.getCapacity())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CAPACITY, s));
        ofNullable(type.getMinNumberFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MIN_NUMBER_FLOORS_PR, s));
        ofNullable(type.getMinNumberFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MIN_NUMBER_FLOORS, s));
        ofNullable(type.getMaxNumberFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_NUMBER_FLOORS_PR, s));
        ofNullable(type.getMaxNumberFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_NUMBER_FLOORS, s));
        ofNullable(type.getMaxNumberFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_NUMBER_FLOORS_PR, s));
        ofNullable(type.getMaxNumberFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_NUMBER_FLOORS, s));
        ofNullable(type.getMinUndergroundFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MIN_UNDERGROUND_FLOORS_PR, s));
        ofNullable(type.getMinUndergroundFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MIN_UNDERGROUND_FLOORS, s));
        ofNullable(type.getMaxUndergroundFloors())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_UNDERGROUND_FLOOR_PR, s));
        ofNullable(type.getMaxUndergroundFloors())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MAX_UNDERGROUND_FLOOR, s));

        ofNullable(type.getElevators())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ELEVATORS_PR, s));
        ofNullable(type.getElevators())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ELEVATORS, s));
        ofNullable(type.getEscalators())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ESCALATORS_PR, s));
        ofNullable(type.getEscalators())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ESCALATORS, s));
        ofNullable(type.getWheelchairLifts())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_WHEELCHAIR_LIFTS_PR, s));
        ofNullable(type.getWheelchairLifts())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_WHEELCHAIR_LIFTS, s));

        ofNullable(type.getMaterialsFoundations())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_CODE_PR, s));
                });
        ofNullable(type.getMaterialsFoundations())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_FOUNDATIONS_CODE, s));
                });
        asString(type.getCorrectMaterialsFoundations())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_FOUNDATIONS, s));

        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE_PR, s));
                });
        ofNullable(type.getMaterialsWall())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_MATERIALS_WALL_CODE, s));
                });
        asString(type.getCorrectMaterialsWall())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_MATERIALS_WALL, s));

        ofNullable(type.getCeilingMaterials())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_NAME_PR, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_CODE_PR, s));
                });
        ofNullable(type.getCeilingMaterials())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_NAME, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CEILING_MATERIALS_CODE, s));
                });
        asString(type.getCorrectCeilingMaterials())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_CEILING_MATERIALS, s));

        ofNullable(type.getRoofingMaterials())
                .map(RefBookProjectFactType::getInProject)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE, s));
                });
        ofNullable(type.getRoofingMaterials())
                .map(RefBookProjectFactType::getInFact)
                .ifPresent(refBookType -> {
                    asString(refBookType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE_FA, s));
                    asString(refBookType.getCode())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ROOFING_MATERIALS_CODE_FA, s));
                });
        asString(type.getCorrectRoofingMaterials())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CORRECT_ROOFING_MATERIALS, s));

        asString(type.getOtherIndex())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OTHER_INDEX, s));
    }

    private void overallPerformanceType(OverallPerformanceType type) {
        ofNullable(type.getBuildingVolume())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_BUILDING_VOLUME_PR, s));
        ofNullable(type.getBuildingVolume())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_BUILDING_VOLUME, s));
        ofNullable(type.getTotalArea())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TOTAL_AREA_PR, s));
        ofNullable(type.getTotalArea())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TOTAL_AREA, s));
        ofNullable(type.getUnlivingArea())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_UNLIVING_AREA_PR, s));
        ofNullable(type.getUnlivingArea())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_UNLIVING_AREA, s));
        ofNullable(type.getOutbuildingArea())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OUTBUILDING_AREA_PR, s));
        ofNullable(type.getOutbuildingArea())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_OUTBUILDING_AREA, s));
        ofNullable(type.getNumberBuildings())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_BUILDINGS_PR, s));
        ofNullable(type.getNumberBuildings())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_NUMBER_BUILDINGS, s));
        ofNullable(type.getAreaObjectCap())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_OBJECT_CAP_PR, s));
        ofNullable(type.getAreaObjectCap())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_OBJECT_CAP, s));
        ofNullable(type.getAreaBuildingPartObject())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_BUILDING_PART_OBJECT_PR, s));
        ofNullable(type.getAreaBuildingPartObject())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_AREA_BUILDING_PART_OBJECT, s));
        ofNullable(type.getBuildingArea())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_BUILDING_AREA_PR, s));
        ofNullable(type.getBuildingArea())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_BUILDING_AREA, s));
        ofNullable(type.getPremisesCount())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PREMISES_COUNT_PR, s));
        ofNullable(type.getPremisesCount())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_PREMISES_COUNT, s));
        ofNullable(type.getHeightObject())
                .map(ProjectFactType::getInProject)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_HEIGHT_OBJECT_PR, s));
        ofNullable(type.getHeightObject())
                .map(ProjectFactType::getInFact)
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_HEIGHT_OBJECT, s));
    }

    private void technicalPlanType(TechnicalPlanType type) {
        asLocalDateTime(type.getDTechnicalPlan())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_DATE, s));
        asString(type.getTechnicalPlanID())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_ID, s));
        ofNullable(type.getEngineer())
                .flatMap(engineerType -> asString(engineerType.getEngineerSnils()))
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_ENG_SNILS, s));
        ofNullable(type.getEngineer())
                .map(EngineerType::getCertificateDoc)
                .ifPresent(docType -> {
                    asString(docType.getDocNumber())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_CERT_NUM, s));
                    asLocalDateTime(docType.getDocDate())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_CERT_DATE, s));
                    asString(docType.getDocIssueOrganization())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_CERT_ORGANIZATION, s));
                    ofNullable(docType.getDocIssueOrganOPF())
                            .ifPresent(refBookType -> {
                                asString(refBookType.getName())
                                        .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_CERT_OPF_NAME, s));
                                asString(refBookType.getCode())
                                        .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_CERT_OPF_CODE, s));
                            });
                    asString(docType.getDocIssueOrganINN())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_CERT_INN, s));
                });
        ofNullable(type.getEngineer())
                .map(EngineerType::getEngineerFIO)
                .ifPresent(fioType -> {
                    asString(fioType.getSurname())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_ENG_SURNAME, s));
                    asString(fioType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_ENG_NAME, s));
                    asString(fioType.getMiddleName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_TECHNICAL_PLAN_ENG_MIDDLE_NAME, s));
                });
    }

    private void issueOrgan_OrganizationInfoType(OrganizationInfoType type) {
        asString(type.getOrganizationName())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONST_PERMIT_ISSUE_ORGAN_ORGANIZATION_NAME, s));
        asString(type.getOGRN())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONST_PERMIT_ISSUE_ORGAN_OGRN, s));
        asString(type.getKPP())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONST_PERMIT_ISSUE_ORGAN_KPP, s));
        asString(type.getINN())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_CONST_PERMIT_ISSUE_ORGAN_INN, s));
    }

    private void issueOrgan_FIOType(FIOType type) {
        asString(type.getSurname())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ISSUE_PERSON_SURNAME, s));
        asString(type.getName())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ISSUE_PERSON_NAME, s));
        asString(type.getMiddleName())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ISSUE_PERSON_MIDDLE_NAME, s));
    }

    private void issueOrgan(OrganizationInfoType type) {
        asString(type.getOrganizationName())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ISSUE_ORGAN_ORGANIZATION_NAME, s));
        asString(type.getOGRN())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ISSUE_ORGAN_OGRN, s));
        asString(type.getKPP())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ISSUE_ORGAN_INN, s));
        asString(type.getINN())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_ISSUE_ORGAN_KPP, s));
    }

    private void recipientInfoType(RecipientInfoType type) {
        ofNullable(type.getPersonInfo())
                .map(PersonInfoType::getRecipientFIO)
                .ifPresent(fioType -> {
                    asString(fioType.getName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_NAME, s));
                    asString(fioType.getMiddleName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_MIDDLE_NAME, s));
                    asString(fioType.getSurname())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_SURNAME, s));
                });

        ofNullable(type.getPersonInfo())
                .ifPresent(personInfoType -> {
                    asString(personInfoType.getINN())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_INN, s));
                    asString(personInfoType.getSNILS())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_SNILS, s));
                });

        ofNullable(type.getOrganizationInfo())
                .ifPresent(organizationInfoType -> {
                    asString(organizationInfoType.getOrganizationName())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_ORGANIZATION_NAME, s));
                    asString(organizationInfoType.getOGRN())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_OGRN, s));
                    asString(organizationInfoType.getINN())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_INN, s));
                    asString(organizationInfoType.getKPP())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_KPP, s));
                });
        asString(type.getEmail())
                .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECEPIENT_INFO_EMAIL, s));
        ofNullable(type.getMailingAddress())
                .ifPresent(addressFullType -> {
                    asString(addressFullType.getFIAS())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_FIAS, s));
                    asString(addressFullType.getOKTMO())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_OKTMO, s));
                    asString(addressFullType.getRegion())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_REGION, s));
                    asString(addressFullType.getNote())
                            .ifPresent(s -> record.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_NOTE, s));
                });
        ofNullable(type.getMailingAddress())
                .map(AddressFullType::getLocality)
                .ifPresent(l -> record.put(FieldsEisZs.PROPERTY_RECIPIENT_INFO_LOCALITY, locality(l)));
    }

    private static String locality(@NotNull AddressElementType addressElementType) {
        return String.format("%s %s", addressElementType.getType(), addressElementType.getName());
    }
}
