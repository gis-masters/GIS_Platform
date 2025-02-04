package ru.mycrg.data_service.service.cqrs.specialization.requests;

import ru.mycrg.common_contracts.generated.specialization.TableContentModel;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

public class InitSpecializationRequest implements IRequest<Voidy> {

    private final Integer specializationId;
    private final TableContentModel tableContentModel;

    public InitSpecializationRequest(Integer specializationId, TableContentModel tableContentModel) {
        this.specializationId = specializationId;
        this.tableContentModel = tableContentModel;
    }

    @Override
    public String getType() {
        return InitSpecializationRequest.class.getSimpleName();
    }

    public Integer getSpecializationId() {
        return specializationId;
    }

    public TableContentModel getTableContentModel() {
        return tableContentModel;
    }
}
