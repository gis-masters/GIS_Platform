package ru.mycrg.wrapper.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import ru.mycrg.wrapper.config.FizProperties;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.io.File.separator;

@Service
public class FileService {

    private static final Logger log = LoggerFactory.getLogger(FileService.class);

    private final Path gmlStoragePath;

    public FileService(FizProperties properties) {
        this.gmlStoragePath = Paths.get(properties.getGmlStoragePath())
                .toAbsolutePath()
                .normalize();
    }

    /**
     * Сохраняем xml document.
     *
     * @param document Сгенерированный xml
     * @param fileName Название файла
     * @return Путь к сохраненному файлу
     */
    public String save(Document document, String fileName) throws TransformerException {
        log.debug("Save {} to file", fileName);

        DOMSource source = new DOMSource(document);

        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        StreamResult result = new StreamResult(gmlStoragePath + separator + fileName);
        transformer.transform(source, result);

        File file = new File(gmlStoragePath + separator + fileName);
        if (file.exists() && !file.isDirectory()) {
            return file.getAbsolutePath();
        }

        return "";
    }

}
