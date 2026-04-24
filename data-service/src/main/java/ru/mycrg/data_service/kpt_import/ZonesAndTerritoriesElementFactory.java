package ru.mycrg.data_service.kpt_import;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.TerZoneElement;
import ru.mycrg.data_service.kpt_import.model.ZouitElement;
import ru.mycrg.data_service.kpt_import.model.generated.Bobject;
import ru.mycrg.data_service.kpt_import.model.generated.BobjectZonesAndTerritories;
import ru.mycrg.data_service.kpt_import.model.generated.Dict;
import ru.mycrg.data_service.kpt_import.model.generated.ZonesAndTerritoriesBoundariesType;

import java.util.Map;
import java.util.Optional;

/**
Все зоны считаем по умолчанию именно как ЗОУИТ, кроме тех, у которых Код 7 или Имя Территориальная зона
 */
@Component
public class ZonesAndTerritoriesElementFactory {

    private static final String TER_ZONE_BOUNDARY_CODE = "7";
    private static final String TER_ZONE_BOUNDARY_VALUE = "Территориальная зона";

    public KptElement create(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord record,
                             Map<String, Object> content) {
        if (isTerZone(record)) {
            return new TerZoneElement(content);
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

    private Optional<Dict> extractTypeBoundary(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord record) {
        return Optional.ofNullable(record.getBObjectZonesAndTerritories())
                       .map(BobjectZonesAndTerritories::getBObject)
                       .map(Bobject::getTypeBoundary);
    }
}
