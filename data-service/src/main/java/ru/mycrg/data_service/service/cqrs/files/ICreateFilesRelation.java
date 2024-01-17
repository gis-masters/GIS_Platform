package ru.mycrg.data_service.service.cqrs.files;

import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.resources.IQualifiable;
import ru.mycrg.data_service.service.schemas.ISchemable;
import ru.mycrg.geo_json.Feature;

/**
 * Необходимость в дублирующих друг друга record/feature остаётся до того пока в библиотеках не работаем с геометрией,
 * позже, скорее всего, всё будет feature {@link Feature}
 */
public interface ICreateFilesRelation extends ISchemable, IQualifiable {

    IRecord getRecord();

    Feature getFeature();
}
