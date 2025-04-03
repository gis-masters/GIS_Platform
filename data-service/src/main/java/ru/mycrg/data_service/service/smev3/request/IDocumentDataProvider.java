package ru.mycrg.data_service.service.smev3.request;

import ru.mycrg.data_service.accept_rns_1_0_3.*;
import ru.mycrg.data_service.accept_rnv_1_0_6.PermissionObjectOperationBlockType;
import ru.mycrg.data_service.accept_rnv_1_0_6.PermissionObjectOperationType;

import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

public interface IDocumentDataProvider {

    <T> String getFirstName(T request);

     <T> String getLastName(T request);

     <T> String getMiddleName(T request);

     <T> String getInn(T request);

     <T> String getOgrnip(T request);

     <T> String getRegAddress(T request);

     <T> String getFactAddress(T request);

     <T> String getOrgFullName(T request);

     <T> String getOrgInn(T request);

     <T> String getOrgOgrn(T request);

     <T> String getOrgRegAddress(T request);

     <T> String getOrgPostAddress(T request);

     <T> String getOrgEmail(T request);

     <T> String getOrgPhone(T request);

     <T> String getObjectName(T request);

     <T> String getLandPlotCadastralNumber(T request);

     <T> String getFullfio(T request);

     <T> String getDateBirth(T request);

     <T> String getDocSeries(T request);

     <T> String getNameDoc(T request);

     <T> String getDocNumber(T request);

     <T> String getIssueOrg(T request);

     <T> String getIssueDate(T request);

     <T> String getPhone(T request);

     <T> String getEmail(T request);

     <T> String getPermitNumber(T request);

     <T> String getPermitDate(T request);

     <T> String getCurrentVersion(T request);

     <T> String getNewVersion(T request);

    default String getPermitTerm(RequestType request) {

        return ofNullable(request.getConstructionPermitsData())
                .map(ConstructionPermitsDataType::getTerm).orElse("");
    }

    default String getGPZUDate(RequestType request) {

        return ofNullable(request.getGPZU()).map(gpzuType -> gpzuType.getGPZUBlock()
                                                                     .stream()
                                                                     .map(GPZUBlockType::getDate)
                                                                     .collect(Collectors.joining(", ")))
                                            .orElse("");
    }

    default String getGPZUNumber(RequestType request) {

        return ofNullable(request.getGPZU()).map(gpzuType -> gpzuType.getGPZUBlock()
                                                                     .stream()
                                                                     .map(GPZUBlockType::getNumber)
                                                                     .collect(Collectors.joining(", ")))
                                            .orElse("");
    }

    default String getGPZUIssuer(RequestType request) {

        return ofNullable(request.getGPZU()).map(gpzuType -> gpzuType.getGPZUBlock()
                                                                     .stream()
                                                                     .map(GPZUBlockType::getIssuer)
                                                                     .collect(Collectors.joining(", ")))
                                            .orElse("");
    }

