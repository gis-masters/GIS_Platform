package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.exceptions.BadRequestException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class RoleHandler {

    private static final Map<String, Long> roles = new HashMap<>() {{
        put(Roles.VIEWER.name(), 10L);
        put(Roles.CONTRIBUTOR.name(), 20L);
        put(Roles.OWNER.name(), 30L);
    }};

    public static Optional<String> defineRoleById(Long id) {
        for (Map.Entry<String, Long> entry: roles.entrySet()) {
            Long value = entry.getValue();
            if (value.equals(id)) {
                return Optional.ofNullable(entry.getKey());
            }
        }

        return Optional.empty();
    }

    public static Long defineIdByRole(@NotNull String role) {
        return Optional.of(roles.get(role))
                       .orElseThrow(() -> new BadRequestException("Not exist role: " + role));
    }
}
