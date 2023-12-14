package ru.mycrg.data_service.service.smev3.get_cadastrial_plan;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.AttachmentHeaderList;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.AttachmentHeaderType;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.AttachmentRequestType;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.ClientMessage;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.Content;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.MessagePrimaryContent;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.Request;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.RequestContentType;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.RequestMessageType;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.RequestMetadataType;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.SenderTypes;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.TStructuredAttachmentFormat;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.TValidatedStructuredAttachmentFormat;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.support_classes.XmlMarshaller;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;


public class GetCadastrialPlanXmlBuildProcess {

    private final Logger log = LoggerFactory.getLogger(GetCadastrialPlanXmlBuildProcess.class);
    private static final String MNEMONIC = "get-cadastrial-plan";
    private static final String MNEMONIC_VERSION = "1.1.2";
    private final XmlMarshaller marshaller = new XmlMarshaller(namespacePrefixMapper);
    private final Smev3Config smev3Config;
    private UUID clientId;
    private ClientMessage xmlObject;
    private String xmlText;

    public GetCadastrialPlanXmlBuildProcess(Smev3Config smev3Config) {
        this.smev3Config = smev3Config;
    }

    public XmlBuildMeta run(@NotNull String requestFilename,
                            @NotNull String appFilename,
                            @NotNull String passportFilename,
                            @NotNull String archiveFilename) {
        this.clientId = UUID.randomUUID();

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

            ClientMessage clientMessage = new ClientMessage();
            MessagePrimaryContent messagePrimaryContent = new MessagePrimaryContent();
            messagePrimaryContent.setRequest(request);
            Content content = new Content();
            AttachmentHeaderList attachmentHeaderList = new AttachmentHeaderList();
            AttachmentHeaderType attachmentHeaderType = new AttachmentHeaderType();
            attachmentHeaderType.setFilePath(archiveFilename);
            attachmentHeaderList.getAttachmentHeader().add(attachmentHeaderType);
            content.setAttachmentHeaderList(attachmentHeaderList);
            content.setMessagePrimaryContent(messagePrimaryContent);
            RequestContentType requestContentType = new RequestContentType();
            requestContentType.setContent(content);
            RequestMetadataType requestMetadataType = new RequestMetadataType();
            requestMetadataType.setClientId(clientId.toString());
            RequestMessageType requestMessageType = new RequestMessageType();
            requestMessageType.setRequestMetadata(requestMetadataType);
            requestMessageType.setRequestContent(requestContentType);
            clientMessage.setItSystem(smev3Config.getMnemonicIS());
            clientMessage.setRequestMessage(requestMessageType);

            xmlObject = clientMessage;
            xmlText = marshaller.marshall(clientMessage, ClientMessage.class);

            log.debug("SMEV3. request: {}", xmlText);

            return new XmlBuildMeta(
                    MNEMONIC,
                    MNEMONIC_VERSION,
                    clientId,
                    null,
                    JsonConverter.toJsonNode(xmlObject),
                    xmlText,
                    null,
                    null
            );
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }

    public static final NamespacePrefixMapper namespacePrefixMapper = new NamespacePrefixMapper() {
        @Override
        public String getPreferredPrefix(String urn, String s1, boolean b) {
            if ("urn://x-artefacts-rosreestr-gov-ru/virtual-services/egrn-statement/1.1.2".equals(urn)) {
                return "req";
            }
            return "typ";
        }
    };
}
