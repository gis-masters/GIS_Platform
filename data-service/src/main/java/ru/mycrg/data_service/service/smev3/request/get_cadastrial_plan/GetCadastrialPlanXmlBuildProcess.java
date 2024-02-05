package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.smev3.GetCadastrialPlanDto;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.*;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcess;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;

import java.util.UUID;

import static ru.mycrg.data_service.service.smev3.model.SmevRequestConst.CRIMEA_REGION;


public class GetCadastrialPlanXmlBuildProcess extends AXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(GetCadastrialPlanXmlBuildProcess.class);

    public GetCadastrialPlanXmlBuildProcess(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public BuildRequestAndSources<Request> run(@NotNull GetCadastrialPlanDto dto) {
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
            requestDescription.setFileName(dto.getRequestFilename());
            attachment.setRequestDescription(requestDescription);

            TValidatedStructuredAttachmentFormat statement = new TValidatedStructuredAttachmentFormat();
            statement.setIsUnstructuredFormat(false);
            statement.setIsZippedPacket(true);
            statement.setFileName(dto.getAppFilename());
            attachment.getStatement().add(statement);

            TStructuredAttachmentFormat appSig = new TStructuredAttachmentFormat();
            appSig.setIsUnstructuredFormat(true);
            appSig.setIsZippedPacket(true);
            appSig.setFileName(dto.getAppFilename() + ".sig");
            attachment.getFile().add(appSig);

            TStructuredAttachmentFormat requestSig = new TStructuredAttachmentFormat();
            requestSig.setIsUnstructuredFormat(true);
            requestSig.setIsZippedPacket(true);
            requestSig.setFileName(dto.getRequestFilename() + ".sig");
            attachment.getFile().add(requestSig);

            TStructuredAttachmentFormat passport = new TStructuredAttachmentFormat();
            passport.setIsUnstructuredFormat(true);
            passport.setIsZippedPacket(true);
            passport.setFileName(dto.getPassportFilename());
            attachment.getFile().add(passport);

            TStructuredAttachmentFormat passportSig = new TStructuredAttachmentFormat();
            passportSig.setIsUnstructuredFormat(true);
            passportSig.setIsZippedPacket(true);
            passportSig.setFileName(dto.getPassportFilename() + ".sig");
            attachment.getFile().add(passportSig);

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }
}
