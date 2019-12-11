package ru.mycrg.gis.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.repository.ProcessRepository;

import javax.validation.constraints.NotNull;
import java.security.Principal;

@Service
@Transactional
public class ProcessService {

    private final ProcessRepository processRepository;

    public ProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    @NotNull
    public Process findById(long id) {
        return processRepository
                .findById(id)
                .orElseThrow(() -> new CrgNotFoundException("Not found process with id: " + id));
    }

    /**
     * Возвращает страницу {@link Page} сущностей {@link Process} соответствующих ограничениям пользовательских прав,
     * представленных обьектом {@code Principal}; а также пейджингом, который предусмотрен в объекте {@code Pageable}.
     *
     * @param pageable  Pagination information
     * @param principal User claims
     * @return a page of entities
     */
    public Page<Process> findAll(Pageable pageable, Principal principal) {
        return processRepository.findAllByUserName(principal.getName(), pageable);
    }

    public boolean isUserOwnProcess(String userName, long id) {
        return userName.equals(findById(id).getUserName());
    }
}
