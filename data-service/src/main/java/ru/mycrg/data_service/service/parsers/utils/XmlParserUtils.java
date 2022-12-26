package ru.mycrg.data_service.service.parsers.utils;

import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.NodeList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.IntStream;

public class XmlParserUtils {

    private XmlParserUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static Optional<String> getElementTextContentByTag(Element rootElement, String tag) {
        return rootElement.getElementsByTagName(tag).getLength() > 0
                ? Optional.ofNullable(rootElement.getElementsByTagName(tag).item(0).getTextContent())
                : Optional.empty();
    }

    public static Map<String, Object> parseAttributes(NamedNodeMap nodeAttributes, List<String> fields) {
        Map<String, Object> result = new HashMap<>();
        IntStream.range(0, nodeAttributes.getLength())
                 .forEach(j -> {
                     String attributeName = nodeAttributes.item(j).getNodeName();
                     if (fields.stream().anyMatch(attributeName::equalsIgnoreCase)) {
                         result.put(attributeName.toLowerCase(), nodeAttributes.item(j).getTextContent());
                     }
                 });

        return result;
    }

    public static Optional<String> getAttributeByTag(Element rootElement, String elementTag, String attributeTag) {
        Optional<NodeList> nodeList = rootElement.getElementsByTagName(elementTag).getLength() > 0
                ? Optional.ofNullable(rootElement.getElementsByTagName(elementTag))
                : Optional.empty();

        return nodeList
                .filter(list -> list.item(0).getAttributes().getLength() > 0)
                .map(list -> list.item(0).getAttributes().getNamedItem(attributeTag).getTextContent());
    }
}
