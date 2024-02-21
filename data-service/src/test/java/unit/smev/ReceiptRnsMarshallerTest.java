package unit.smev;

import org.junit.Test;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.receipt_rns_1_0_9.QueryResult;
import ru.mycrg.data_service.receipt_rns_1_0_9.Request;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestXmlProcess;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsResponseXmlProcess;
import ru.mycrg.data_service.util.xml.XmlMapper;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static ru.mycrg.data_service.fields.FieldsEisZs.*;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
public class ReceiptRnsMarshallerTest extends AMarshallerTest {
    private final XmlMarshaller marshaller = new XmlMarshaller(Mnemonic.RECEIPT_RNS_1_0_9.getPrefixMapper());

    @Test
    public void request() throws Exception {
        var smev3Config = new Smev3Config();
        smev3Config.setSystemMnemonic("mnemonic");

        var processor = new ReceiptRnsRequestService(smev3Config, null, null);

        var dto = new ReceiptRnsRequestDto();
        dto.setConstPermitDateFrom(LocalDate.of(2022, 1, 1));
        dto.setConstPermitDateTo(LocalDate.of(2022, 1, 1));

        var meta = new ReceiptRnsRequestXmlProcess(processor).run(dto);

        // to xml
        var requestXmlStrong = marshaller.marshall(meta.getRequest(), Request.class);

        // to object
        var requestObject = marshaller.unmarshall(requestXmlStrong, Request.class);

        var receiptListConstruction = requestObject.getReceiptListConstruction();

        assertEquals(dto.getConstPermitDateFrom(), XmlMapper.mapLocalDate(receiptListConstruction.getConstPermitDateFrom()));
        assertEquals(dto.getConstPermitDateTo(), XmlMapper.mapLocalDate(receiptListConstruction.getConstPermitDateTo()));
    }

    @Test
    public void response_ResponseConstruction() throws Exception {
        var fileContent = readFile("receipt_rns_1_0_9/response_construction.xml");
        var queryResult = marshaller.unmarshall(fileContent, QueryResult.class);

        assertNotNull(queryResult);

        // messageType
        var messageType = SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
        assertEquals(SmevMessageType.PRIMARY, messageType);

        var responseType = queryResult
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        var content = new ReceiptRnsResponseXmlProcess()
                .processOne(responseType.getResponseConstruction())
                .getContent();

        // ChangesConstPermit
        var changesConstPermit = responseType
                .getResponseConstruction()
                .getChangesConstPermit();

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

        assertNotNull(queryResult);

    }


    @Test
    public void response_ResponseConstructionList() throws Exception {
        var fileContent = readFile("receipt_rns_1_0_9/response_list_construction.xml");
        var queryResult = marshaller.unmarshall(fileContent, QueryResult.class);

        // messageType
        var messageType = SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
        assertEquals(SmevMessageType.PRIMARY, messageType);

        var response = queryResult
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        // size
        assertEquals(70, response.getResponseListConstruction().size());
    }

    @Test
    public void responseReject() throws Exception {
        var fileContent = readFile("receipt_rns_1_0_9/response_reject.xml");
        var queryResult = marshaller.unmarshall(fileContent, QueryResult.class);

        var smevMeta = queryResult.getSmevMetadata();
        assertEquals("549c1cbd-8e0d-11ee-bd2f-0242ac120005", smevMeta.getMessageId());
        assertEquals("18434900-f30b-48ea-90e0-9e2ef3ae40b5", smevMeta.getTransactionCode());
        assertEquals("809abbdc-8e0c-11ee-a85d-b2f0d27b6b0e", smevMeta.getOriginalMessageID());
        assertEquals("777002", smevMeta.getSender());
        assertEquals("U629301", smevMeta.getRecipient());

        var message = queryResult.getMessage();
        assertEquals("RejectMessage", message.getMessageType());
        assertEquals("RejectMessage", message.getMessageType());
    }
}
