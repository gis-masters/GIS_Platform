package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BadRequestException;

import java.util.Optional;

import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;

@Component
public class VectorLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(VectorLayerHandler.class);

    private final ILayerHandler baseLayerHandler;
    private final IAuthenticationFacade authenticationFacade;

    public VectorLayerHandler(BaseLayerHandler baseLayerHandler,
                              IAuthenticationFacade authenticationFacade) {
        this.baseLayerHandler = baseLayerHandler;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto dto) {
        log.debug("VectorLayerHandler create");

        if (dto.getDataStoreName() == null || dto.getDataStoreName().isBlank()) {
            Long orgId = authenticationFacade.getOrganizationId();
            if (orgId == -1) {
                throw new BadRequestException("Организация не определена. Укажите dataStoreName.");
            }

            dto.setDataStoreName(getScratchWorkspaceName(orgId));
        }

        return baseLayerHandler.create(project, dto);
    }

    @Override
    public String getType() {
        return "vector";
    }
}
