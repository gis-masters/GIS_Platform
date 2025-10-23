package ru.mycrg.integration_service.bpmn.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.gpkg.StyleWithIcons;
import ru.mycrg.data_service_contract.dto.gpkg.SvgIcon;
import ru.mycrg.geoserver_client.services.resources.Svg;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.http_client.ResponseModel;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamReader;
import java.io.StringReader;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class GeoServerSpeaker {

    private final Logger log = LoggerFactory.getLogger(GeoServerSpeaker.class);

    public StyleWithIcons getStylesAndSvg(String styleName, String token) {
        StyleWithIcons styleWithIcons = new StyleWithIcons();
        styleWithIcons.setName(styleName);

        getSldFromGeoserver(styleName, token).ifPresent(styleBody -> {
            styleWithIcons.setBody(styleBody);

            List<SvgIcon> svgList = new LinkedList<>();
            if (styleBody.contains("<sld:Format>image/svg+xml</sld:Format>")) {
                List<String> svgPaths = findSvgRelativePathInSld(styleBody);

                for (String svgPath: svgPaths) {
                    getSvgFromGeoserver(svgPath, token)
                            .ifPresent(svgBody -> svgList.add(new SvgIcon(svgPath, svgBody)));
                }

                styleWithIcons.setSvg(svgList);
            }
        });

        return styleWithIcons;
    }

    private Optional<String> getSldFromGeoserver(String styleName, String token) {
        //костиляку на гiляку -> чёт нужно придумать ... потом
        if (styleName.equals("__custom__")) {
            return Optional.of("__custom__");
        }

        log.debug("Пытаемся получить тело стиля: {}", styleName);

        ResponseModel<String> response;
        try {
            response = new StyleService(token).getStyleBody(styleName);
            if (response.isSuccessful() && response.getBody() != null) {
                return Optional.ofNullable(response.getBody());
            } else {
                log.debug("Ошибка получения SLD: {}. Код ответа: {}", styleName, response.getCode());

                return Optional.empty();
            }
        } catch (Exception e) {
            log.debug("Ошибка соединения при получения SLD: {}.", e.getMessage());

            return Optional.empty();
        }
    }

    private Optional<String> getSvgFromGeoserver(String absolutePath, String token) {
        String relativePath = absolutePath.substring(absolutePath.indexOf("styles"));

        ResponseModel<String> response;
        try {
            response = new Svg(token).getSvg(relativePath);
            if (response.isSuccessful() && response.getBody() != null) {
                log.debug("Status code {}", response.getCode());
                log.debug("body {}", response.getBody());

                return Optional.ofNullable(response.getBody());
            } else {
                log.debug("Ошибка получения svg: {}. Код ответа: {}", relativePath, response.getCode());

                return Optional.empty();
            }
        } catch (Exception e) {
            log.debug("Ошибка соединения при получения svg: {}.", e.getMessage());

            return Optional.empty();
        }
    }

    private List<String> findSvgRelativePathInSld(String styleSLD) {
        List<String> svgUrls = new LinkedList<>();

        if (styleSLD == null || styleSLD.isEmpty()) {
            return svgUrls;
        }

        try {
            XMLInputFactory factory = XMLInputFactory.newInstance();
            XMLStreamReader reader = factory.createXMLStreamReader(new StringReader(styleSLD));

            boolean inExternalGraphic = false;
            String pendingHref = null;

            while (reader.hasNext()) {
                int event = reader.next();

                switch (event) {
                    case XMLStreamConstants.START_ELEMENT:
                        String localName = reader.getLocalName();

                        if ("ExternalGraphic".equals(localName)) {
                            inExternalGraphic = true;
                            pendingHref = null;
                        } else if (inExternalGraphic && "OnlineResource".equals(localName)) {
                            // Ищем атрибут xlink:href
                            for (int i = 0; i < reader.getAttributeCount(); i++) {
                                String attrName = reader.getAttributeLocalName(i);
                                if ("href".equals(attrName)) {
                                    pendingHref = reader.getAttributeValue(i);

                                    break;
                                }
                            }
                        } else if (inExternalGraphic && "Format".equals(localName)) {
                            // Читаем содержимое элемента Format
                            String formatContent = reader.getElementText();
                            if ("image/svg+xml".equals(formatContent)) {
                                // Если уже нашли href и это SVG формат, добавляем в список
                                if (pendingHref != null) {
                                    svgUrls.add(pendingHref);
                                    log.debug("Найденная SVG URL: {}", pendingHref);
                                }
                            }
                        }
                        break;

                    case XMLStreamConstants.END_ELEMENT:
                        if ("ExternalGraphic".equals(reader.getLocalName())) {
                            inExternalGraphic = false;
                            pendingHref = null;
                        }

                        break;
                }
            }
            reader.close();
        } catch (Exception e) {
            log.error("Ошибка парсинга SLD для SVG URLs: {}", e.getMessage(), e);
        }
        log.debug("Найдено {} SVG URLs внутри SLD", svgUrls.size());

        return svgUrls;
    }
}
