package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.repository.PrincipalRepository;

import javax.transaction.Transactional;

@Service
@Transactional
public class PrincipalService {

    private final PrincipalRepository principalRepository;

    public PrincipalService(PrincipalRepository principalRepository) {
        this.principalRepository = principalRepository;
    }

    /**
     * Return exist Principal or create new one.
     *
     * @param identifier Principal identifier
     * @param type       Principal type
     */
    @NotNull
    public Principal get(Long identifier, String type) {
        return principalRepository
                .findByIdentifierAndAndType(identifier, type)
                .orElseGet(() -> principalRepository.save(new Principal(identifier, type)));
    }

    /**
     * No reason to hold the principal record without assigned permissions.
     *
     * @param principal Principal entity
     */
    public void deleteIfNoPermissions(Principal principal) {
        if (principal.getPermissions().isEmpty()) {
            principalRepository.delete(principal);
        }
    }
}
