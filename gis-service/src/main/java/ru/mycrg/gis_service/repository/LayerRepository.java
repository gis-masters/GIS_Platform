package ru.mycrg.gis_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "layers", path = "layers", exported = false)
public interface LayerRepository extends PagingAndSortingRepository<Layer, Long> {

    Optional<Layer> findByInternalNameAndProject(String internalName, Project project);

    @Modifying
    @Query("DELETE FROM Layer l where l.id = :layerId")
    void deleteLayerById(@Param("layerId") Long layerId);

}
