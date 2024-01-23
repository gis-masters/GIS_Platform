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
import javax.xml.bind.JAXBException;
import javax.xml.bind.MarshalException;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class RequestProcessor {
    private static final Logger log = LoggerFactory.getLogger(RequestProcessor.class);
    private static final SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
    private final MnemonicEnum mnemonicEnum;
    private final ResourceLoader resourceLoader;
    private final XmlMarshaller marshaller;
    private final Smev3Config smev3Config;
    private final Schema schema;

    public RequestProcessor(MnemonicEnum mnemonicEnum,
                            ResourceLoader resourceLoader,
                            Smev3Config smev3Config) {
        this.mnemonicEnum = mnemonicEnum;
        this.resourceLoader = resourceLoader;
        this.smev3Config = smev3Config;
        this.marshaller = new XmlMarshaller(mnemonicEnum.getPrefixMapper());
        this.schema = loadSchema(mnemonicEnum.getSchemaPath());
    }

    public MnemonicEnum mnemonicEnum() {
        return mnemonicEnum;
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

    protected <T> String validate(T request, Class<T> tClass) {
        log.info("validation: " + request);
        try {
            var str = xmlMarshaller().marshall(request, tClass);

            schema
                    .newValidator()
                    .validate(new StreamSource(new ByteArrayInputStream(str.getBytes(StandardCharsets.UTF_8))));
            log.info("validation successful!");

            return null;
        } catch (SAXException | IOException | JAXBException e) {
            log.error("validation fail: " + e.getMessage());
            return e.toString();
        }
    }

    private Schema loadSchema(String schemaPath) {
        try {
            if (resourceLoader == null) return null;
            var xmlUrl = resourceLoader.getResource("classpath:" + schemaPath).getURL();
            return schemaFactory.newSchema(xmlUrl);
        } catch (SAXException | IOException e) {
            throw new RuntimeException(e);
        }
    }
}
