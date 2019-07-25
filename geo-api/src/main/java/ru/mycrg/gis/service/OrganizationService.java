package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.dto.OrganizationCreateDto;
import ru.mycrg.gis.dto.OrganizationUpdateDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.exceptions.CrgConflictException;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.exceptions.CustomRestExceptionHandler;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.OrganizationRepository;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.Optional;

import static ru.mycrg.common.enums.ProcessStatus.*;

/**
 * CRUD сервис для работы с Организациями.
 */
@Service
@Transactional
public class OrganizationService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(OrganizationService.class);

    private final MqSender mqSender;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository,
                               MqSender mqSender,
                               ProcessRepository processRepository) {
        super(processRepository);

        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.mqSender = mqSender;
    }

    public boolean isUserExistByName(long orgId, String userName) {
        return getOrganizationByUserName(userName).getId() == orgId;
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
     * @param createDto {@link OrganizationCreateDto}
     * @return {@link Organization}
     */
    public Organization createOrg(@Valid OrganizationCreateDto createDto) {
        Optional<User> userByEmail = userRepository.findUserByEmail(createDto.getEmail());
        if (userByEmail.isPresent()) {
            throw new CrgConflictException("Данный email уже занят");
        }

        Organization newOrganization;

        User newUser = userRepository.save(mapDtoToUser(createDto));

        newOrganization = mapDtoToOrganization(createDto);
        newOrganization.addUser(newUser);

        organizationRepository.save(newOrganization);
        // We use email as login
        newUser.setUsername(createDto.getEmail());
        newUser.addAuthority("GEOSERVER_ADMIN");

        Process process = create(
                "",
                String.format("Создание организации: %s", createDto.getName()),
                ProcessType.CREATE_ORG);

        OrgMqProcessRequest payload = new OrgMqProcessRequest(newOrganization.getId(),
                createDto.getEmail(),
                createDto.getPassword());

        mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.CREATE_ORG, payload));

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

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse: {}", mqResponse.toString());
        }

        Long orgId = Long.parseLong(mqResponse.getPayload().toString());
        log.debug("Mq mqResponse. Organization: {}", orgId);

        Organization organization = organizationRepository
                .findById(orgId)
                .orElseThrow(() -> new EntityNotFoundException("Not found organization by id: " + orgId));

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case ERROR:     {
                log.error("Error creation organization: {}", orgId);

                // Удаляем орг. и пользователя который был создан как админ для неё.
                User orgAdmin = organization.getUsers().get(0);
                userRepository.delete(orgAdmin);
                organizationRepository.delete(organization);

                error(process, mqResponse.getError());
            }       break;
            case DONE:      {
                organization.setStatus(DONE);
                organizationRepository.save(organization);

                User orgAdmin = organization.getUsers().get(0);
                orgAdmin.setEnabled(true);
                userRepository.save(orgAdmin);

                log.info("Organization with user successfully created");

                complete(process, mqResponse.getPayload());
            }  break;
            default:
                log.warn("Not supported process status. {}", process.getStatus());
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
}
