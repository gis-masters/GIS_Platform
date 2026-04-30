package ru.mycrg.integration_service.bpmn.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgSvg;
import ru.mycrg.geoserver_client.contracts.coveragestores.CoverageStoreResponseModel;
import ru.mycrg.geoserver_client.contracts.coveragestores.CoverageStoreResponseWrapper;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.geoserver_client.services.layers.rasters.RasterLayer;
import ru.mycrg.geoserver_client.services.resources.Svg;
import ru.mycrg.geoserver_client.services.storage.raster.RasterStorage;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamReader;
import java.io.StringReader;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ACTIVE;

@Service
public class GeoServerSpeaker {

    private final Logger log = LoggerFactory.getLogger(GeoServerSpeaker.class);

    private final String ADDITIONAL_SUB_STRING = "_1";

    public GpkgStyle getStylesAndSvg(String styleName, String token, String dbName) {
        GpkgStyle styleWithIcons = new GpkgStyle();
        styleWithIcons.setName(styleName);
        styleWithIcons.setStatus(ACTIVE);

        getSldFromGeoserver(styleName, token, dbName).ifPresent(styleBody -> {
            styleWithIcons.setBody(styleBody);

            List<GpkgSvg> svgList = new LinkedList<>();
            if (styleBody.contains("<se:Format>image/svg+xml</se:Format>")) {
                List<String> svgPaths = findSvgRelativePathInSld(styleBody);

                for (String svgPath: svgPaths) {
                    getSvgBodyFromGeoserver(svgPath, token)
                            .ifPresent(svgBody -> svgList.add(new GpkgSvg(svgPath, ACTIVE, svgBody)));
                }

                styleWithIcons.setSvgs(svgList);
            }
        });

        return styleWithIcons;
    }

