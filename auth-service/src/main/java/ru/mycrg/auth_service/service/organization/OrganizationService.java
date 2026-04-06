package ru.mycrg.auth_service.service.organization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.dto.OrganizationFullProjection;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.exceptions.ForbiddenException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.dto.OrganizationUpdateDto;
import ru.mycrg.auth_service_contract.events.request.OrganizationRemovedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import jakarta.validation.Valid;
import java.util.List;

import static java.time.LocalDateTime.now;
import static java.util.stream.Collectors.toList;
import static ru.mycrg.auth_service.service.organization.OrganizationStatus.DELETING;
import static ru.mycrg.auth_service.service.organization.OrganizationStatus.PROVISIONED;

@Service
@Transactional
public class OrganizationService {

    private final Logger log = LoggerFactory.getLogger(OrganizationService.class);

    private final IMessageBusProducer messageBus;
    private final ProjectionFactory projectionFactory;
    private final IAuthenticationFacade authenticationFacade;
    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository,
                               IMessageBusProducer messageBus,
                               ProjectionFactory projectionFactory,
                               IAuthenticationFacade authenticationFacade) {
        this.organizationRepository = organizationRepository;
        this.authenticationFacade = authenticationFacade;
        this.projectionFactory = projectionFactory;
        this.messageBus = messageBus;
    }

    public Page<OrganizationFullProjection> getPaged(Pageable pageable) {
        return organizationRepository
                .findAll(pageable)
                .map(org -> projectionFactory.createProjection(OrganizationFullProjection.class, org));
    }

    public OrganizationFullProjection findById(Long orgId) {
        return projectionFactory.createProjection(OrganizationFullProjection.class, getById(orgId));
    }

    public OrganizationFullProjection update(@Valid OrganizationUpdateDto updateDto, Long id) {
        Organization existingOrganization = getById(id);
        log.debug("Найдена организация для обновления: {}", existingOrganization.getName());

        if (updateDto.getName() != null && !updateDto.getName().isEmpty()) {
            existingOrganization.setName(updateDto.getName());
        }

        if (updateDto.getPhone() != null && !updateDto.getPhone().isEmpty()) {
            existingOrganization.setPhone(updateDto.getPhone());
        }

        if (updateDto.getDescription() != null) {
            existingOrganization.setDescription(
                    updateDto.getDescription().isEmpty() ? null : updateDto.getDescription());
        }

        // Обновляем время последнего изменения
        existingOrganization.setLastModified(now());

        // Сохраняем изменения
        Organization savedOrganization = organizationRepository.save(existingOrganization);
        log.info("Организация с ID: {} успешно обновлена", id);

        return projectionFactory.createProjection(OrganizationFullProjection.class, savedOrganization);
    }

    public void delete(Long orgId) {
        final Organization organization = getById(orgId);
        if (!PROVISIONED.toString().equals(organization.getStatus())) {
            throw new BadRequestException("The organization: " + orgId + ", is being processed");
        }

        organization.setStatus(DELETING.toString());
        organizationRepository.save(organization);

        final List<String> owners = organization.getUsers().stream()
                                                .filter(User::isOwner)
                                                .map(User::getGeoserverLogin)
                                                .collect(toList());

        messageBus.produce(
                new OrganizationRemovedEvent(orgId, authenticationFacade.getAccessToken(), owners));
    }

    private Organization getById(Long id) {
        if (authenticationFacade.isRoot() || id.equals(authenticationFacade.getOrganizationId())) {
            return organizationRepository.findById(id)
                                         .orElseThrow(() -> new NotFoundException(id));
        }

        throw new ForbiddenException("Нет доступа к организации: " + id);
    }
}
