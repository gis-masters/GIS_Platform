package ru.mycrg.data_service.service.document_library;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;

@Component
public class RecordServiceFactory {

    private final UserRecordsService recordsService;
    private final OwnerRecordsService ownerRecordsService;
    private final IAuthenticationFacade authenticationFacade;

    public RecordServiceFactory(UserRecordsService recordsService,
                                OwnerRecordsService ownerRecordsService,
                                IAuthenticationFacade authenticationFacade) {
        this.recordsService = recordsService;
        this.ownerRecordsService = ownerRecordsService;
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * Предоставляет реализацию согласно правам пользователя.
     * <p>
     * Владелец организации должен иметь безусловный доступ.
     *
     * @return {@link IRecordsService}
     */
    public IRecordsService get() {
        if (authenticationFacade.isOrganizationAdmin()) {
            return ownerRecordsService;
        }

        return recordsService;
    }
}
