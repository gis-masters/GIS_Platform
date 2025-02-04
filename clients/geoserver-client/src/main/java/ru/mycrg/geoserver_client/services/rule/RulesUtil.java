package ru.mycrg.geoserver_client.services.rule;

import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class RulesUtil {

    public static String buildRule(String workspace, String layer, GeoServerPermissions permission) {
        return String.join(".", workspace, layer, permission.getPermission());
    }

    public static String buildRule(String workspace, GeoServerPermissions permission) {
        return buildRule(workspace, "*", permission);
    }

    /**
     * Добавить роль к правилу доступа.
     * <p>
     * Examples:
     * "/**:POST,DELETE,PUT":"ROLE_ADMINISTRATOR,admin_workspace_1",
     * "/**:GET":"ROLE_ADMINISTRATOR,admin_workspace_1",
     * "scratch_workspace.*.a": "admin_2,admin_1"
     * @param oldRules Текущие правила
     * @param newRole Название роли
     * @param keyRule Ключевое правило, если указано, то работаем только с ним, если не указано то роль добавляется
     *                ко всем правилам.
     * @return Новая коллекция
     */
    public static Map<String, String> insertNewRole(Map<String, String> oldRules,
                                                    @NotNull String newRole,
                                                    String keyRule) {
        Map<String, String> newRules = new HashMap<>(oldRules);
        if (keyRule != null) {
            newRules.entrySet().forEach(item -> {
                if (keyRule.equals(item.getKey())) {
                    String oldRoles = item.getValue();

                    item.setValue(oldRoles + "," + newRole);
                }
            });
        } else {
            newRules.entrySet().forEach(item -> {
                String oldRoles = item.getValue();

                item.setValue(oldRoles + "," + newRole);
            });
        }

        return newRules;
    }

    public static Map<String, String> deleteRole(@NotNull Map<String, String> oldRules, String role) {
        Map<String, String> newRules = new HashMap<>();
        oldRules.forEach((key, value) -> {
            List<String> roles = new ArrayList<>(Arrays.asList(value.split(",")));
            roles.remove(role);

            newRules.put(key, String.join(",", roles));
        });

        return newRules;
    }

}
