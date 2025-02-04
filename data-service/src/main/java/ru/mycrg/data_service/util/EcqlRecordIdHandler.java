package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.text.MessageFormat;
import java.util.List;

public class EcqlRecordIdHandler {

    private EcqlRecordIdHandler() {
        throw new IllegalStateException("Utility class");
    }

    @NotNull
    public static String joinAsIn(@Nullable String ecqlFilter, @Nullable List<Long> recordIds) {
        boolean idsNotSet = recordIds == null || recordIds.isEmpty();
        boolean ecqlFilterNotSet = ecqlFilter == null || ecqlFilter.isBlank();

        if (idsNotSet && ecqlFilterNotSet) {
            return "";
        } else if (idsNotSet) {
            return ecqlFilter;
        }

        String primaryKey = SystemLibraryAttributes.ID.getName();
        String joinedIds = StringUtil.join(recordIds);

        if (ecqlFilterNotSet) {
            return MessageFormat.format("(\"{0}\" IN({1}))", primaryKey, joinedIds);
        }

        return MessageFormat.format("({0} AND (\"{1}\" IN({2})))", ecqlFilter, primaryKey, joinedIds);
    }
}
