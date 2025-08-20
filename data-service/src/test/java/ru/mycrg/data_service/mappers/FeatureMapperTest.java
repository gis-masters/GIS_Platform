package ru.mycrg.data_service.mappers;

import org.junit.Test;
import ru.mycrg.geo_json.Feature;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.mappers.FeatureMapper.mapToFeature;

public class FeatureMapperTest {

    @Test
    public void shouldCorrectMapFeatureWithPrimaryKeyAsString() {
        assertEquals(314, (long) mapToFeature(new Feature(), Collections.singletonMap(PRIMARY_KEY, "314")).getId());
    }

    @Test
    public void shouldCorrectMapFeatureWithPrimaryKeyAsInteger() {
        assertEquals(314, (long) mapToFeature(new Feature(), Collections.singletonMap(PRIMARY_KEY, 314)).getId());
    }

    @Test
    public void shouldCorrectMapFeatureWithPrimaryKeyAsLong() {
        assertEquals(314, (long) mapToFeature(new Feature(), Collections.singletonMap(PRIMARY_KEY, 314L)).getId());
    }
}
