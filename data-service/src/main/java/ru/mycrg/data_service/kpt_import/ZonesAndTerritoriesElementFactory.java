package ru.mycrg.data_service.kpt_import;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.NaturalAreaElement;
import ru.mycrg.data_service.kpt_import.model.TerZoneElement;
import ru.mycrg.data_service.kpt_import.model.ZouitElement;
import ru.mycrg.data_service.kpt_import.model.generated.Bobject;
import ru.mycrg.data_service.kpt_import.model.generated.BobjectZonesAndTerritories;
import ru.mycrg.data_service.kpt_import.model.generated.Dict;
import ru.mycrg.data_service.kpt_import.model.generated.ZonesAndTerritoriesBoundariesType;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Все зоны считаем по умолчанию именно как ЗОУИТ, кроме явно выделенных территориальных и природных зон.
 */
@Component
public class ZonesAndTerritoriesElementFactory {

    private static final String TER_ZONE_BOUNDARY_CODE = "7";
    private static final String TER_ZONE_BOUNDARY_VALUE = "Территориальная зона";
    private static final Set<String> NATURAL_AREA_BOUNDARY_CODES = Set.of("9", "15", "21");
    private static final Set<String> NATURAL_AREA_BOUNDARY_VALUES = Set.of(
            "Особо охраняемая природная территория",
            "Лесничество",
            "Граница особо охраняемой природной территории",
            "Лесопарковый зеленый пояс");

    public KptElement create(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord record,
                             Map<String, Object> content) {
        if (isTerZone(record)) {
            return new TerZoneElement(content);
        }

        if (isNaturalArea(record)) {
            return new NaturalAreaElement(content);
        }

        return new ZouitElement(content);
    }

    private boolean isTerZone(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord record) {
        Optional<Dict> oTypeBoundary = extractTypeBoundary(record);

        return oTypeBoundary.map(Dict::getCode)
                            .filter(TER_ZONE_BOUNDARY_CODE::equals)
                            .isPresent()
                || oTypeBoundary.map(Dict::getValue)
                                .filter(TER_ZONE_BOUNDARY_VALUE::equals)
                                .isPresent();
    }

    private boolean isNaturalArea(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord record) {
        Optional<Dict> oTypeBoundary = extractTypeBoundary(record);

        return oTypeBoundary.map(Dict::getCode)
                            .filter(NATURAL_AREA_BOUNDARY_CODES::contains)
                            .isPresent()
                || oTypeBoundary.map(Dict::getValue)
                                .filter(NATURAL_AREA_BOUNDARY_VALUES::contains)
                                .isPresent();
    }

    private Optional<Dict> extractTypeBoundary(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord record) {
        return Optional.ofNullable(record.getBObjectZonesAndTerritories())
                       .map(BobjectZonesAndTerritories::getBObject)
                       .map(Bobject::getTypeBoundary);
    }
}
