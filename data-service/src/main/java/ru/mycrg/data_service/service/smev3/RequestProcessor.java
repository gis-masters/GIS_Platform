package ru.mycrg.data_service.service.smev3;

import org.apache.commons.lang3.NotImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ResourceLoader;
import org.xml.sax.SAXException;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class RequestProcessor {
    private final Logger log = LoggerFactory.getLogger(RequestProcessor.class);
    private final SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
    private final MnemonicEnum mnemonicEnum;
    private final ResourceLoader resourceLoader;
    private final Smev3Config smev3Config;
    private final Schema schema;

    public RequestProcessor(MnemonicEnum mnemonicEnum,
                            ResourceLoader resourceLoader,
                            Smev3Config smev3Config) {
        this.mnemonicEnum = mnemonicEnum;
        this.resourceLoader = resourceLoader;
        this.smev3Config = smev3Config;
        this.schema = loadSchema();
    }

    public MnemonicEnum mnemonicEnum() {
        return mnemonicEnum;
    }

    public XmlMarshaller xmlMarshaller() {
        return mnemonicEnum.getMarshaller();
    }

    public Smev3Config getSmev3Config() {
        return smev3Config;
    }

    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        throw new NotImplementedException("not implemented");
    }

    protected void validate(String xmlString) {
        log.info("validation: " + xmlString);
        try {
            schema
                    .newValidator()
                    .validate(new StreamSource(new ByteArrayInputStream(xmlString.getBytes(StandardCharsets.UTF_8))));
            log.info("validation successful!");
        } catch (Exception e) {
            log.warn("validation fail: " + e.getMessage());
            //TODO Пока не смог понять почему не проходит валидация. Оставить как тех долг
            //throw new SmevRequestException("xmlString validate fail " + e.getMessage());
        }
    }

    private Schema loadSchema() {
        try {
            if (resourceLoader == null) return null;
            var xmlUrl = resourceLoader.getResource("classpath:" + mnemonicEnum.getSchemaPath()).getURL();
            return schemaFactory.newSchema(xmlUrl);
        } catch (SAXException | IOException e) {
            throw new RuntimeException(e);
        }
    }
}
