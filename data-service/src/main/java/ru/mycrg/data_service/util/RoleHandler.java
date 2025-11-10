package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.common_contracts.enums.Roles;
import ru.mycrg.data_service.exceptions.BadRequestException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class RoleHandler {

    private static final Map<String, Long> roles;

    static {
        roles = new HashMap<>();
        roles.put(Roles.VIEWER.name(), 10L);
        roles.put(Roles.CONTRIBUTOR.name(), 20L);
        roles.put(Roles.OWNER.name(), 30L);
    }

    private RoleHandler() {
        throw new IllegalStateException("Utility class");
    }

    public static Optional<Roles> defineRoleById(Long id) {
        for (Map.Entry<String, Long> entry: roles.entrySet()) {
            Long value = entry.getValue();
            if (value.equals(id)) {
                return Optional.of(Roles.valueOf(entry.getKey()));
            }
        }

        return Optional.empty();
    }

    public static Long defineIdByRole(@NotNull String role) {
        return Optional.of(roles.get(role))
                       .orElseThrow(() -> new BadRequestException("Not exist role: " + role));
    }
}
