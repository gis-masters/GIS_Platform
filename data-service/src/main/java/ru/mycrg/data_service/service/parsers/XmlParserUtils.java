package ru.mycrg.data_service.service.parsers;

import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class XmlParserUtils {

    private XmlParserUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static Optional<String> getElementByTagTextContent(Element rootElement, String tag) {
        return rootElement.getElementsByTagName(tag).getLength() > 0
                ? Optional.ofNullable(rootElement.getElementsByTagName(tag).item(0).getTextContent())
                : Optional.empty();
    }

    public static List<Element> getElementsByTag(Element rootElement, List<String> tags) {
        return tags.stream()
                   .flatMap(tag -> {
                       int length = rootElement.getElementsByTagNameNS("*", tag).getLength();

                       return IntStream
                               .range(0, length)
                               .mapToObj(i -> (Element) rootElement.getElementsByTagNameNS("*", tag).item(i));
                   })
                   .collect(Collectors.toList());
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
