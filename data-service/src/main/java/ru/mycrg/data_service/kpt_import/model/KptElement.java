package ru.mycrg.data_service.kpt_import.model;

import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

/**
 * Модель элемента слоя КПТ
 */
public abstract class KptElement {

    protected final Map<String, Object> content;

    protected KptElement(Map<String, Object> content) {
        this.content = content;
    }

    public boolean hasGeometry() {
        return content.containsKey(DEFAULT_GEOMETRY_COLUMN_NAME);
    }

    public Map<String, Object> getContent() {
        return content;
    }
}
