package ru.mycrg.data_service.service.parsers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.parsers.exceptions.XmlSchemeValidationException;

import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.SchemaFactory;
import java.io.IOException;

import static javax.xml.validation.SchemaFactory.newInstance;

@Component
public class XmlValidator {

    private final Logger log = LoggerFactory.getLogger(XmlValidator.class);

    private final SchemaFactory factory;
    private final ResourceLoader resourceLoader;

    public XmlValidator(ResourceLoader resourceLoader) {
        this.factory = newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
        this.resourceLoader = resourceLoader;
    }

    // TODO: Разобраться/Удалить?
    public void checkXmlByXsd(MultipartFile xml) {
        try {
            final Resource resource = resourceLoader.getResource("classpath:xsd_mp_v6/MP_v06.xsd");
            if (!resource.exists()) {
                log.error("Не найдена XSD схема");

                throw new DataServiceException("Xsd file for validation are not found. Validation failed");
            }

            factory.newSchema(resource.getURL())
                   .newValidator()
                   .validate(new StreamSource(xml.getInputStream()));
        } catch (SAXException | IOException e) {
            String msg = "Xml file is not valid." + e.getMessage();
            log.error(msg);

            throw new XmlSchemeValidationException(msg);
        }
    }
}