    public List<String> findSvgRelativePathInSld(String styleSLD) {
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
                            if ("image/svg+xml".equals(formatContent) && pendingHref != null) {
                                // Если уже нашли href и это SVG формат, добавляем в список
                                svgUrls.add(pendingHref);
                                log.debug("Найденная SVG URL: {}", pendingHref);
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

    public synchronized String addSvgOnGeoserverRecursive(String token, String svgPath, String actualBody)
            throws HttpClientException {
        Optional<String> existBody = getSvgBodyFromGeoserver(svgPath, token);

        if (existBody.isPresent()) {
            if (actualBody.equals(existBody.get())) {
                // SVG существует и содержимое одинаковое - используем существующую
                log.debug("SVG {} есть на геосервере и её не нужно менять", svgPath);

                return svgPath;
            } else {
                // SVG существует, но содержимое разное - создаем новое имя и проверяем рекурсивно
                int lastSlash = svgPath.lastIndexOf('/');
                int lastDot = svgPath.lastIndexOf('.');
                String newSvgPath = lastDot > lastSlash
                        ? svgPath.substring(0, lastDot) + ADDITIONAL_SUB_STRING + svgPath.substring(lastDot)
                        : svgPath + ADDITIONAL_SUB_STRING;
                log.debug("SVG {} существует с другим содержимым, пробуем создать {}", svgPath, newSvgPath);

                return addSvgOnGeoserverRecursive(token, newSvgPath, actualBody);
            }
        } else {
            // SVG нет на геосервере - создаем её
            log.debug("SVG {} нет на геосервере. Создаем её", svgPath);
            postNewSvg(token, svgPath, actualBody);

            return svgPath;
        }
    }

    private void postNewSvg(String token, String relativePath, String actualBody) throws HttpClientException {
        log.debug("Создадим на геосервере новую SVG по пути {}", relativePath);
        new Svg(token).postSvg(relativePath, actualBody);
    }

    private Optional<String> getSvgBodyFromGeoserver(String relativePath, String token) {
        ResponseModel<String> response;
        try {
            response = new Svg(token).getSvg(relativePath);
            if (response.isSuccessful() && response.getBody() != null) {
                log.debug("Status code {}", response.getCode());

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

    private Optional<String> getSldFromGeoserver(String styleName, String token, String dbName) {
        //костиляку на гiляку -> чёт нужно придумать ... потом
        if (styleName.equals("__custom__")) {
            return Optional.of("__custom__");
        }

        log.debug("Пытаемся получить тело стиля: {}", styleName);

        // Сначала пытаемся найти в default workspace
        ResponseModel<String> response;
        try {
            response = new StyleService(token).getStyleBodyFromDefault(styleName);
            if (response.isSuccessful() && response.getBody() != null) {
                log.debug("Стиль {} найден в default workspace", styleName);
                return Optional.ofNullable(response.getBody());
            } else {
                log.debug("Стиль {} не найден в default workspace. Код ответа: {}", styleName, response.getCode());
            }
        } catch (Exception e) {
            log.debug("Ошибка соединения при получении SLD из default workspace: {}.", e.getMessage());
        }
        // Если не найден в default, пытаемся найти в workspace проекта
        String workspace = "scratch_database_" + dbName.replace("database_", "");
        try {
            response = new StyleService(token).getStyleBodyFromWorkspace(styleName, workspace);
            if (response.isSuccessful() && response.getBody() != null) {
                log.debug("Стиль {} найден в workspace {}", styleName, workspace);

                return Optional.ofNullable(response.getBody());
            } else {
                log.debug("Стиль {} не найден в workspace {}. Код ответа: {}", styleName, workspace,
                          response.getCode());
            }
        } catch (Exception e) {
            log.debug("Ошибка соединения при получении SLD из workspace {}: {}.", workspace, e.getMessage());
        }
        log.debug("Стиль {} не найден ни в default workspace, ни в {}", styleName, workspace);

        return Optional.empty();
    }

    public synchronized String addStyleOnGeoserverRecursive(String token,
                                                            String dbName,
                                                            String styleName,
                                                            String actualBody) throws HttpClientException {
        Optional<String> existBody = getSldFromGeoserver(styleName, token, dbName);

        if (existBody.isPresent()) {
            if (actualBody.equals(existBody.get())) {
                // Стиль существует и содержимое одинаковое - используем существующий
                log.debug("Стиль {} есть на геосервере и его не нужно менять", styleName);

                return styleName;
            } else {
                // Стиль существует, но содержимое разное - создаем новое имя и проверяем рекурсивно
                String newStyleName = styleName + ADDITIONAL_SUB_STRING;
                log.debug("actualBody : {}", actualBody);
                log.debug("existBody : {}", existBody.get());
                log.debug("Стиль {} существует с другим содержимым, пробуем создать {}", styleName, newStyleName);

                return addStyleOnGeoserverRecursive(token, dbName, newStyleName, actualBody);
            }
        } else {
            // Стиля нет на геосервере - создаем его
            log.debug("Стиля {} нет на геосервере. Создаем его", styleName);
            postNewStyle(token, styleName, actualBody, dbName);

            return styleName;
        }
    }

    public Optional<Layer> getLayer(String token, String workspace, String layerName) {
        try {
            return new RasterLayer(token).getByName(workspace, layerName);
        } catch (HttpClientException e) {
            return Optional.empty();
        }
    }

    public Optional<CoverageStoreResponseModel> getCoverageStore(String token, String scratchWorkspaceName,
                                                                 String coverageStore) {
        try {
            ResponseModel<CoverageStoreResponseWrapper> storage = new RasterStorage(token)
                    .getStorage(scratchWorkspaceName, coverageStore);

            return Optional.of(storage.getBody().getCoverageStore());
        } catch (Exception e) {
            log.warn("При получении CoverageStore произошла ошибка: {}", e.getMessage());

            return Optional.empty();
        }
    }

    private void postNewStyle(String token, String newStyleName, String actualBody, String dbName)
            throws HttpClientException {
        log.debug("Создаём стиль {} на геосервере", newStyleName);
        String workspace = "scratch_database_" + dbName.replace("database_", "");

        new StyleService(token).postStyle(newStyleName, actualBody, workspace);
    }
}
