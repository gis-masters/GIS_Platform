package ru.mycrg.data_service.kpt_import.reader;

import ru.mycrg.data_service.kpt_import.model.KptElement;

import javax.xml.stream.XMLStreamReader;
import java.util.List;

/**
 * Обработчик xml элемента КПТ
 */
public interface KptXmlElementReader<T extends KptElement> {

    List<T> read(XMLStreamReader reader);

    String getXmlTag();
}
