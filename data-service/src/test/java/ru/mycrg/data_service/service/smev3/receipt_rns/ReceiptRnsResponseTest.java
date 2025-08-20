package ru.mycrg.data_service.service.smev3.receipt_rns;

import org.junit.Test;
import ru.mycrg.data_service.receipt_rns_1_0_9.QueryResult;
import ru.mycrg.data_service.receipt_rns_1_0_9.ResponseConstructionShortInfoType;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessMessageStatus;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsResponseService;
import ru.mycrg.data_service.util.xml.XmlMapper;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service.service.smev3.AProcessorTest;
import ru.mycrg.data_service.service.smev3.DataEisZsServiceMock;

import static org.junit.jupiter.api.Assertions.*;
import static ru.mycrg.data_service.service.smev3.fields.FieldsEisZs.*;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
public class ReceiptRnsResponseTest extends AProcessorTest {
    private final String xmlPath = "receipt_rns_1_0_9";

    @Test
    public void responseConstruction() throws Exception {
        var fileContent = readFile(xmlPath + "/response_construction.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnsResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.SUCCESSFULLY, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNS_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());

        // объект, который будет сохранен в БД
        var content = dataEisZsServiceMock.getContent().get(0);

        // Получаем объект из XML для дальнейшего сравнения
        var responseType = XmlMarshaller
                .unmarshall(fileContent, QueryResult.class)
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        // ChangesConstPermit
        var changesConstPermit = responseType
                .getResponseConstruction()
                .getChangesConstPermit();

        assertEquals(content.get(PROPERTY_IS_RECORD_FULL), true);
        assertEquals(content.get(PROPERTY_PREV_CONST_PERMIT_NUMBER), changesConstPermit.getPrevConstPermitNumber());
        assertEquals(content.get(PROPERTY_PREV_CONST_PERMIT_DATE), XmlMapper.mapLocalDateTime(changesConstPermit.getPrevConstPermitDate()));
        assertEquals(content.get(PROPERTY_REASON_CHANGES_NAME), changesConstPermit.getReasonChanges().get(0).getName());
        assertEquals(content.get(PROPERTY_REASON_CHANGES_CODE), changesConstPermit.getReasonChanges().get(0).getCode());

        // ConstructionType
        var construction = responseType
                .getResponseConstruction()
                .getConstruction();

        // ConstructionType - RecipientInfoType
        var recipientInfo = construction.getRecipientInfo();
        assertEquals(content.get(PROPERTY_RECEPIENT_INFO_ORGANIZATION_NAME), recipientInfo.getOrganizationInfo().getOrganizationName());
        assertEquals(content.get(PROPERTY_RECEPIENT_INFO_EMAIL), recipientInfo.getEmail());
        assertEquals(content.get(PROPERTY_RECIPIENT_INFO_FIAS), recipientInfo.getMailingAddress().getFIAS());
        assertTrue(content.get(PROPERTY_RECIPIENT_INFO_LOCALITY).toString().contains(recipientInfo.getMailingAddress().getLocality().getName()));

        // ConstructionType - IssueOrgan
        var issueOrgan = construction.getIssueOrgan();
        assertEquals(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_ORGANIZATION_NAME), issueOrgan.getOrganizationName());
        assertEquals(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_OGRN), issueOrgan.getOGRN());
        assertEquals(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_INN), issueOrgan.getINN());

        // ConstructionType - IssuePerson
        var issuePerson = construction.getIssuePerson();
        assertEquals(content.get(PROPERTY_ISSUE_PERSON_SURNAME), issuePerson.getSurname());
        assertEquals(content.get(PROPERTY_ISSUE_PERSON_NAME), issuePerson.getName());
        assertEquals(content.get(PROPERTY_ISSUE_PERSON_MIDDLE_NAME), issuePerson.getMiddleName());

        // ObjectInfoType
        var objectInfo = responseType
                .getResponseConstruction()
                .getConstruction()
                .getObjectInfo()
                .get(0);

        assertEquals(content.get(PROPERTY_BUILD_CAPITAL_TYPE_CODE), objectInfo.getBuildCapitalType().getCode());
        assertEquals(content.get(PROPERTY_OBJECT_PURPOSE_FUNCTIONAL_CODE), objectInfo.getObjectPurposeFunctional().getCode());
        assertEquals(content.get(PROPERTY_OBJECT_PURPOSE_CODE), objectInfo.getObjectPurpose().getCode());
        assertEquals(content.get(PROPERTY_OBJECT_KIND_CODE), objectInfo.getObjectKind().getCode());

        // ObjectInfoType - InfoDocDescriptionType
        var infoDocDescription = objectInfo.getInfoDocDescription();

        // ObjectInfoType - InfoDocDescriptionType - standardArchitecturalSolution
        var standardArchitecturalSolution = infoDocDescription.getStandardArchitecturalSolutionDescription().get(0);

        assertEquals(content.get(PROPERTY_SOLUTION_AVAILABILITY), infoDocDescription.getStandardArchitecturalSolutionAvailability().value());
        assertEquals(content.get(PROPERTY_SOLUTION_YEAR), standardArchitecturalSolution.getStandArchSolutionYear());
        assertEquals(content.get(PROPERTY_SOLUTION_OPF_NAME), standardArchitecturalSolution.getOrganDocInfo().getOrganizationOPF().getName());
        assertEquals(content.get(PROPERTY_SOLUTION_ORGAN_INN), standardArchitecturalSolution.getOrganDocInfo().getINN());

        // ObjectInfoType - InfoDocDescriptionType - landCadastral
        assertEquals(content.get(PROPERTY_LAND_PLOT_AVAILABILITY), infoDocDescription.getLandCadastralAvailability().value());

        // ObjectInfoType - InfoDocDescriptionType - projectDocumentation
        var projectDocumentation = infoDocDescription.getProjectDocumentationDescription().get(0);

        assertEquals(content.get(PROPERTY_PROJECT_DOCUMENTATION_AVAILABILITY), infoDocDescription.getProjectDocumentationAvailability().value());
        assertEquals(content.get(PROPERTY_PROJECT_DOCUMENTATION_DOC_CODE), projectDocumentation.getProjectDocCode());
        assertEquals(content.get(PROPERTY_PROJECT_DOCUMENTATION_DOC_DATE), XmlMapper.mapLocalDateTime(projectDocumentation.getDocumentationDate()));
        assertEquals(content.get(PROPERTY_PROJECT_DOCUMENTATION_OPF_NAME), projectDocumentation.getOrganDocInfo().getOrganizationOPF().getName());
        assertEquals(content.get(PROPERTY_PROJECT_DOCUMENTATION_ORGAN_INN), projectDocumentation.getOrganDocInfo().getINN());

        // ObjectInfoType - InfoDocDescriptionType - Demarcation
        var demarcation = infoDocDescription.getDemarcationDescription().get(0);

        assertEquals(content.get(PROPERTY_DEMARCATION_AVAILABILITY), infoDocDescription.getDemarcationAvailability().value());
        assertEquals(content.get(PROPERTY_DEMARCATION_NUMBER), demarcation.getDemarcationNumber());
        assertEquals(content.get(PROPERTY_DEMARCATION_DATE), XmlMapper.mapLocalDateTime(demarcation.getDemarcationDate()));
        assertEquals(content.get(PROPERTY_DEMARCATION_OPF_NAME), demarcation.getOrganDocInfo().getOrganizationOPF().getName());
        assertEquals(content.get(PROPERTY_DEMARCATION_ORGAN_INN), demarcation.getOrganDocInfo().getINN());

        // ObjectInfoType - InfoDocDescriptionType - DevPlanLandPlot
        var devPlanLandPlot = infoDocDescription.getDevPlanLandPlotDescription().get(0);

        assertEquals(content.get(PROPERTY_DEV_LAND_PLOT_AVAILABILITY), infoDocDescription.getDevPlanLandPlotAvailability().value());
        assertEquals(content.get(PROPERTY_DEV_LAND_PLOT_NUMBER), devPlanLandPlot.getDevPlanLandPlotNumber());
        assertEquals(content.get(PROPERTY_DEV_LAND_PLOT_DATE), XmlMapper.mapLocalDateTime(devPlanLandPlot.getDevPlanLandPlotDate()));
        assertEquals(content.get(PROPERTY_DEV_LAND_PLOT_OPF_NAME), devPlanLandPlot.getOrganDocInfo().getOrganizationOPF().getName());
        assertEquals(content.get(PROPERTY_DEV_LAND_PLOT_ORGAN_INN), devPlanLandPlot.getOrganDocInfo().getINN());

        // ObjectInfoType - InfoDocDescriptionType - EcologicalExpertise
        var ecologicalExpertise = infoDocDescription.getEcologicalExpertiseDescription().get(0);

        assertEquals(content.get(PROPERTY_ECOLOGICAL_AVAILABILITY), infoDocDescription.getEcologicalExpertiseAvailability().value());
        assertEquals(content.get(PROPERTY_ECOLOGICAL_EXPERTISE_NUM), ecologicalExpertise.getEcologicalExpertiseNumber());
        assertEquals(content.get(PROPERTY_ECOLOGICAL_EXPERTISE_DATE), XmlMapper.mapLocalDateTime(ecologicalExpertise.getEcologicalExpertiseDate()));
        assertEquals(content.get(PROPERTY_ECOLOGICAL_EXPERTISE_OPF_NAME), ecologicalExpertise.getOrganDocInfo().getOrganizationOPF().getName());
        assertEquals(content.get(PROPERTY_ECOLOGICAL_EXPERTISE_ORGAN_INN), ecologicalExpertise.getOrganDocInfo().getINN());

        // ObjectInfoType - InfoDocDescriptionType - ExpertiseProjectDoc
        var expertiseProjectDoc = infoDocDescription.getExpertiseProjectDocDescription().get(0);

        assertEquals(content.get(PROPERTY_EXPERTISE_PROJECT_DOC_AVAILABILITY), infoDocDescription.getExpertiseProjectDocAvailability().value());
        assertEquals(content.get(PROPERTY_EXPERTISE_PROJECT_DOC_NUM), expertiseProjectDoc.getExpertiseProjectDocNumber());
        assertEquals(content.get(PROPERTY_EXPERTISE_PROJECT_DOC_DATE), XmlMapper.mapLocalDateTime(expertiseProjectDoc.getExpertiseProjectDocDate()));
        assertEquals(content.get(PROPERTY_EXPERTISE_PROJECT_OPF_NAME), expertiseProjectDoc.getOrganDocInfo().getOrganizationOPF().getName());
        assertEquals(content.get(PROPERTY_EXPERTISE_PROJECT_ORGAN_INN), expertiseProjectDoc.getOrganDocInfo().getINN());
        assertEquals(content.get(PROPERTY_EXPERTISE_PROJECT_DOC_TYPE_NAME), expertiseProjectDoc.getProjectDocType().getName());
    }

    @Test
    public void responseConstructionList() throws Exception {
        var fileContent = readFile(xmlPath + "/response_list_construction.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnsResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.SUCCESSFULLY, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNS_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());

        // объект, который будет сохранен в БД
        var records = dataEisZsServiceMock.getContent();

        // size
        assertEquals(70, records.size());

        // Первое сообщение
        var content = records.get(0);
        assertEquals(content.get(PROPERTY_IS_RECORD_FULL), false);
    }

    @Test
    public void responseConstructionList_2() throws Exception {
        var fileContent = readFile(xmlPath + "/response_list_construction_2.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnsResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.SUCCESSFULLY, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNS_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());

        // объект, который будет сохранен в БД
        var records = dataEisZsServiceMock.getContent();

        // Получаем объект из XML для дальнейшего сравнения
        var response = XmlMarshaller
                .unmarshall(fileContent, QueryResult.class)
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        // все имеют ConstPermitNumber
        var constPermitNumberExist = response.getResponseListConstruction()
                .stream()
                .map(ResponseConstructionShortInfoType::getVersionInfo)
                .filter(constructionVersionInfoType -> constructionVersionInfoType.getConstPermitNumber() != null)
                .count();

        assertEquals(80, constPermitNumberExist);

        // size
        assertEquals(80, records.size());

        // ConstPermitID = 76416
        var constPermitID = "76416";

        var contentXml = response.getResponseListConstruction()
                .stream()
                .filter(responseConstructionShortInfoType -> responseConstructionShortInfoType.getVersionInfo().getConstPermitID().equals(constPermitID))
                .findFirst()
                .get()
                .getVersionInfo();

        var content = records
                .stream()
                .filter(iRecord -> iRecord.get(PROPERTY_CONST_PERMIT_ID).equals(constPermitID))
                .findFirst()
                .get();

        assertEquals(false, content.get(PROPERTY_IS_RECORD_FULL));
        assertNotNull(content.get(PROPERTY_CONST_PERMIT_ID));
        assertEquals(content.get(PROPERTY_CONST_PERMIT_ID), contentXml.getConstPermitID());

        assertNotNull(content.get(PROPERTY_CONST_PERMIT_DATE));
        assertEquals(content.get(PROPERTY_CONST_PERMIT_DATE), XmlMapper.mapLocalDateTime(contentXml.getConstPermitDate()));

        assertNotNull(content.get(PROPERTY_CONST_PERMIT_NUMBER));
        assertEquals(content.get(PROPERTY_CONST_PERMIT_NUMBER), contentXml.getConstPermitNumber());

        assertNotNull(content.get(PROPERTY_EXPIRE_DATE));
        assertEquals(content.get(PROPERTY_EXPIRE_DATE), XmlMapper.mapLocalDateTime(contentXml.getExpireDate()));

        // IssueOrgan
        var issueOrgan = contentXml.getIssueOrgan();

        assertNotNull(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_ORGANIZATION_NAME));
        assertEquals(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_ORGANIZATION_NAME), issueOrgan.getOrganizationName());

        assertNotNull(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_OGRN));
        assertEquals(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_OGRN), issueOrgan.getOGRN());

        assertNotNull(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_INN));
        assertEquals(content.get(PROPERTY_CONST_PERMIT_ISSUE_ORGAN_INN), issueOrgan.getINN());

        // RecipientInfo
        var recipientInfo = contentXml.getRecipientInfo().getOrganizationInfo();

        assertNotNull(content.get(PROPERTY_RECEPIENT_INFO_ORGANIZATION_NAME));
        assertEquals(content.get(PROPERTY_RECEPIENT_INFO_ORGANIZATION_NAME), recipientInfo.getOrganizationName());

        assertNotNull(content.get(PROPERTY_RECEPIENT_INFO_OGRN));
        assertEquals(content.get(PROPERTY_RECEPIENT_INFO_OGRN), recipientInfo.getOGRN());

        assertNotNull(content.get(PROPERTY_RECEPIENT_INFO_INN));
        assertEquals(content.get(PROPERTY_RECEPIENT_INFO_INN), recipientInfo.getINN());

        // ObjectShortInfo
        var objectShortInfo = contentXml.getObjectShortInfo()
                .stream()
                .findFirst()
                .get();

        assertNotNull(content.get(PROPERTY_CONST_OBJECT_NAME));
        assertEquals(content.get(PROPERTY_CONST_OBJECT_NAME), objectShortInfo.getObjectName());

        assertNotNull(content.get(PROPERTY_CONST_OBJECT_ID));
        assertEquals(content.get(PROPERTY_CONST_OBJECT_ID), objectShortInfo.getObjectID());

        assertNotNull(content.get(PROPERTY_OBJECT_BUSINESS_ID));
        assertEquals(content.get(PROPERTY_OBJECT_BUSINESS_ID), objectShortInfo.getObjectBusinessID());
    }

    @Test
    public void responseReject() throws Exception {
        var fileContent = readFile(xmlPath + "/response_reject.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnsResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.ERROR_REJECT, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNS_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());
    }

    @Test
    public void responseStatusMessage() throws Exception {
        var fileContent = readFile("technical_messages/status_message_1.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnsResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.ERROR_STATUS, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNS_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());
    }
}
