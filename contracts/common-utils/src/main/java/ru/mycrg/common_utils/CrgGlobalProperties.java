package ru.mycrg.common_utils;

import org.jetbrains.annotations.NotNull;

import java.util.Optional;

public class CrgGlobalProperties {

    private static final String DEFAULT_DB_NAME = "database";
    private static final String SCRATCH_DB_PREFIX = "scratch";
    private static final String DEFAULT_PROJECT_NAME = "workspace";
    private static final String DEFAULT_STORE_POSTFIX = "store";
    private static final String DEFAULT_ROLE_NAME = "admin";
    private static final String SEPARATOR = "_";

    private CrgGlobalProperties() {
        throw new IllegalStateException("Utility class");
    }

    @NotNull
    public static String getDefaultDatabaseName() {
        return DEFAULT_DB_NAME;
    }

    @NotNull
    public static String getDefaultDatabaseName(Long orgId) {
        return DEFAULT_DB_NAME + SEPARATOR + orgId;
    }

    @NotNull
    public static String getDefaultDatabaseName(String orgId) {
        return DEFAULT_DB_NAME + SEPARATOR + orgId;
    }

    @NotNull
    public static String getScratchWorkspaceName(String dbName) {
        return SCRATCH_DB_PREFIX + SEPARATOR + dbName;
    }

    @NotNull
    public static String getScratchWorkspaceName(Long orgId) {
        return SCRATCH_DB_PREFIX + SEPARATOR + getDefaultDatabaseName(orgId);
    }

    @NotNull
    public static String getDefaultProjectName(Long projectId) {
        return DEFAULT_PROJECT_NAME + SEPARATOR + projectId;
    }

    @NotNull
    public static String getDefaultStoreName(String name) {
        return name + SEPARATOR + DEFAULT_STORE_POSTFIX;
    }

    @NotNull
    public static String getDefaultRoleName(Object orgId) {
        return DEFAULT_ROLE_NAME + SEPARATOR + orgId;
    }

    public static Optional<Long> extractIdFromDbName(@NotNull String dbName) {
        try {
            final String postfix = dbName.split(SEPARATOR)[1];

            return Optional.of(Long.parseLong(postfix));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
