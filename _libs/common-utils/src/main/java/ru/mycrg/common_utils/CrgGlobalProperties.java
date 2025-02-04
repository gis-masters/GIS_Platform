package ru.mycrg.common_utils;

import org.jetbrains.annotations.NotNull;

import java.util.Optional;
import java.util.UUID;

import static java.util.Objects.nonNull;

public class CrgGlobalProperties {

    private static final String DEFAULT_DB_NAME = "database";
    private static final String SCRATCH_DB_PREFIX = "scratch";
    private static final String DEFAULT_PROJECT_NAME = "workspace";
    private static final String DEFAULT_ORGANIZATION_NAME = "organization";
    private static final String DEFAULT_STORE_POSTFIX = "store";
    private static final String DEFAULT_ROLE_NAME = "admin";
    private static final String DEFAULT_SCHEMA_PREFIX = "dataset";
    private static final String SEPARATOR = "_";
    private static final String DOUBLE_SEPARATOR = SEPARATOR + SEPARATOR;
    private static final String GEOSERVER_COMPLEX_NAME_SEPARATOR = ":";

    private CrgGlobalProperties() {
        throw new IllegalStateException("Utility class");
    }

    @NotNull
    public static String joinByDouble(String s1, String s2) {
        return s1 + DOUBLE_SEPARATOR + s2;
    }

    /**
     * Объединяет строки с использованием разделителя по-умолчанию: {@value #SEPARATOR}
     *
     * @param s1 Первая строка
     * @param s2 Вторая строка
     *
     * @return Результат: {s1} + {@value #SEPARATOR} + {s2}
     */
    @NotNull
    public static String join(String s1, String s2) {
        return s1 + SEPARATOR + s2;
    }

    @NotNull
    public static String join(String s1, String s2, String s3) {
        return s1 + SEPARATOR + s2 + SEPARATOR + s3;
    }

    @NotNull
    public static String buildGeoserverComplexLayerName(String workspace, String layerName) {
        return workspace + GEOSERVER_COMPLEX_NAME_SEPARATOR + layerName;
    }

    @NotNull
    public static String getDefaultDatabaseName() {
        return DEFAULT_DB_NAME;
    }

    @NotNull
    public static String getDefaultDatabaseName(Long orgId) {
        return join(DEFAULT_DB_NAME, orgId.toString());
    }

    @NotNull
    public static String getDefaultOrganizationName(Long orgId) {
        return join(DEFAULT_ORGANIZATION_NAME, orgId.toString());
    }

    @NotNull
    public static String getDefaultDatabaseName(String orgId) {
        return join(DEFAULT_DB_NAME, orgId);
    }

    @NotNull
    public static String getScratchWorkspaceName(String dbName) {
        return join(SCRATCH_DB_PREFIX, dbName);
    }

    @NotNull
    public static String getScratchWorkspaceName(Long orgId) {
        return join(SCRATCH_DB_PREFIX, getDefaultDatabaseName(orgId));
    }

    @NotNull
    public static String getDefaultProjectName(Long projectId) {
        return join(DEFAULT_PROJECT_NAME, projectId.toString());
    }

    @NotNull
    public static String getDefaultStoreName(String name) {
        return join(name, DEFAULT_STORE_POSTFIX);
    }

    @NotNull
    public static String buildStoreName(Long orgId,
                                        String fileType,
                                        String hash,
                                        String base) {
        String postfix = join(orgId.toString(), fileType, DEFAULT_STORE_POSTFIX);

        return postfix + DOUBLE_SEPARATOR + join(hash, base);
    }

    @NotNull
    public static String buildFeatureTypeName(String libraryId,
                                              Long recordId,
                                              UUID fileId) {
        String postfix = join(libraryId, String.valueOf(recordId));

        return postfix + DOUBLE_SEPARATOR + fileId.toString();
    }

    @NotNull
    public static String buildRasterStoreName(String body) {
        return join(DEFAULT_STORE_POSTFIX, body);
    }

    @NotNull
    public static String getDefaultRoleName(Object orgId) {
        return join(DEFAULT_ROLE_NAME, orgId.toString());
    }

    @NotNull
    public static String generateDatasetName() {
        return join(DEFAULT_SCHEMA_PREFIX, UUID.randomUUID().toString().substring(0, 6));
    }

    public static Optional<Long> extractIdFromDbName(@NotNull String dbName) {
        try {
            final String postfix = dbName.split(SEPARATOR)[1];

            return Optional.of(Long.parseLong(postfix));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public static String prepareGeoserverLogin(String userName, Long id) {
        if (nonNull(userName)) {
            String login = userName.replaceAll("[$&+,:;=?@#|'<>.^*()%!-]", "_");
            login = login.concat(SEPARATOR + id);

            return login;
        } else {
            return "";
        }
    }

    /**
     * Извлекаем название слоя из комплексного имени геосервера
     *
     * @param complexName Комплексное имя слоя на геосервере: scratch_database_1:layer_name_fr34__7829
     *
     * @return Название слоя или {@literal Optional.empty()} если не удалось успешно его получить
     */
    public static Optional<String> getLayerNameFromComplexName(String complexName) {
        if (complexName == null || complexName.isEmpty()) {
            return Optional.empty();
        }

        try {
            return Optional.of(complexName.split(GEOSERVER_COMPLEX_NAME_SEPARATOR)[1]);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Извлекаем название таблицы из названия слоя геосервера
     * <p>
     * Основано на шаблонах именования, применяемых нами при именовании таблиц и слоёв. Если таблица названа:
     * some_table_r314, то слой на геосервере будет назван: some_table_r314__7829 - т.е. к названию таблицы добавили
     * через разделитель код проекции(EPSG)
     *
     * @param geoserverLayerName Название слоя на геосервере
     *
     * @return Название таблицы или {@literal Optional.empty()} если не удалось успешно его получить
     */
    public static Optional<String> getTableNameFromGeoserverLayerName(String geoserverLayerName) {
        if (geoserverLayerName == null || geoserverLayerName.isEmpty()) {
            return Optional.empty();
        }

        try {
            return Optional.ofNullable(geoserverLayerName.split("__(\\d+)")[0]);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public static Optional<String> getTableNameFromComplexName(String complexName) {
        return getLayerNameFromComplexName(complexName)
                .flatMap(CrgGlobalProperties::getTableNameFromGeoserverLayerName);
    }
}
