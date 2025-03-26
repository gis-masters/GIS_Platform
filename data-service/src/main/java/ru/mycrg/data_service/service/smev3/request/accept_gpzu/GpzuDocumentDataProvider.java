package ru.mycrg.data_service.service.smev3.request.accept_gpzu;

import ru.mycrg.data_service.gpzu_1_0_1.*;

import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Optional.*;

public class GpzuDocumentDataProvider {

    private final RequestType request;

    public GpzuDocumentDataProvider(RequestType request) {
        this.request = request;
    }

    public String getCompetentOrganizationName() {
        return request.getCompetentOrganization().getName();
    }

    public String getServiceCurrentDate() {
        return request.getService().getCurrentDate();
    }

    public String getFullFio() {
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(
                request.getDelegatePersonalData());
        Optional<RecipientPersonalDataType> oRecepientPersonalData = ofNullable(
                request.getRecipientPersonalData());

        return oDelegatePersonalData.map(DelegatePersonalDataType::getFullfio)
                                    .orElse(oRecepientPersonalData.map(RecipientPersonalDataType::getFullfio)
                                                                  .orElse(""));
    }

    public String getTypeDoc() {
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(
                request.getDelegatePersonalData());
        Optional<RecipientPersonalDataType> oRecepientPersonalData = ofNullable(
                request.getRecipientPersonalData());

        return oDelegatePersonalData.map(DelegatePersonalDataType::getDocumentPersonal)
                                    .map(DocumentPersonalType::getTypeDoc)
                                    .orElse(oRecepientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                                  .map(DocumentPersonalType::getTypeDoc)
                                                                  .orElse(""));
    }

    public String getNameDoc() {
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(
                request.getDelegatePersonalData());
        Optional<RecipientPersonalDataType> oRecepientPersonalData = ofNullable(
                request.getRecipientPersonalData());

        return oDelegatePersonalData.map(DelegatePersonalDataType::getDocumentPersonal)
                                    .map(DocumentPersonalType::getNameDoc)
                                    .orElse(oRecepientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                                  .map(DocumentPersonalType::getNameDoc)
                                                                  .orElse(""));
    }

    public String getDocSeries() {
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(
                request.getDelegatePersonalData());
        Optional<RecipientPersonalDataType> oRecepientPersonalData = ofNullable(
                request.getRecipientPersonalData());

        return oDelegatePersonalData.map(DelegatePersonalDataType::getDocumentPersonal)
                                    .map(DocumentPersonalType::getDocseries)
                                    .orElse(oRecepientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                                  .map(DocumentPersonalType::getDocseries)
                                                                  .orElse(""));
    }

    public String getDocNumber() {
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(
                request.getDelegatePersonalData());
        Optional<RecipientPersonalDataType> oRecepientPersonalData = ofNullable(
                request.getRecipientPersonalData());

        return oDelegatePersonalData.map(DelegatePersonalDataType::getDocumentPersonal)
                                    .map(DocumentPersonalType::getDocnumber)
                                    .orElse(oRecepientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                                  .map(DocumentPersonalType::getDocnumber)
                                                                  .orElse(""));
    }

    public String getIssueDate() {
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(
                request.getDelegatePersonalData());
        Optional<RecipientPersonalDataType> oRecepientPersonalData = ofNullable(
                request.getRecipientPersonalData());

        return oDelegatePersonalData.map(DelegatePersonalDataType::getDocumentPersonal)
                                    .map(DocumentPersonalType::getIssuedate)
                                    .orElse(oRecepientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                                  .map(DocumentPersonalType::getIssuedate)
                                                                  .orElse(""));
    }

    public String getIssueOrg() {
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(
                request.getDelegatePersonalData());
        Optional<RecipientPersonalDataType> oRecepientPersonalData = ofNullable(
                request.getRecipientPersonalData());

        return oDelegatePersonalData.map(DelegatePersonalDataType::getDocumentPersonal)
                                    .map(DocumentPersonalType::getIssueorg)
                                    .orElse(oRecepientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                                  .map(DocumentPersonalType::getIssueorg)
                                                                  .orElse(""));
    }

    public String getIssueIdPassportRF() {
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(
                request.getDelegatePersonalData());
        Optional<RecipientPersonalDataType> oRecepientPersonalData = ofNullable(
                request.getRecipientPersonalData());

        return oDelegatePersonalData.map(DelegatePersonalDataType::getDocumentPersonal)
                                    .map(DocumentPersonalType::getIssueidPassportRF)
                                    .orElse(oRecepientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                                  .map(DocumentPersonalType::getIssueidPassportRF)
                                                                  .orElse(""));
    }

    public String getOrgFullName() {
        Optional<DelegateBusinessmanDataType> oDelegateBusinessmanData = ofNullable(
                request.getDelegateBusinessmanData());
        Optional<BusinessmanDataType> oBusinessmanData = ofNullable(
                request.getBusinessmanData());

        return oDelegateBusinessmanData.map(DelegateBusinessmanDataType::getOrgFullname)
                                       .orElse(oBusinessmanData.map(BusinessmanDataType::getOrgFullname)
                                                               .orElse(""));
    }

    public String getOrgOgrn() {
        Optional<DelegateBusinessmanDataType> oDelegateBusinessmanData = ofNullable(
                request.getDelegateBusinessmanData());
        Optional<BusinessmanDataType> oBusinessmanData = ofNullable(
                request.getBusinessmanData());

        return oDelegateBusinessmanData.map(DelegateBusinessmanDataType::getOrgOgrn)
                                       .orElse(oBusinessmanData.map(BusinessmanDataType::getOrgOgrn)
                                                               .orElse(""));
    }

