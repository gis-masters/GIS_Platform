package ru.mycrg.common_utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.mycrg.common_utils.CrgGlobalProperties.getLayerNameFromComplexName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getResourceIdFromGeoserverLayerName;

class NameConversionTest {

    @Test
    void shouldCorrectlyGetResourceId_fromNameWithDoubleSeparators() {
        assertEquals("test__sdf3", getResourceIdFromGeoserverLayerName("test__sdf3__28406").get());
    }

    @Test
    void shouldCorrectlyGetResourceId_fromNameWithoutPostfix() {
        assertEquals("test_3df3", getResourceIdFromGeoserverLayerName("test_3df3").get());
    }

    @Test
    void shouldCorrectlyGetLayerNameFromComplexName() {
        assertEquals("test_sdf3__28406", getLayerNameFromComplexName("substrate:test_sdf3__28406").get());
    }

    @Test
    void shouldCorrectlyHandle_nullOrEmptyInput() {
        assertTrue(getResourceIdFromGeoserverLayerName(null).isEmpty());
        assertTrue(getResourceIdFromGeoserverLayerName("").isEmpty());

        assertTrue(getLayerNameFromComplexName(null).isEmpty());
        assertTrue(getLayerNameFromComplexName("").isEmpty());
    }
}
