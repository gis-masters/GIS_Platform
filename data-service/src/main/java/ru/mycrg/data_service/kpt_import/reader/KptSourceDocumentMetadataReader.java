package ru.mycrg.data_service.kpt_import.reader;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.KptSourceDocumentMetadata;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;

@Component
public class KptSourceDocumentMetadataReader {

    private static final String DATE_RECEIVED_REQUEST_TAG = "date_received_request";

    private static final String CADASTRAL_BLOCKS_TAG = "cadastral_blocks";
    private static final String CADASTRAL_BLOCK_TAG = "cadastral_block";
    private static final String CADASTRAL_NUMBER_TAG = "cadastral_number";

    private final XMLInputFactory xmlInputFactory;

    public KptSourceDocumentMetadataReader() {
        this.xmlInputFactory = XMLInputFactory.newFactory();
    }

    public KptSourceDocumentMetadata extract(InputStream inputStream) throws XMLStreamException {
        KptSourceDocumentMetadata metadata = new KptSourceDocumentMetadata();
        XMLStreamReader reader = xmlInputFactory.createXMLStreamReader(inputStream);
        Deque<String> tagsPath = new ArrayDeque<>();

        try {
            while (reader.hasNext() && !metadata.isComplete()) {
                int eventType = reader.next();

                if (eventType == XMLStreamConstants.START_ELEMENT) {
                    String tagName = reader.getLocalName();
                    tagsPath.addLast(tagName);

                    if (metadata.getDateReceivedRequest() == null && DATE_RECEIVED_REQUEST_TAG.equals(tagName)) {
                        metadata.setDateReceivedRequest(reader.getElementText());
                        tagsPath.removeLast();
                    } else if (metadata.getCadBlockNum() == null && isCadastralBlockNumberPath(tagsPath)) {
                        metadata.setCadBlockNum(reader.getElementText());
                        tagsPath.removeLast();
                    }
                } else if (eventType == XMLStreamConstants.END_ELEMENT && !tagsPath.isEmpty()) {
                    tagsPath.removeLast();
                }
            }

            return metadata;
        } finally {
            reader.close();
        }
    }

    private boolean isCadastralBlockNumberPath(Deque<String> tagsPath) {
        Iterator<String> iterator = tagsPath.descendingIterator();

        return hasNextTag(iterator, CADASTRAL_NUMBER_TAG)
                && hasNextTag(iterator, CADASTRAL_BLOCK_TAG)
                && hasNextTag(iterator, CADASTRAL_BLOCKS_TAG);
    }

    private boolean hasNextTag(Iterator<String> iterator, String expectedTag) {
        return iterator.hasNext() && expectedTag.equals(iterator.next());
    }
}