    default String getDecisionDate(RequestType request) {

        return ofNullable(request.getDecisionSchemeOnCadastralPlan())
                .map(planType -> planType.getDecisionSchemeOnCadastralPlanBlock()
                                         .stream()
                                         .map(DecisionSchemeOnCadastralPlanBlockType::getDate)
                                         .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getDecisionNumber(RequestType request) {

        return ofNullable(request.getDecisionSchemeOnCadastralPlan())
                .map(planType -> planType.getDecisionSchemeOnCadastralPlanBlock()
                                         .stream()
                                         .map(DecisionSchemeOnCadastralPlanBlockType::getNumber)
                                         .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getDecisionIssuer(RequestType request) {

        return ofNullable(request.getDecisionSchemeOnCadastralPlan())
                .map(planType -> planType.getDecisionSchemeOnCadastralPlanBlock()
                                         .stream()
                                         .map(DecisionSchemeOnCadastralPlanBlockType::getIssuer)
                                         .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getPlanProjectDate(RequestType request) {

        return ofNullable(request.getPlanProject())
                .map(projectType -> projectType.getPlanProjectBlock()
                                               .stream()
                                               .map(PlanProjectBlockType::getDate)
                                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getPlanProjectNumber(RequestType request) {

        return ofNullable(request.getPlanProject())
                .map(projectType -> projectType.getPlanProjectBlock()
                                               .stream()
                                               .map(PlanProjectBlockType::getNumber)
                                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getPlanProjectIssuer(RequestType request) {

        return ofNullable(request.getPlanProject())
                .map(projectType -> projectType.getPlanProjectBlock()
                                               .stream()
                                               .map(PlanProjectBlockType::getIssuer)
                                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getSurveyingDate(RequestType request) {

        return ofNullable(request.getSurveying())
                .map(surveyingType -> surveyingType.getSurveyingBlock()
                                                   .stream()
                                                   .map(SurveyingBlockType::getDate)
                                                   .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getSurveyingNumber(RequestType request) {

        return ofNullable(request.getSurveying())
                .map(surveyingType -> surveyingType.getSurveyingBlock()
                                                   .stream()
                                                   .map(SurveyingBlockType::getNumber)
                                                   .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getSurveyingIssuer(RequestType request) {

        return ofNullable(request.getSurveying())
                .map(surveyingType -> surveyingType.getSurveyingBlock()
                                                   .stream()
                                                   .map(SurveyingBlockType::getIssuer)
                                                   .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getTitleDocName(RequestType request) {

        return ofNullable(request.getTitleDocConstructionObject())
                .map(titleDocType -> titleDocType.getTitleDocConstructionObjectBlock()
                                                   .stream()
                                                   .map(TitleDocConstructionObjectBlockType::getDocumentName)
                                                   .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getTitleDocDate(RequestType request) {

        return ofNullable(request.getTitleDocConstructionObject())
                .map(titleDocType -> titleDocType.getTitleDocConstructionObjectBlock()
                                                 .stream()
                                                 .map(TitleDocConstructionObjectBlockType::getDate)
                                                 .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getTitleDocNumber(RequestType request) {

        return ofNullable(request.getTitleDocConstructionObject())
                .map(titleDocType -> titleDocType.getTitleDocConstructionObjectBlock()
                                                 .stream()
                                                 .map(TitleDocConstructionObjectBlockType::getNumber)
                                                 .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getArchitectSolutionDate(RequestType request) {

        return ofNullable(request.getTypicalArchitectSolution())
                .map(sol -> sol.getTypicalArchitectSolutionBlock()
                               .stream()
                               .map(TypicalArchitectSolutionBlockType::getDate)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getArchitectSolutionNumber(RequestType request) {

        return ofNullable(request.getTypicalArchitectSolution())
                .map(sol -> sol.getTypicalArchitectSolutionBlock()
                               .stream()
                               .map(TypicalArchitectSolutionBlockType::getNumber)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getArchitectSolutionDocName(RequestType request) {

        return ofNullable(request.getTypicalArchitectSolution())
                .map(sol -> sol.getTypicalArchitectSolutionBlock()
                               .stream()
                               .map(TypicalArchitectSolutionBlockType::getDocName)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getArchitectSolutionIssuer(RequestType request) {

        return ofNullable(request.getTypicalArchitectSolution())
                .map(sol -> sol.getTypicalArchitectSolutionBlock()
                               .stream()
                               .map(TypicalArchitectSolutionBlockType::getIssuer)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getDocumentationExpertiseDate(RequestType request) {

        return ofNullable(request.getProjectDocumentationExpertise())
                .map(exp -> exp.getProjectDocumentationExpertiseBlock()
                               .stream()
                               .map(ProjectDocumentationExpertiseBlockType::getDate)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getDocExpertiseNumber(RequestType request) {

        return ofNullable(request.getProjectDocumentationExpertise())
                .map(exp -> exp.getProjectDocumentationExpertiseBlock()
                               .stream()
                               .map(ProjectDocumentationExpertiseBlockType::getNumber)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getDocExpIssuer(RequestType request) {

        return ofNullable(request.getProjectDocumentationExpertise())
                .map(exp -> exp.getProjectDocumentationExpertiseBlock()
                               .stream()
                               .map(ProjectDocumentationExpertiseBlockType::getAdditionalField1)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getEcoExpertiseDate(RequestType request) {

        return ofNullable(request.getEcologicalExpertise())
                .map(exp -> exp.getEcologicalExpertiseBlock()
                               .stream()
                               .map(EcologicalExpertiseBlockType::getDate)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getEcoExpertiseNumber(RequestType request) {

        return ofNullable(request.getEcologicalExpertise())
                .map(exp -> exp.getEcologicalExpertiseBlock()
                               .stream()
                               .map(EcologicalExpertiseBlockType::getNumber)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getEcoExpertiseIssuer(RequestType request) {

        return ofNullable(request.getEcologicalExpertise())
                .map(exp -> exp.getEcologicalExpertiseBlock()
                               .stream()
                               .map(EcologicalExpertiseBlockType::getIssuer)
                               .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getObjCadastralNumber(RequestType request) {

        return ofNullable(request.getObjectData())
                .map(object -> object.getObjectCadastralBlock()
                                     .stream()
                                     .flatMap(block -> block.getObjectCadastralNumber()
                                                            .stream())
                                     .collect(Collectors.joining(", ")))
                .orElse("");
    }

    default String getCapObjectName(RequestType request) {
        return Optional.ofNullable(request.getVariantChoice())
                       .map(VariantChoiceType::getKPOA10)
                       .filter(kpoa -> kpoa.intValue() == 1)
                       .map(k -> getObjectName(request))
                       .orElse("");
    }

    default String getCapObjectCadastralNumber(RequestType request) {
        return Optional.ofNullable(request.getVariantChoice())
                       .map(VariantChoiceType::getKPOA10)
                       .filter(kpoa -> kpoa.intValue() == 1)
                       .map(k -> getObjCadastralNumber(request))
                       .orElse("");
    }

    default String getLineObjectName(RequestType request) {
        return Optional.ofNullable(request.getVariantChoice())
                       .map(VariantChoiceType::getKPOA10)
                       .filter(kpoa -> kpoa.intValue() == 2)
                       .map(k -> getObjectName(request))
                       .orElse("");
    }

    default String getLineObjectCadastralNumber(RequestType request) {
        return Optional.ofNullable(request.getVariantChoice())
                       .map(VariantChoiceType::getKPOA10)
                       .filter(kpoa -> kpoa.intValue() == 2)
                       .map(k -> getObjCadastralNumber(request))
                       .orElse("");
    }

    default String getObjectAppointment(RequestType request) {
        return Optional.ofNullable(request.getVariantChoice())
                       .filter(vc -> vc.getKPOA10() != null && vc.getKPOA10().intValue() == 1)
                       .map(VariantChoiceType::getKPOA12)
                       .map(kpoa12 -> {
                           if (Boolean.TRUE.equals(kpoa12.isResidential())) {
                               return "Жилой многоквартирный дом";
                           }
                           if (Boolean.TRUE.equals(kpoa12.isUninhabited())) {
                               return "Нежилой";
                           }
                           return "";
                       })
                       .orElse("");
    }

    default String getConstruction(RequestType request) {

        return ofNullable(request.getVariantChoice())
                .map(VariantChoiceType::getKPOA11)
                .map(kpoa11Type -> Boolean.TRUE.equals(
                        kpoa11Type.isConstruction()) ? "Строительство" : "Реконструкция")
                .orElse("");
    }

    default String getPermitIssuer(ru.mycrg.data_service.accept_rnv_1_0_6.RequestType request) {

        return ofNullable(request.getPermissionObjectOperation())
                .map(PermissionObjectOperationType::getPermissionObjectOperationBlock)
                .map(PermissionObjectOperationBlockType::getIssuer)
                .orElse("");
    }

    default String getBuildingPermitDate(ru.mycrg.data_service.accept_rnv_1_0_6.RequestType request) {

        return ofNullable(request.getPermissionObjectOperation())
                        .map(objectOperationType -> objectOperationType.getPermissionObjectOperationStageBlock().stream()
                                                                       .map(PermissionObjectOperationBlockType::getDate)
                                                                       .collect(Collectors.joining(", ")))
                        .filter(date -> !date.isEmpty())
                        .orElse("");
    }

    default String getBuildingPermitNumber(ru.mycrg.data_service.accept_rnv_1_0_6.RequestType request) {

        return ofNullable(request.getPermissionObjectOperation())
                        .map(objectOperationType -> objectOperationType.getPermissionObjectOperationStageBlock().stream()
                                                                       .map(PermissionObjectOperationBlockType::getNumber)
                                                                       .collect(Collectors.joining(", ")))
                        .filter(num -> !num.isEmpty())
                        .orElse("");
    }

    default String getBuildingPermitIssuer(ru.mycrg.data_service.accept_rnv_1_0_6.RequestType request) {

        return ofNullable(request.getPermissionObjectOperation())
                        .map(objectOperationType -> objectOperationType.getPermissionObjectOperationStageBlock().stream()
                                                                       .map(PermissionObjectOperationBlockType::getIssuer)
                                                                       .collect(Collectors.joining(", ")))
                        .filter(issuer -> !issuer.isEmpty())
                        .orElse("");
    }
}
