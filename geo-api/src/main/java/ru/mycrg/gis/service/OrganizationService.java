package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mycrg.common.OrgMqResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.gis.dto.OrganizationCreateDto;
import ru.mycrg.gis.dto.OrganizationUpdateDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.exceptions.CustomRestExceptionHandler;
import ru.mycrg.gis.repository.OrganizationRepository;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.Optional;

/**
 * CRUD сервис для работы с Организациями.
 */
@Service
@Transactional
public class OrganizationService {

    private static Logger log = LoggerFactory.getLogger(OrganizationService.class);

    private final UserRepository userRepository;
    private final ProcessRepository processRepository;
    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository,
                               ProcessRepository processRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.processRepository = processRepository;
    }

    public Iterable<Organization> findAll() {
        return organizationRepository.findAll();
    }

    public Iterable<Organization> findAll(Pageable pageable) {
        return organizationRepository.findAll(pageable);
    }

    public Organization getOrganizationByUserName(String userName) {
        Optional<User> user = userRepository.findUserByUsername(userName);
        if (user.isPresent()) {
            return organizationRepository
                    .findOrganizationByUsersContaining(user.get())
                    .orElseThrow(() -> new CrgNotFoundException("Не удалось найти организацию для: " + userName));
        } else {
            log.warn("Not found user: {}", userName);

            throw new CrgNotFoundException("Not found user: " + userName);
        }
    }

    /**
     * Создание организации.
     * <p>
     * Вместе с организацией создается первоначальный пользователь (супер админ).
     *
     * @param organizationCreateDto {@link OrganizationCreateDto}
     * @return {@link Organization}
     */
    public Organization create(@Valid OrganizationCreateDto organizationCreateDto) {
        Organization newOrganization;

        User newUser = userRepository.save(mapDtoToUser(organizationCreateDto));

        newOrganization = mapDtoToOrganization(organizationCreateDto);
        newOrganization.addUser(newUser);

        organizationRepository.save(newOrganization);
        // We use email as login
        newUser.setUsername(organizationCreateDto.getEmail());
        newUser.addAuthority("GEOSERVER_ADMIN");

        return newOrganization;
    }

    public void save(Organization organization) {
        organizationRepository.save(organization);
    }

    /**
     * Обновление организации.
     * <p>
     * Перед обновлением проверяется что сущность существует.
     *
     * @param id              Идентификатор организации.
     * @param organizationDto {@link OrganizationUpdateDto}
     * @return Обновленная сущность {@link Organization}
     */
    public Organization update(Long id, OrganizationUpdateDto organizationDto) {
        Organization foundedOrganization = findById(id);
        foundedOrganization.setName(organizationDto.getName());
        foundedOrganization.setPhone(organizationDto.getPhone());

        return organizationRepository.save(foundedOrganization);
    }

    /**
     * Поиск организации по идентификатору.
     *
     * @param id Идентификатор организации.
     * @return {@link Organization}
     * @throws CrgNotFoundException Обрабатывать это исключение не нужно.
*                                   Даное исключение обрабатывает {@link CustomRestExceptionHandler @ExceptionHandler}
     */
    public Organization findById(long id) throws CrgNotFoundException {
        return organizationRepository
                .findById(id)
                .orElseThrow(() -> new CrgNotFoundException("Не найдена организация с id: " + id));
    }

    /**
     * Удаление организации.
     * <p>
     * Перед удалением проверяется что сущность существует.
     * <b>Организация удаляется вместе с пользователем с которым она была создана.</b>
     * <br>По стратегии "CascadeType.REMOVE" определенной в {@link Organization}
     *
     * @param id Идентификатор
     */
    public void deleteById(long id) {
        findById(id);

        organizationRepository.deleteById(id);
    }

    public void handleMqResponse(OrgMqResponse response) {
        log.debug("Mq response. Organization: {}", response.getOrgId());

        Organization organization = organizationRepository
                .findById(response.getOrgId())
                .orElseThrow(() -> new EntityNotFoundException("Not found organization by id: " + response.getOrgId()));

        if (ProcessStatus.DONE.equals(response.getStatus())) {
            organization.setStatus(ProcessStatus.DONE);
            organizationRepository.save(organization);

            User orgAdmin = organization.getUsers().get(0);
            orgAdmin.setEnabled(true);
            userRepository.save(orgAdmin);

            log.info("Organization with user successfully created");
        } else {
            log.error("Error creation organization: {}", response.getOrgId());

            // Удаляем орг. и пользователя который был создан как админ для неё.
            User orgAdmin = organization.getUsers().get(0);
            userRepository.delete(orgAdmin);
            organizationRepository.delete(organization);
        }
    }

    private Organization mapDtoToOrganization(OrganizationCreateDto dto) {
        return new Organization(dto.getName(), dto.getPhone());
    }

    private User mapDtoToUser(OrganizationCreateDto dto) {
        BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

        return
            new User(
                bCrypt.encode(dto.getPassword()),
                dto.getUserName(),
                dto.getUserSurName(),
                dto.getEmail()
            );
    }

    public Process getProcessById(long processId) {
        return processRepository
                .findById(processId)
                .orElseThrow(() -> new CrgNotFoundException("Не найден процесс: " + processId));
    }
}
