package ru.mycrg.common_utils.security;

import java.util.Optional;
import java.util.Set;

/**
 * This default implementation a role hierarchy.
 */
public class DefaultRoleHierarchy implements RoleHierarchy {

    private final String[] hierarchy;

    public DefaultRoleHierarchy(String[] hierarchy) {
        this.hierarchy = hierarchy;
    }

    @Override
    public Optional<String> defineBest(Set<String> roles) {
        for (String role: hierarchy) {
            if (roles.contains(role)) {
                return Optional.ofNullable(role);
            }
        }

        return Optional.empty();
    }
}
