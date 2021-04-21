package ru.mycrg.common_utils.security;

import java.util.Optional;
import java.util.Set;

/**
 * The simple interface of a role hierarchy.
 */
public interface RoleHierarchy {

    /**
     * Returns a best role of all users roles.
     * <p>
     * Example:
     * <p>
     * For role hierarchy: ROLE_A &gt; ROLE_B &gt; ROLE_C and input users roles: ROLE_B, ROLE_C the best is: ROLE_B
     * <p>
     * And for role hierarchy: ROLE_C &gt; ROLE_B &gt; ROLE_A and input users roles: ROLE_B, ROLE_C the best is: ROLE_C
     *
     * @param roles user roles
     *
     * @return best role
     */
    Optional<String> defineBest(Set<String> roles);
}
