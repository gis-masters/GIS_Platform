package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.controller.ProjectController;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.exceptions.EntityCreationException;
import ru.mycrg.gis.queue.IMqEvents;
import ru.mycrg.gis.repository.ProjectRepository;
import ru.mycrg.gis.util.Translit;

import java.util.Optional;

@Service
public class ProjectService {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final IMqEvents mqEvents;
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository, IMqEvents mqEvents) {
        this.projectRepository = projectRepository;
        this.mqEvents = mqEvents;
    }

    public Iterable<Project> getAll() {
        return projectRepository.findAll();
    }

    /**
     * Создаем проект у нас.
     * Отправляем задание в очередь на создание проекта на геосервере.
     *
     * @param name Название проекта (человеческое)
     * @return нашу сущность проекта  {@link Project}
     */
    public Project create(String name) {
        log.debug("Create project: {}", name);

        // Имя под которым будет создан workspace на геосервере
        String geoserverName = Translit.doIt(name);

        Optional<Project> projectByName = projectRepository.findByGeoserverName(geoserverName);
        if (projectByName.isPresent()) {
            throw new EntityCreationException("Проект с таким именем уже существует");
        } else {
            return projectRepository.save(new Project(name, geoserverName));
        }
    }

    public void delete(long id) {

    }
}
