package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.GetCadastrialPlanDto;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.*;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rnv_1_0_8.QueryResult;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class GetCadastrialPlanRequestService extends RequestProcessor {
    private final Logger log = LoggerFactory.getLogger(GetCadastrialPlanRequestService.class);

    public GetCadastrialPlanRequestService(Smev3Config smev3Config,
                                           ResourceLoader resourceLoader,
                                           SmevMessageSenderService messageService) {
        super(
                Mnemonic.GET_CADASTRIAL_PLAN_1_1_2,
                messageService,
                null,
                null,
                null,
                resourceLoader,
                smev3Config
        );
    }

    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        try {
            //TODO тут ошибка, так как импорт некорректного класса
            var queryResult = xmlMarshaller()
                    .unmarshall(messageBody, QueryResult.class);

            var XmlBuildMeta = new XmlBuildMeta(
                    mnemonicEnum(),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getClientId()),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getReplyToClientId()),
                    messageBody,
                    JsonConverter.toJsonNode(queryResult),
                    null,
                    null
            );
            String status;
            String message;

            if (queryResult.getMessage().getMessageType().equals("RejectMessage")) {
                status = queryResult.getMessage().getResponseContent().getRejects().get(0).getCode();
                message = queryResult.getMessage().getResponseContent().getRejects().get(0).getDescription();
            } else {
                status = queryResult.getMessage().getResponseContent().getStatus().getCode();
                message = queryResult.getMessage().getResponseContent().getStatus().getDescription();
            }

            return new ProcessAdapterMessageResult()
                    .setXmlBuildMeta(XmlBuildMeta)
                    .setStatus(status)
                    .setMessage(message);
        } catch (Exception e) {
            log.error("Process adapter message error: {}", e.getMessage());
            throw new SmevRequestException("process adapter message error :" + e.getMessage());
        }
    }

    public void validateCadastrialNumber(String number){
        String cadastrialNumberRegex = "\\d{2}:\\d{2}:\\d{6}";
        Pattern pattern = Pattern.compile(cadastrialNumberRegex);
        Matcher matcher = pattern.matcher(number);

        if (!matcher.matches()) {
            log.error("Invalid cadastrial number: {}", number);
            throw new SmevRequestException("Invalid cadastrial number: " + number);
        }
    }

    @Override
    protected XmlBuildMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        var getCadastrialPlanDto = (GetCadastrialPlanDto) dto;
        var buildRequest = new GetCadastrialPlanXmlBuildProcess(this).run();
        var clientMessage = clientMessage(buildRequest.getRequest(), getCadastrialPlanDto.getArchiveFilename());
        var meta = new XmlBuildMeta(
                mnemonicEnum(),
                UUID.fromString(clientMessage.getRequestMessage().getRequestMetadata().getClientId()),
                null,
                xmlMarshaller().marshall(clientMessage, ClientMessage.class),
                JsonConverter.toJsonNode(clientMessage),
                buildRequest.getSourcesJson(),
                buildRequest.getAttachmentsJson()
        );
        validate(meta, buildRequest.getRequest(), Request.class);

        return meta;
    }

    private ClientMessage clientMessage(Request request, String archiveFilename) {
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
        requestMetadataType.setClientId(UUID.randomUUID().toString());
        RequestMessageType requestMessageType = new RequestMessageType();
        requestMessageType.setRequestMetadata(requestMetadataType);
        requestMessageType.setRequestContent(requestContentType);
        clientMessage.setItSystem(getSmev3Config().getSystemMnemonic());
        clientMessage.setRequestMessage(requestMessageType);

        return clientMessage;
    }
}
