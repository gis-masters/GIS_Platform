package ru.mycrg.integration_service.bpmn.gpkg;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class GeoServerSpeakerTest {

    @Test
    void testFindSvgRelativePathInSld() {
        String sld11 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<StyledLayerDescriptor xmlns=\"http://www.opengis.net/sld\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n" +
                "    xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n" +
                "    xsi:schemaLocation=\"http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd\"\n" +
                "    version=\"1.1.0\"\n" +
                "    xmlns:se=\"http://www.opengis.net/se\">\n" +
                "    <NamedLayer>\n" +
                "        <se:Name>Предприятия и объекты сельского и лесного хозяйства, рыболовства и рыбоводства</se:Name>\n" +
                "        <UserStyle>\n" +
                "            <se:Name>Agriculture</se:Name>\n" +
                "            <se:FeatureTypeStyle>\n" +
                "                <se:Rule>\n" +
                "                    <se:Name>60202020111</se:Name>\n" +
                "                    <se:Description>\n" +
                "                        <se:Title>Предприятие растениеводства существующее федерального значения</se:Title>\n" +
                "                    </se:Description>\n" +
                "                    <ogc:Filter xmlns:ogc=\"http://www.opengis.net/ogc\">\n" +
                "                        <ogc:PropertyIsEqualTo>\n" +
                "                            <ogc:PropertyName>ruleid</ogc:PropertyName>\n" +
                "                            <ogc:Literal>60202020111</ogc:Literal>\n" +
                "                        </ogc:PropertyIsEqualTo>\n" +
                "                    </ogc:Filter>\n" +
                "                    <se:PointSymbolizer>\n" +
                "                        <se:Graphic>\n" +
                "                            <se:ExternalGraphic>\n" +
                "                                <se:OnlineResource xlink:type=\"simple\"\n" +
                "                                    xlink:href=\"svg/02_Industry/02_Agriculture/60202020111.svg\" />\n" +
                "                                <se:Format>image/svg+xml</se:Format>\n" +
                "                            </se:ExternalGraphic>\n" +
                "                            <se:Size>40</se:Size>\n" +
                "                        </se:Graphic>\n" +
                "                    </se:PointSymbolizer>\n" +
                "                </se:Rule>\n" +
                "                \n" +
                "                <se:Rule>\n" +
                "                    <se:Name>Default</se:Name>\n" +
                "                    <se:Description>\n" +
                "                        <se:Title>Не определено</se:Title>\n" +
                "                    </se:Description>\n" +
                "                    <se:ElseFilter />\n" +
                "                    <se:PointSymbolizer>\n" +
                "                        <se:Graphic>\n" +
                "                            <se:ExternalGraphic>\n" +
                "                                <se:OnlineResource xlink:type=\"simple\" xlink:href=\"svg/Else.svg\" />\n" +
                "                                <se:Format>image/svg+xml</se:Format>\n" +
                "                            </se:ExternalGraphic>\n" +
                "                            <se:Size>40</se:Size>\n" +
                "                        </se:Graphic>\n" +
                "                    </se:PointSymbolizer>\n" +
                "                </se:Rule>\n" +
                "            </se:FeatureTypeStyle>\n" +
                "        </UserStyle>\n" +
                "    </NamedLayer>\n" +
                "</StyledLayerDescriptor>";

        GeoServerSpeaker geoServerSpeaker = new GeoServerSpeaker();
        List<String> svgPaths = geoServerSpeaker.findSvgRelativePathInSld(sld11);

        assertEquals(2, svgPaths.size());
        assertTrue(svgPaths.contains("svg/02_Industry/02_Agriculture/60202020111.svg"));
        assertTrue(svgPaths.contains("svg/Else.svg"));
    }
}
