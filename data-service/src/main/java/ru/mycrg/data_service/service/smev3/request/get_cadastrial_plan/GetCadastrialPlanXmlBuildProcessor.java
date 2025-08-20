package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.*;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcessor;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;

import java.util.UUID;

import static ru.mycrg.data_service.service.smev3.model.SmevRequestConst.CRIMEA_REGION;


public class GetCadastrialPlanXmlBuildProcessor extends AXmlBuildProcessor {

    public GetCadastrialPlanXmlBuildProcessor(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public RequestAndSources<Request> run() {

        String requestFilename = "request.xml";
        String statementFilename = "statement.xml";
        try {
            Request request = new Request();
            request.setRegion(CRIMEA_REGION);
            request.setExternalNumber(UUID.randomUUID().toString());
            request.setSenderType(SenderTypes.VEDOMSTVO);
            request.setActionCode("659511111116");
            AttachmentRequestType attachment = new AttachmentRequestType();
            attachment.setIsMTOMAttachmentContent(true);
            request.setAttachment(attachment);

            TValidatedStructuredAttachmentFormat requestDescription = new TValidatedStructuredAttachmentFormat();
            requestDescription.setIsUnstructuredFormat(false);
            requestDescription.setIsZippedPacket(true);
            requestDescription.setFileName(requestFilename);
            attachment.setRequestDescription(requestDescription);

            TValidatedStructuredAttachmentFormat statement = new TValidatedStructuredAttachmentFormat();
            statement.setIsUnstructuredFormat(false);
            statement.setIsZippedPacket(true);
            statement.setFileName(statementFilename);
            attachment.getStatement().add(statement);

            TStructuredAttachmentFormat statementSig = new TStructuredAttachmentFormat();
            statementSig.setIsUnstructuredFormat(true);
            statementSig.setIsZippedPacket(true);
            statementSig.setFileName(statementFilename + ".sig");
            attachment.getFile().add(statementSig);

            TStructuredAttachmentFormat requestSig = new TStructuredAttachmentFormat();
            requestSig.setIsUnstructuredFormat(true);
            requestSig.setIsZippedPacket(true);
            requestSig.setFileName(requestFilename + ".sig");
            attachment.getFile().add(requestSig);

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }
}
