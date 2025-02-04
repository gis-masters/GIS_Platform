package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.repository.PrincipalRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrincipalService {

    private final IAuthenticationFacade authenticationFacade;
    private final PrincipalRepository principalRepository;

    public PrincipalService(IAuthenticationFacade authenticationFacade,
                            PrincipalRepository principalRepository) {
        this.authenticationFacade = authenticationFacade;
        this.principalRepository = principalRepository;
    }

    /**
     * Возвращает все сущности {@link Principal} относящиеся к пользователю.
     * <p>
     * Это могут быть как относящиеся непосредственно к пользователю по его идентификатору так и записи относительно
     * групп в которых пользователь состоит
     *
     * @return список сущностей относящихся к пользователю
     */
    public List<Principal> getAll() {
        List<Principal> allPrincipalIds = new ArrayList<>();

        UserDetails userDetails = authenticationFacade.getUserDetails();

        principalRepository.findByIdentifierAndType(userDetails.getUserId(), "user")
                           .ifPresent(allPrincipalIds::add);
        userDetails.getGroups()
                   .forEach(groupId -> {
                       principalRepository.findByIdentifierAndType(groupId, "group")
                                          .ifPresent(allPrincipalIds::add);
                   });

        return allPrincipalIds;
    }

    public void deleteByIdentifierAndType(String type, Long identifier) {
        principalRepository.findByIdentifierAndType(identifier, type)
                           .ifPresent(oPrincipal -> principalRepository.deleteById(oPrincipal.getId()));
    }

    /**
     * Возвращает все идентификаторы относящиеся к пользователю.
     * <p>
     * Это могут быть как относящиеся непосредственно к пользователю по его идентификатору так и записи относительно
     * групп в которых пользователь состоит
     *
     * @return список идентификаторов относящихся к пользователю
     */
    public List<String> getAllIds() {
        return getAll().stream()
                       .map(aclPrincipal -> String.valueOf(aclPrincipal.getId()))
                       .collect(Collectors.toList());
    }

    @NotNull
    public Principal getOrCreate(Long id, String type) {
        Optional<Principal> oPrincipal = principalRepository.findByIdentifierAndType(id, type);
        if (oPrincipal.isEmpty()) {
            return principalRepository.save(new Principal(id, type));
        } else {
            return oPrincipal.get();
        }
    }
}
