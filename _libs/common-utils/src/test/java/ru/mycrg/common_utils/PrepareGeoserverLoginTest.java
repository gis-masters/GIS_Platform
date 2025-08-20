package ru.mycrg.common_utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static ru.mycrg.common_utils.CrgGlobalProperties.prepareGeoserverLogin;

class PrepareGeoserverLoginTest {

    @Test
    void shouldCorrectPrepareLogin_withDotAndAtSign() {
        assertEquals("a_test_mycrg_1", prepareGeoserverLogin("a.test@mycrg", 1L));
    }

    @Test
    void shouldCorrectPrepareLogin_withUnderscore() {
        assertEquals("a_test_mycrg_ru_1", prepareGeoserverLogin("a_test@mycrg.ru", 1L));
    }

    @Test
    void shouldCorrectPrepareLogin_withAmpersand() {
        assertEquals("a_test_mycrg_ru_1", prepareGeoserverLogin("a&test@mycrg-ru", 1L));
    }

    @Test
    void shouldCorrectPrepareLogin_withManyDifferentSpecialChars() {
        assertEquals("fiz_____fiz_ru_314", prepareGeoserverLogin("fiz$%^&@fiz.ru", 314L));
    }

    @Test
    void shouldCorrectPrepareLogin_withDoubleUnderScore() {
        assertEquals("fiz__fiz_fiz_ru_314", prepareGeoserverLogin("fiz__fiz@fiz.ru", 314L));
    }

    @Test
    void shouldCorrectPrepareLogin_withNullId() {
        assertEquals("a_test_mycrg_ru_null", prepareGeoserverLogin("a&test@mycrg-ru", null));
    }

    @Test
    void shouldCorrectPrepareLogin_withNullParameters() {
        assertEquals("", prepareGeoserverLogin(null, null));
    }
}
