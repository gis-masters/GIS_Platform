package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.util.StringUtil.join;

@Component
public class TaskProtector implements IResourceProtector {

    private final BaseReadDao baseDao;
    private final IAuthenticationFacade authenticationFacade;

    public TaskProtector(BaseReadDao baseDao,
                         IAuthenticationFacade authenticationFacade) {
        this.baseDao = baseDao;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier qualifier) {
        baseDao.findById(qualifier)
               .orElseThrow(() -> new NotFoundException("Не найдена задача по id:" + qualifier.getQualifier()));
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier qualifier) {
        Optional<IRecord> task = baseDao.findById(qualifier);
        if (task.isPresent()) {
            throw new ConflictException("Задача " + qualifier + " уже существует");
        }
    }

    @Override
    public boolean isOwner(ResourceQualifier qualifier) {
        return this.isAllowed(qualifier);
    }

    @Override
    public boolean isAllowed(ResourceQualifier qualifier) {
        String filter = "";
        if (!authenticationFacade.isOrganizationAdmin()) {
            filter = buildFilterAssignedToMe(qualifier.getRecordIdAsLong().toString());
        }

        Long total = baseDao.total(qualifier, filter);

        return total.intValue() > 0;
    }

    @Override
    public boolean isEditAllowed(ResourceQualifier qualifier) {
        return this.isAllowed(qualifier);
    }

    @Override
    public ResourceType getType() {
        return TASK;
    }

    private String buildFilterAssignedToMe(String taskId) {
        List<Long> minionIds = authenticationFacade.getUserDetails().getAllMinions();
        Long userId = authenticationFacade.getUserDetails().getUserId();
        minionIds.add(userId);
        String joined = join(minionIds, ", ");

        return String.format("(owner_id IN (%s) OR assigned_to IN (%s)) AND \"id\" IN ('%s')", joined, userId, taskId);
    }
}
