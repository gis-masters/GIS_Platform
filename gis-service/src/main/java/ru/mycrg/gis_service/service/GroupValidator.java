package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.gis_service.entity.Group;

import java.util.List;

public class GroupValidator {

    private GroupValidator() {
        throw new IllegalStateException("Utility class");
    }

    @Contract(pure = false, mutates = "param2")
    public static boolean isInvalidGroupRelation(@NotNull Group group, List<Group> groups) {
        if (group.getId() != null && group.getId().equals(group.getParentId())) {
            return true;
        }

        if (group.getParentId() == null) {
            return false;
        }

        Group parentGroup = getGroupById(groups, group.getParentId());
        if (parentGroup == null) {
            return true;
        }

        return isLoopExist(group, groups);
    }

    private static boolean isLoopExist(Group initialGroup, List<Group> groups) {
        Group group = getGroupById(groups, initialGroup.getId());
        if (group != null) {
            // Если парент переписывается у существующей группы то заменим его и протестируем
            group.setParentId(initialGroup.getParentId());
        }

        Group currentGroup = initialGroup;
        while (true) {
            if (currentGroup.getParentId() == null) {
                // Это рут группа - нет зацикливания
                return false;
            }

            if (currentGroup.getParentId().equals(initialGroup.getId())) {
                return true;
            }

            Group parentGroup = getGroupById(groups, currentGroup.getParentId());
            if (parentGroup != null) {
                if (parentGroup.equals(initialGroup)) {
                    return true;
                }

                currentGroup = parentGroup;
            } else {
                return true;
            }
        }
    }

    private static Group getGroupById(List<Group> groups, Long id) {
        return groups.stream()
                .filter(g -> g.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
