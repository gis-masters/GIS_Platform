package ru.mycrg.data_service.service.smev3.request;

import org.apache.commons.lang3.NotImplementedException;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ResourceLoader;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.no_context_transaction.NoContextTransaction;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.model.XmlValidationResult;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import javax.xml.XMLConstants;
import javax.xml.bind.JAXBException;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public abstract class RequestProcessor {
    private static final Logger log = LoggerFactory.getLogger(RequestProcessor.class);
    private static final SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
    private static final Base64.Encoder base64Encoder = Base64.getEncoder();

    // общие бины
    private final BaseDao baseDao;
    private final SmevMessageSenderService messageService;
    private final ISchemaService schemaService;
    private final SmevOutgoingAttachmentService attachmentService;
    private final ResourceLoader resourceLoader;

    // параметры  СМЭВ обмена
    private final Smev3Config smev3Config;

    // Классы уникальные под каждый запрос
    private final Mnemonic mnemonic;
    private final XmlMarshaller marshaller;
    private final Schema schema;

    public RequestProcessor(Mnemonic mnemonic,
                            SmevMessageSenderService messageService,
                            BaseDao baseDao,
                            ISchemaService schemaService,
                            SmevOutgoingAttachmentService attachmentService,
                            ResourceLoader resourceLoader,
                            Smev3Config smev3Config) {
        this.messageService = messageService;
        this.mnemonic = mnemonic;
        this.baseDao = baseDao;
        this.schemaService = schemaService;
        this.attachmentService = attachmentService;
        this.resourceLoader = resourceLoader;
        this.smev3Config = smev3Config;
        this.marshaller = new XmlMarshaller(mnemonic.getPrefixMapper());
        this.schema = loadSchema(mnemonic.getSchemaPath());
    }

    public BaseDao getBaseDao() {
        return baseDao;
    }

    public ISchemaService getSchemaService() {
        return schemaService;
    }

    public SmevOutgoingAttachmentService getAttachmentService() {
        return attachmentService;
    }

    public Mnemonic mnemonicEnum() {
        return mnemonic;
    }

    public XmlMarshaller xmlMarshaller() {
        return marshaller;
    }

    public Smev3Config getSmev3Config() {
        return smev3Config;
    }

    public Schema getSchema() {
        return schema;
    }

    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        throw new NotImplementedException("not implemented");
    }

    @NoContextTransaction(dbProperty = "crg-options.integration.smev3.targetDb")
    public XmlBuildMeta sendRequest(@NotNull ISmevRequestDto dto) {
        log.info("SMEV3 | {}  dto {}", mnemonicEnum(), dto);
        try {
            var xmlMeta = buildRequest(dto);

            log.info("Request is valid. Try send to SMEV. Client ID: {}", xmlMeta.getClientId());
            messageService.sendMessage(xmlMeta, dto.sendToSmev(), mnemonic.getSystem());

            return xmlMeta;
        } catch (Exception e) {
            if (e instanceof SmevRequestException) {
                throw (SmevRequestException) e;
            }

            log.error("SMEV. push to queue error: {}", e.getMessage());
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }

    protected <T> void validate(XmlBuildMeta meta, T request, Class<T> tClass) {
        log.info("validation: " + request);
        byte[] xmlBytes = null;
        XmlValidationResult validationResult = null;

        try {
            xmlBytes = xmlMarshaller().marshall(request, tClass).getBytes(StandardCharsets.UTF_8);
            schema.newValidator().validate(new StreamSource(new ByteArrayInputStream(xmlBytes)));
        } catch (SAXParseException e) {
            var base64str = new String(base64Encoder.encode(xmlBytes));
            validationResult = new XmlValidationResult(e.getMessage(), e.getLineNumber(), base64str);
        } catch (SAXException | JAXBException | IOException e) {
            validationResult = new XmlValidationResult(e.getMessage(), null, null);
        }

        if (validationResult != null) {
            var message = "validation fail: " + validationResult.getFailMessage();
            log.error(message);
            throw new SmevRequestException(message, meta, validationResult);
        }

        log.info("validation successful!");
    }

    private Schema loadSchema(String schemaPath) {
        try {
            if (resourceLoader == null) return null;
            var xmlUrl = resourceLoader.getResource("classpath:" + schemaPath).getURL();
            return schemaFactory.newSchema(xmlUrl);
        } catch (SAXException | IOException e) {
            var message = "load schema fail: " + e.getMessage();
            log.info(message);
            throw new DataServiceException(message);
        }
    }

    protected abstract XmlBuildMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception;
}
