package ru.mycrg.data_service.kpt_import.model.kvartal;

import ru.mycrg.data_service.kpt_import.model.KptElement;

import java.util.Map;

public abstract class KvartalPartialDataElement extends KptElement {

    protected KvartalPartialDataElement(Map<String, Object> content) {
        super(content);
    }
}
