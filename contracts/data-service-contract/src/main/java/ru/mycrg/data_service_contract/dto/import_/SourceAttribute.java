package ru.mycrg.data_service_contract.dto.import_;

/**
 * Класс отображающий описание атрибута от импорт плагина геосервера.
 */
public class SourceAttribute {

    private String name;

    /**
     * Отсылка на java класс, например: "org.locationtech.jts.geom.MultiPolygon", "java.lang.Long"
     *
     */
    private String binding;

    public SourceAttribute() {}

    public SourceAttribute(String name, String binding) {
        this.name = name;
        this.binding = binding;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBinding() {
        return binding;
    }

    public void setBinding(String binding) {
        this.binding = binding;
    }
}
