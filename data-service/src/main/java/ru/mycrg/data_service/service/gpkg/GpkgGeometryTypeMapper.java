package ru.mycrg.data_service.service.gpkg;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.enums.GeometryType;
import ru.mycrg.schemas.BaseGeometryType;

import java.util.Map;

@Component
public class GpkgGeometryTypeMapper {

    private static final Map<String, GeometryType> GPKG_TO_ENUM_MAP = Map.of(
            "POINT", GeometryType.POINT,
            "LINESTRING", GeometryType.MULTI_LINE_STRING,
            "POLYGON", GeometryType.MULTI_POLYGON,

            "MULTIPOINT", GeometryType.POINT,
            "MULTILINESTRING", GeometryType.MULTI_LINE_STRING,
            "MULTIPOLYGON", GeometryType.MULTI_POLYGON
    );

    /**
     * Преобразует тип геометрии из спецификации GeoPackage (GPKG) в один из базовых типов, поддерживаемых фронтендом
     * ({@link BaseGeometryType}).
     * <p>
     * В спецификации GPKG определено 14 разных типов геометрий. В нашем домене (enum
     * {@link ru.mycrg.data_service_contract.enums.GeometryType}) есть 11 из них, а фронт умеет работать только с тремя
     * из них: {@code POINT}, {@code MULTI_LINE_STRING} и {@code MULTI_POLYGON}.
     * </p>
     * <p>
     * Данный маппер сознательно «сужает» всё многообразие типов GPKG до этих трёх базовых категорий, чтобы фронтенд мог
     * корректно отрисовывать и обрабатывать геометрию.
     * </p>
     * <p>
     * Если тип геометрии не поддерживается в нашем домене или его невозможно однозначно отнести к одному из трёх
     * базовых типов, метод выбрасывает {@link IllegalArgumentException}.
     * </p>
     * <p>
     * Примеры типов, которые существуют в GPKG, но непосредственно у нас не поддерживаются и, соответственно, не
     * маппятся: {@code GEOMETRY}, {@code GEOMETRYCOLLECTION}, {@code CIRCULARSTRING}, {@code COMPOUNDCURVE},
     * {@code CURVEPOLYGON}, {@code MULTICURVE}, {@code MULTISURFACE}, {@code CURVE}, {@code SURFACE} и др.
     * </p>
     *
     * @return один из трёх базовых типов геометрии для фронтенда
     *
     * @throws IllegalArgumentException если тип не поддерживается или не может быть смапплен
     */
    public GeometryType mapType(String type) {
        if (type == null || !GPKG_TO_ENUM_MAP.containsKey(type)) {
            throw new IllegalArgumentException("Гип геометрии '" + type + "' не поддерживается платформой!");
        }

        return GPKG_TO_ENUM_MAP.get(type);
    }
}
