package ru.mycrg.auth_service.service.organization;

import com.google.gson.Gson;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValueTitleProjection;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service_contract.enums.ValueType.BOOLEAN;
import static ru.mycrg.data_service_contract.enums.ValueType.CHOICE;

@Component
public class OrgSettingsSchemaHolder {

    private final SchemaDto schema;
    private final Gson mapper = new Gson();

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

        SimplePropertyDto dataManagement = new SimplePropertyDto();
        dataManagement.setName("dataManagement");
        dataManagement.setTitle("Управление данными");
        dataManagement.setValueType(BOOLEAN);
        dataManagement.setDefaultValue(false);

        SimplePropertyDto downloadXml = new SimplePropertyDto();
        downloadXml.setName("downloadXml");
        downloadXml.setTitle("Скачивание xml межевого плана и выгрузка координат и геометрии");
        downloadXml.setValueType(BOOLEAN);
        downloadXml.setDefaultValue(false);

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

        props.add(createLibraryItem);
        props.add(dataManagement);
        props.add(downloadXml);
        props.add(downloadFiles);
        props.add(createProject);
        props.add(editProjectLayer);
        props.add(sedDialog);
        props.add(reestrs);
        props.add(taskManagement);
        props.add(tags);

        this.schema.setProperties(props);
    }

    public SchemaDto getSchema() {
        return mapper.fromJson(
                mapper.toJson(schema),
                SchemaDto.class);
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
            if (property.getValueType().equals(BOOLEAN.name())) {
                result.put(property.getName(), true);
            }

            if (property.getValueType().equals(CHOICE.name())) {
                List<Object> items = new ArrayList<>();
                property.getEnumerations().forEach(item -> items.add(item.getTitle()));

                result.put(property.getName(), items);
            }
        });

        return result;
    }
}