    public String getOrgInn() {
        Optional<DelegateBusinessmanDataType> oDelegateBusinessmanData = ofNullable(
                request.getDelegateBusinessmanData());
        Optional<BusinessmanDataType> oBusinessmanData = ofNullable(
                request.getBusinessmanData());

        return oDelegateBusinessmanData.map(DelegateBusinessmanDataType::getOrgInn)
                                       .orElse(oBusinessmanData.map(BusinessmanDataType::getOrgInn)
                                                               .orElse(""));
    }

    public String getCompanyOrgFullName() {
        Optional<DelegateLegalDataType> oDelegateLegalData = ofNullable(request.getDelegateLegalData());
        Optional<LegalDataType> oLegalData = ofNullable(request.getLegalData());

        return oDelegateLegalData.map(DelegateLegalDataType::getOrgFullname)
                .orElse(oLegalData.map(LegalDataType::getOrgFullname)
                                  .orElse(""));
    }

    public String getCompanyOrgOgrn() {
        Optional<DelegateLegalDataType> oDelegateLegalData = ofNullable(request.getDelegateLegalData());
        Optional<LegalDataType> oLegalData = ofNullable(request.getLegalData());

        return oDelegateLegalData.map(DelegateLegalDataType::getOrgOgrn)
                                 .orElse(oLegalData.map(LegalDataType::getOrgOgrn)
                                                   .orElse(""));
    }

    public String getCompanyOrgInn() {
        Optional<DelegateLegalDataType> oDelegateLegalData = ofNullable(request.getDelegateLegalData());
        Optional<LegalDataType> oLegalData = ofNullable(request.getLegalData());

        return oDelegateLegalData.map(DelegateLegalDataType::getOrgInn)
                                 .orElse(oLegalData.map(LegalDataType::getOrgInn)
                                                   .orElse(""));
    }

    public String getCadastralNumber() {
        return String.join(", ", request.getDataLandPlotData().getLandPlotCadastralNumber());
    }

    public String getPurposeLandPlot() {
        Optional<DataLandPlotType> data = ofNullable(request.getDataLandPlotData());

        return data.map(DataLandPlotType::getPurposeLandPlot).orElse("");
    }

    public String isDescriptionLocationRequired() {
        Optional<DataLandPlotType> data = ofNullable(request.getDataLandPlotData());

        return data.map(dataLandPlotType -> dataLandPlotType.isIsDescriptionLocationRequired().toString())
                   .orElse("");
    }

    public String getFiasFullCode() {
        Optional<DataLandPlotType> data = ofNullable(request.getDataLandPlotData());

        return data.map(DataLandPlotType::getFIASLandPlotFiasFullCode).orElse("");
    }

    public String getFiasLandPlot() {
        Optional<DataLandPlotType> data = ofNullable(request.getDataLandPlotData());

        return data.map(DataLandPlotType::getFIASLandPlot).orElse("");
    }

    public String getDocumentName() {
        return Optional.ofNullable(request)
                       .map(RequestType::getDocuments)
                       .map(DocumentsType::getDecisionDocumentsBlock)
                       .map(docInfoTypes -> docInfoTypes.stream()
                                                        .map(DocInfoType::getName)
                                                        .filter(Objects::nonNull)
                                                        .collect(Collectors.joining(", ")))
                       .orElse("");
    }

    public String getPhoneNumber() {
        Optional<RecipientPersonalDataType> personalData = ofNullable(request.getRecipientPersonalData());
        Optional<LegalDataType> legalData = ofNullable(request.getLegalData());

        return personalData.map(RecipientPersonalDataType::getPhone)
                           .orElse(legalData.map(LegalDataType::getOrgPhone).orElse(""));
    }

    public String getEmail() {
        Optional<RecipientPersonalDataType> personalData = ofNullable(request.getRecipientPersonalData());
        Optional<LegalDataType> legalData = ofNullable(request.getLegalData());

        return personalData.map(RecipientPersonalDataType::getEmail)
                           .orElse(legalData.map(LegalDataType::getOrgEmail).orElse(""));
    }

    public String getGPZUInformationIssuer() {
        Optional<GPZUInformationType> gpzuInformation = ofNullable(request.getGPZUInformation());

        return gpzuInformation.map(GPZUInformationType::getIssuer).orElse("");
    }

    public String getGPZUInformationNumber() {
        Optional<GPZUInformationType> gpzuInformation = ofNullable(request.getGPZUInformation());

        return gpzuInformation.map(GPZUInformationType::getNumber).orElse("");
    }

    public String getGPZUInformationDate() {
        Optional<GPZUInformationType> gpzuInformation = ofNullable(request.getGPZUInformation());

        return gpzuInformation.map(GPZUInformationType::getDate).orElse("");
    }

    public String getCurrentVersionData() {
        return request.getCorrectingData().getCorrectingDataBlock().stream()
                      .map(CorrectingDataTextType::getCurrentVersionData)
                      .collect(Collectors.joining("; "));
    }

    public String getNewVersionData() {
        return request.getCorrectingData().getCorrectingDataBlock().stream()
                      .map(CorrectingDataTextType::getNewVersionData)
                      .collect(Collectors.joining("; "));
    }

    public boolean isIsPaperDocumentRequired() {
        return request.getMethodGettingResults().isIsPaperDocumentRequired();
    }

    public Byte getMethodGettingResults() {
        return request.getMethodGettingResults().getMethodGettingResults();
    }
}
