package ru.mycrg.auth_service.service.organization.settings;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValueTitleProjection;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service_contract.enums.ValueType.*;
import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.http_client.JsonConverter.toJson;

@Component
public class OrgSettingsSchemaHolder {

    // TODO: Только код EPSG
    public static final String DEFAULT_EPSG = "WGS 84 / Pseudo-Mercator, EPSG:3857, метры";

    // TODO: Не хранить проекцию, а хранить только её код EPSG
    public static final String DEFAULT_FAVORITES_EPSG = "{\"authName\":\"EPSG\",\"authSrid\":3857,\"srtext\":\"" +
            "PROJCS[\\\"WGS 84 / Pseudo-Mercator\\\",GEOGCS[\\\"WGS 84\\\",DATUM[\\\"WGS_1984\\\",SPHEROID[\\\"" +
            "WGS 84\\\",6378137,298.257223563,AUTHORITY[\\\"EPSG\\\",\\\"7030\\\"]],AUTHORITY[\\\"EPSG\\\",\\\"" +
            "6326\\\"]],PRIMEM[\\\"Greenwich\\\",0,AUTHORITY[\\\"EPSG\\\",\\\"8901\\\"]],UNIT[\\\"degree\\\"," +
            "0.0174532925199433,AUTHORITY[\\\"EPSG\\\",\\\"9122\\\"]],AUTHORITY[\\\"EPSG\\\",\\\"4326\\\"]]," +
            "PROJECTION[\\\"Mercator_1SP\\\"],PARAMETER[\\\"central_meridian\\\",0],PARAMETER[\\\"scale_factor\\\"," +
            "1],PARAMETER[\\\"false_easting\\\",0],PARAMETER[\\\"false_northing\\\",0],UNIT[\\\"metre\\\",1," +
            "AUTHORITY[\\\"EPSG\\\",\\\"9001\\\"]],AXIS[\\\"X\\\",EAST],AXIS[\\\"Y\\\",NORTH],EXTENSION[\\\"" +
            "PROJ4\\\",\\\"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=" +
            "m +nadgrids=@null +wktext +no_defs\\\"],AUTHORITY[\\\"EPSG\\\",\\\"3857\\\"]]\",\"proj4Text\":\"+proj=" +
            "merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null " +
            "+wktext +no_defs\",\"title\":\"WGS 84 / Pseudo-Mercator, EPSG:3857, метры\",\"auth_srid\":3857}";

    private final SchemaDto schema;

