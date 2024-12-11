package ru.mycrg.data_service.service.smev3.request.accept_rns;

import ru.mycrg.data_service.accept_rns_1_0_3.*;
import ru.mycrg.data_service.service.smev3.request.IDocumentDataProvider;

import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

public class RnsDocumentDataProvider implements IDocumentDataProvider {

    @Override
    public <T> String getFirstName(T requestType) {
        RequestType request = (RequestType) requestType;

        return getPersonalData(request, RecipientPersonalDataType::getFirstname,
                               DelegatePersonalDataType::getFirstname);
    }

    @Override
    public <T> String getLastName(T requestType) {
        RequestType request = (RequestType) requestType;

        return getPersonalData(request, RecipientPersonalDataType::getLastname, DelegatePersonalDataType::getLastname);
    }

    @Override
    public <T> String getMiddleName(T requestType) {
        RequestType request = (RequestType) requestType;

        return getPersonalData(request, RecipientPersonalDataType::getMiddlename,
                               DelegatePersonalDataType::getMiddlename);
    }

    @Override
    public <T> String getInn(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getBusinessmanData())
                .map(BusinessmanDataType::getOrgInn)
                .orElse(ofNullable(request.getDelegateBusinessmanData())
                                .map(DelegateBusinessmanDataType::getOrgInn)
                                .orElse(""));
    }

    @Override
    public <T> String getOgrnip(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getBusinessmanData())
                .map(BusinessmanDataType::getOrgOgrn)
                .orElse(ofNullable(request.getDelegateBusinessmanData())
                                .map(DelegateBusinessmanDataType::getOrgOgrn)
                                .orElse(""));
    }

    @Override
    public <T> String getRegAddress(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getRecipientPersonalData())
                .map(RecipientPersonalDataType::getRegAddress)
                .orElse("");
    }

    @Override
    public <T> String getFactAddress(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getRecipientPersonalData())
                .map(RecipientPersonalDataType::getFactAddress)
                .orElse("");
    }

    @Override
    public <T> String getOrgFullName(T requestType) {
        RequestType request = (RequestType) requestType;

        return getOrgData(request, LegalDataType::getOrgFullname, DelegateLegalDataType::getOrgFullname);
    }

    @Override
    public <T> String getOrgInn(T requestType) {
        RequestType request = (RequestType) requestType;

        return getOrgData(request, LegalDataType::getOrgInn, DelegateLegalDataType::getOrgInn);
    }

    @Override
    public <T> String getOrgOgrn(T requestType) {
        RequestType request = (RequestType) requestType;

        return getOrgData(request, LegalDataType::getOrgOgrn, DelegateLegalDataType::getOrgOgrn);
    }

    @Override
    public <T> String getOrgRegAddress(T requestType) {
        RequestType request = (RequestType) requestType;

        return getOrgData(request, LegalDataType::getRegAddress, DelegateLegalDataType::getRegAddress);
    }

    @Override
    public <T> String getOrgPostAddress(T requestType) {
        RequestType request = (RequestType) requestType;

        return getOrgData(request, LegalDataType::getPostAddress, DelegateLegalDataType::getPostAddress);
    }

    @Override
    public <T> String getOrgEmail(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getLegalData()).map(LegalDataType::getOrgEmail)
                                                 .orElse("");
    }

    @Override
    public <T> String getOrgPhone(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getLegalData()).map(LegalDataType::getOrgPhone)
                                                 .orElse("");
    }

    @Override
    public <T> String getObjectName(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getObjectData())
                .map(ObjectDataType::getObjectName)
                .orElse("");
    }

    @Override
    public <T> String getLandPlotCadastralNumber(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getLandPlotData())
                .map(data -> data.getLandPlotCadastralNumberBlock()
                                 .stream()
                                 .flatMap(blockType -> blockType
                                         .getLandPlotCadastralNumber()
                                         .stream())
                                 .collect(Collectors.joining(", ")))
                .orElse("");
    }

    @Override
    public <T> String getFullfio(T requestType) {
        RequestType request = (RequestType) requestType;

        return getPersonalData(request, RecipientPersonalDataType::getFullfio,
                               DelegatePersonalDataType::getFullfio);
    }

    @Override
    public <T> String getDateBirth(T requestType) {
        RequestType request = (RequestType) requestType;

        return getPersonalData(request, RecipientPersonalDataType::getDateBirth,
                               DelegatePersonalDataType::getDateBirth);
    }

    @Override
    public <T> String getDocSeries(T requestType) {
        RequestType request = (RequestType) requestType;
        Optional<RecipientPersonalDataType> oRecipientPersonalData = ofNullable(request.getRecipientPersonalData());
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(request.getDelegatePersonalData());

        return oRecipientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                     .map(DocumentPersonalType::getDocseries)
                                     .orElse(oDelegatePersonalData
                                                     .map(DelegatePersonalDataType::getDocumentPersonal)
                                                     .map(DocumentPersonalType::getDocseries)
                                                     .orElse(""));
    }

    @Override
    public <T> String getNameDoc(T requestType) {
        RequestType request = (RequestType) requestType;
        Optional<RecipientPersonalDataType> oRecipientPersonalData = ofNullable(request.getRecipientPersonalData());
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(request.getDelegatePersonalData());

        return oRecipientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                     .map(DocumentPersonalType::getNameDoc)
                                     .orElse(oDelegatePersonalData
                                                     .map(DelegatePersonalDataType::getDocumentPersonal)
                                                     .map(DocumentPersonalType::getNameDoc)
                                                     .orElse(""));
    }

    @Override
    public <T> String getDocNumber(T requestType) {
        RequestType request = (RequestType) requestType;
        Optional<RecipientPersonalDataType> oRecipientPersonalData = ofNullable(request.getRecipientPersonalData());
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(request.getDelegatePersonalData());

        return oRecipientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                     .map(DocumentPersonalType::getDocnumber)
                                     .orElse(oDelegatePersonalData
                                                     .map(DelegatePersonalDataType::getDocumentPersonal)
                                                     .map(DocumentPersonalType::getDocnumber)
                                                     .orElse(""));
    }

    @Override
    public <T> String getIssueOrg(T requestType) {
        RequestType request = (RequestType) requestType;
        Optional<RecipientPersonalDataType> oRecipientPersonalData = ofNullable(request.getRecipientPersonalData());
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(request.getDelegatePersonalData());

        return oRecipientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                     .map(DocumentPersonalType::getIssueorg)
                                     .orElse(oDelegatePersonalData
                                                     .map(DelegatePersonalDataType::getDocumentPersonal)
                                                     .map(DocumentPersonalType::getIssueorg)
                                                     .orElse(""));
    }

    @Override
    public <T> String getIssueDate(T requestType) {
        RequestType request = (RequestType) requestType;
        Optional<RecipientPersonalDataType> oRecipientPersonalData = ofNullable(request.getRecipientPersonalData());
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(request.getDelegatePersonalData());

        return oRecipientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                     .map(DocumentPersonalType::getIssuedate)
                                     .orElse(oDelegatePersonalData
                                                     .map(DelegatePersonalDataType::getDocumentPersonal)
                                                     .map(DocumentPersonalType::getIssuedate)
                                                     .orElse(""));
    }

    @Override
    public <T> String getPhone(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getRecipientPersonalData()).map(RecipientPersonalDataType::getPhone)
                                                             .orElse("");
    }

    @Override
    public <T> String getEmail(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getRecipientPersonalData()).map(RecipientPersonalDataType::getEmail)
                                                             .orElse("");
    }

    @Override
    public <T> String getPermitNumber(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getConstructionPermitsData())
                .map(ConstructionPermitsDataType::getNumber).orElse("");
    }

    @Override
    public <T> String getPermitDate(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getConstructionPermitsData())
                .map(ConstructionPermitsDataType::getDate).orElse("");
    }

    @Override
    public <T> String getCurrentVersion(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getCorrectingData())
                .flatMap(data -> data.getCorrectingDataBlock()
                                     .stream().findFirst())
                .map(CorrectingDataTextType::getCurrentVersionData).orElse("");
    }

    @Override
    public <T> String getNewVersion(T requestType) {
        RequestType request = (RequestType) requestType;

        return ofNullable(request.getCorrectingData())
                .flatMap(data -> data.getCorrectingDataBlock()
                                     .stream().findFirst())
                .map(CorrectingDataTextType::getNewVersionData).orElse("");
    }

    private String getPersonalData(RequestType request,
                                   Function<RecipientPersonalDataType, String> recipientPersonalDataType,
                                   Function<DelegatePersonalDataType, String> delegatePersonalDataType) {
        Optional<RecipientPersonalDataType> oRecipientPersonalData = Optional.ofNullable(
                request.getRecipientPersonalData());
        Optional<DelegatePersonalDataType> oDelegatePersonalData = Optional.ofNullable(
                request.getDelegatePersonalData());

        return oRecipientPersonalData.map(recipientPersonalDataType)
                                     .orElse(oDelegatePersonalData.map(delegatePersonalDataType)
                                                                  .orElse(""));
    }

    private String getOrgData(RequestType request,
                              Function<LegalDataType, String> legalDataType,
                              Function<DelegateLegalDataType, String> delegateLegalDataType) {
        Optional<LegalDataType> oLegalData = Optional.ofNullable(request.getLegalData());
        Optional<DelegateLegalDataType> oDelegateLegalData = Optional.ofNullable(
                request.getDelegateLegalData());

        return oLegalData.map(legalDataType)
                         .orElse(oDelegateLegalData.map(delegateLegalDataType)
                                                   .orElse(""));
    }
}
