package ru.mycrg.gis_service.service.projects;

import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.exceptions.BadRequestException;

public interface IProjectMover {

    void move(Long movedItemId, Long targetFolderId);

    default String getSelfPath(ProjectProjectionImpl item) {
        return item.getPath() == null
                ? "/" + item.getId()
                : item.getPath() + "/" + item.getId();
    }

    default void throwIfTargetNotAFolder(ProjectProjectionImpl item) {
        if (!item.isFolder()) {
            throw new BadRequestException("Указанный проект не является папкой");
        }
    }
}
