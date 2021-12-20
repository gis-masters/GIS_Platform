package ru.mycrg.data_service.service.records;

import ru.mycrg.data_service.service.resources.ResourceQualifier;

public interface IDocumentRegistrar {

    /**
     * Регистрация документа в системе.
     * <p>
     * При регистрации документа ему присваивается идентификационный номер, состоящий из 4-х частей А-Б-В-Г.
     * <p>
     * А: код территории муниципального образования в соответствии с Общероссийским классификатором территорий
     * муниципальных образований;
     * <p>
     * Б: номер раздела информационной системы;
     * <p>
     * В: календарный год размещения;
     * <p>
     * Г: порядковый номер записи в реестре;
     *
     * @param rQualifier Квалификатор записи
     *
     * @return номер под которым документ был зарегистрирован.
     */
    String register(ResourceQualifier rQualifier);
}
