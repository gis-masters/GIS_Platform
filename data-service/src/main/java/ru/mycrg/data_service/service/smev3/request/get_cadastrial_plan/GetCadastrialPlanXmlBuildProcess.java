package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.*;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.RequestProcessor;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcess;

import java.util.UUID;


public class GetCadastrialPlanXmlBuildProcess extends AXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(GetCadastrialPlanXmlBuildProcess.class);

    public GetCadastrialPlanXmlBuildProcess(RequestProcessor requestProcessor) {
        super(requestProcessor, null, null);
    }

    public BuildRequestAndSources<Request> run(@NotNull String requestFilename,
                                               @NotNull String appFilename,
                                               @NotNull String passportFilename) {
        try {
            Request request = new Request();
            request.setRegion("91");
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
            statement.setFileName(appFilename);
            attachment.getStatement().add(statement);

            TStructuredAttachmentFormat appSig = new TStructuredAttachmentFormat();
            appSig.setIsUnstructuredFormat(true);
            appSig.setIsZippedPacket(true);
            appSig.setFileName(appFilename + ".sig");
            attachment.getFile().add(appSig);

            TStructuredAttachmentFormat requestSig = new TStructuredAttachmentFormat();
            requestSig.setIsUnstructuredFormat(true);
            requestSig.setIsZippedPacket(true);
            requestSig.setFileName(requestFilename + ".sig");
            attachment.getFile().add(requestSig);

            TStructuredAttachmentFormat passport = new TStructuredAttachmentFormat();
            passport.setIsUnstructuredFormat(true);
            passport.setIsZippedPacket(true);
            passport.setFileName(passportFilename);
            attachment.getFile().add(passport);

            TStructuredAttachmentFormat passportSig = new TStructuredAttachmentFormat();
            passportSig.setIsUnstructuredFormat(true);
            passportSig.setIsZippedPacket(true);
            passportSig.setFileName(passportFilename + ".sig");
            attachment.getFile().add(passportSig);

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }
}