    public OrgSettingsSchemaHolder() {
        schema = new SchemaDto();
        schema.setName("org_settings");
        schema.setTableName("org_settings");
        schema.setTitle("Настройки организации");
        schema.setDescription("Описание настроек организации");

        List<SimplePropertyDto> props = new ArrayList<>();
        SimplePropertyDto createLibraryItem = new SimplePropertyDto();
        createLibraryItem.setName("createLibraryItem");
        createLibraryItem.setTitle("Создание элементов в библиотеке");
        createLibraryItem.setValueType(BOOLEAN);
        createLibraryItem.setDefaultValue(false);

        SimplePropertyDto downloadXml = new SimplePropertyDto();
        downloadXml.setName("downloadXml");
        downloadXml.setTitle("Скачивание xml межевого плана и выгрузка координат и геометрии");
        downloadXml.setValueType(BOOLEAN);
        downloadXml.setDefaultValue(false);

        SimplePropertyDto viewDocumentLibrary = new SimplePropertyDto();
        viewDocumentLibrary.setName("viewDocumentLibrary");
        viewDocumentLibrary.setTitle("Доступность библиотек документов");
        viewDocumentLibrary.setValueType(BOOLEAN);
        viewDocumentLibrary.setDefaultValue(false);

        SimplePropertyDto viewBugReport = new SimplePropertyDto();
        viewBugReport.setName("viewBugReport");
        viewBugReport.setTitle("Проверка ошибок по приказу");
        viewBugReport.setValueType(BOOLEAN);
        viewBugReport.setDefaultValue(false);

        SimplePropertyDto downloadGml = new SimplePropertyDto();
        downloadGml.setName("downloadGml");
        downloadGml.setTitle("Выгрузка GML");
        downloadGml.setValueType(BOOLEAN);
        downloadGml.setDefaultValue(false);

        SimplePropertyDto importShp = new SimplePropertyDto();
        importShp.setName("importShp");
        importShp.setTitle("Импорт SHP архивов");
        importShp.setValueType(BOOLEAN);
        importShp.setDefaultValue(false);

        SimplePropertyDto viewServicesCalculator = new SimplePropertyDto();
        viewServicesCalculator.setName("viewServicesCalculator");
        viewServicesCalculator.setTitle("Калькулятор предоставления сведений");
        viewServicesCalculator.setValueType(BOOLEAN);
        viewServicesCalculator.setDefaultValue(false);

        SimplePropertyDto downloadFiles = new SimplePropertyDto();
        downloadFiles.setName("downloadFiles");
        downloadFiles.setTitle("Скачивание файлов");
        downloadFiles.setValueType(BOOLEAN);
        downloadFiles.setDefaultValue(false);

        SimplePropertyDto createProject = new SimplePropertyDto();
        createProject.setName("createProject");
        createProject.setTitle("Создание проекта");
        createProject.setValueType(BOOLEAN);
        createProject.setDefaultValue(false);

        SimplePropertyDto editProjectLayer = new SimplePropertyDto();
        editProjectLayer.setName("editProjectLayer");
        editProjectLayer.setTitle("Настройка слоев проекта");
        editProjectLayer.setValueType(BOOLEAN);
        editProjectLayer.setDefaultValue(false);

        SimplePropertyDto sedDialog = new SimplePropertyDto();
        sedDialog.setName("sedDialog");
        sedDialog.setTitle("СЭД Диалог");
        sedDialog.setValueType(BOOLEAN);
        sedDialog.setDefaultValue(false);

        SimplePropertyDto reestrs = new SimplePropertyDto();
        reestrs.setName("reestrs");
        reestrs.setTitle("Реестры");
        reestrs.setValueType(BOOLEAN);
        reestrs.setDefaultValue(false);

        SimplePropertyDto showPermissions = new SimplePropertyDto();
        showPermissions.setName("showPermissions");
        showPermissions.setTitle("Настройка разрешений в админке");
        showPermissions.setValueType(BOOLEAN);
        showPermissions.setDefaultValue(true);

        SimplePropertyDto taskManagement = new SimplePropertyDto();
        taskManagement.setName("taskManagement");
        taskManagement.setTitle("Управление задачами");
        taskManagement.setValueType(BOOLEAN);
        taskManagement.setDefaultValue(false);

        SimplePropertyDto tags = new SimplePropertyDto();
        tags.setName("tags");
        tags.setTitle("Управление схемами");
        tags.setDescription("Системная схема будет доступна если содержит хотя бы один из разрешенных тегов");
        tags.setMultiple(true);
        tags.setValueType(CHOICE);
        tags.setEnumerations(new ArrayList<>());

        SimplePropertyDto favoritesEpsg = new SimplePropertyDto();
        favoritesEpsg.setName("favorites_epsg");
        favoritesEpsg.setTitle("Предпочитаемые системы координаты");
        favoritesEpsg.setMultiple(true);
        favoritesEpsg.setValueType(CHOICE);
        favoritesEpsg.setEnumerations(List.of(new ValueTitleProjection(DEFAULT_FAVORITES_EPSG)));

        SimplePropertyDto defaultEpsg = new SimplePropertyDto();
        defaultEpsg.setName("default_epsg");
        defaultEpsg.setTitle("Система координат по-умолчанию");
        defaultEpsg.setValueType(CHOICE);
        defaultEpsg.setEnumerations(List.of(new ValueTitleProjection(DEFAULT_EPSG)));

        SimplePropertyDto storageSize = new SimplePropertyDto();
        storageSize.setName("storageSize");
        storageSize.setTitle("Размер доступного дискового пространства (Гб)");
        storageSize.setValueType(INT);
        storageSize.setDefaultValue(2);
        storageSize.setMinInclusive(0);
        storageSize.setMaxInclusive(100);

        props.add(createLibraryItem);
        props.add(viewDocumentLibrary);
        props.add(viewBugReport);
        props.add(downloadGml);
        props.add(importShp);
        props.add(viewServicesCalculator);
        props.add(downloadXml);
        props.add(downloadFiles);
        props.add(createProject);
        props.add(editProjectLayer);
        props.add(sedDialog);
        props.add(reestrs);
        props.add(showPermissions);
        props.add(taskManagement);
        props.add(tags);
        props.add(favoritesEpsg);
        props.add(defaultEpsg);
        props.add(storageSize);

        this.schema.setProperties(props);
    }

    public SchemaDto getSchema() {
        return fromJson(toJson(schema), SchemaDto.class)
                .orElseThrow(() -> new AuthServiceException("Не удалось конвертировать схему"));
    }

    public void updateTags(List<String> tags) {
        List<ValueTitleProjection> enumerations = tags.stream()
                                                      .map(tag -> new ValueTitleProjection(tag, tag))
                                                      .collect(Collectors.toList());

        SimplePropertyDto tag = new SimplePropertyDto();
        tag.setName("tags");
        tag.setTitle("Управление схемами");
        tag.setDescription("Системная схема будет доступна если содержит хотя бы один из разрешенных тегов");
        tag.setMultiple(true);
        tag.setValueType(CHOICE);
        tag.setEnumerations(enumerations.isEmpty() ? new ArrayList<>() : enumerations);

        this.schema.getProperties().removeIf(property -> property.getName().equals("tags"));
        this.schema.addProperty(tag);
    }

    public Map<String, Object> allInclusive() {
        Map<String, Object> result = new HashMap<>();
        this.schema.getProperties().forEach(property -> {
            String type = property.getValueType();
            if (type.equals(BOOLEAN.name())) {
                result.put(property.getName(), true);
            } else if (type.equals(CHOICE.name())) {
                List<Object> items = new ArrayList<>();
                property.getEnumerations().forEach(item -> items.add(item.getTitle()));

                result.put(property.getName(), items);
            } else {
                result.put(property.getName(), property.getDefaultValue());
            }
        });

        return result;
    }
}
