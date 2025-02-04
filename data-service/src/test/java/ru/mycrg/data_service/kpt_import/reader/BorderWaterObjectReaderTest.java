package ru.mycrg.data_service.kpt_import.reader;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectElementFactory;
import ru.mycrg.data_service.kpt_import.model.generated.CoastlineBoundariesType;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;

import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BorderWaterObjectReaderTest {

    static BorderWaterObjectElementFactory factory;
    static CoastlineBoundariesType.CoastlineRecord xmlRecord;
    static XMLInputFactory xmlInputFactory;

    @BeforeClass
    public static void beforeAll() {
        factory = mock(BorderWaterObjectElementFactory.class);

        when(factory.fromCoastlineRecord(any())).thenAnswer(invocation -> {
            xmlRecord = invocation.getArgument(0);
            return List.of();
        });

        xmlInputFactory = XMLInputFactory.newFactory();
    }

    @Before
    public void before() {
        xmlRecord = null;
    }

    @Test
    public void readObject_zones_and_territoriesXml() throws JAXBException, IOException, XMLStreamException {
        BorderWaterObjectReader reader = new BorderWaterObjectReader(factory);

        URL xmlRes = getClass().getResource("./object_zones_and_territories.xml");
        assertNotNull(xmlRes);

        try(InputStream xmlStream = xmlRes.openStream()) {
            XMLStreamReader xmlStreamReader = xmlInputFactory.createXMLStreamReader(xmlStream);
            reader.read(xmlStreamReader);
        }

        assertNotNull(xmlRecord);
        assertNotNull(xmlRecord.getBObjectZonesAndTerritories());
    }


    @Test
    public void readB_object_coastlineXml() throws JAXBException, IOException, XMLStreamException {
        BorderWaterObjectReader reader = new BorderWaterObjectReader(factory);

        URL xmlRes = getClass().getResource("./b_object_coastline.xml");
        assertNotNull(xmlRes);

        try(InputStream xmlStream = xmlRes.openStream()) {
            XMLStreamReader xmlStreamReader = xmlInputFactory.createXMLStreamReader(xmlStream);
            reader.read(xmlStreamReader);
        }

        assertNotNull(xmlRecord);
        assertNotNull(xmlRecord.getBObjectZonesAndTerritories());
    }
}
