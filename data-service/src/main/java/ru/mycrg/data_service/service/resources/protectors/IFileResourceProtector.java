package ru.mycrg.data_service.service.resources.protectors;

import ru.mycrg.data_service.entity.File;

public interface IFileResourceProtector {

    boolean isOwner(File file);

    boolean isAllowed(File file);

    boolean isEditAllowed(File file);
}
