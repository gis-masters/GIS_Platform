package ru.mycrg.common_utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.mycrg.common_utils.CrgGlobalProperties.getLayerNameFromComplexName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getTableNameFromGeoserverLayerName;

class NameConversionTest {

    @Test
    void shouldCorrectlyGetTableName_fromNameWithDoubleSeparators() {
        assertEquals("test__sdf3", getTableNameFromGeoserverLayerName("test__sdf3__28406").get());
    }

    @Test
    void shouldCorrectlyGetTableName_fromNameWithoutPostfix() {
        assertEquals("test_3df3", getTableNameFromGeoserverLayerName("test_3df3").get());
    }

    @Test
    void shouldCorrectlyGetLayerNameFromComplexName() {
        assertEquals("test_sdf3__28406", getLayerNameFromComplexName("substrate:test_sdf3__28406").get());
    }

    @Test
    void shouldCorrectlyHandle_nullOrEmptyInput() {
        assertTrue(getTableNameFromGeoserverLayerName(null).isEmpty());
        assertTrue(getTableNameFromGeoserverLayerName("").isEmpty());

        assertTrue(getLayerNameFromComplexName(null).isEmpty());
        assertTrue(getLayerNameFromComplexName("").isEmpty());
    }
}
