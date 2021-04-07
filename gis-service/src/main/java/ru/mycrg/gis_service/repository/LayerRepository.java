package ru.mycrg.gis_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RepositoryRestResource(collectionResourceRel = "layers", path = "layers", exported = false)
public interface LayerRepository extends PagingAndSortingRepository<Layer, Long> {

    Optional<Layer> findByTableNameAndProject(String tableName, Project project);

    @Query("FROM Layer l WHERE l.tableName = :tableName AND l.project.id IN :projectIds")
    List<Layer> findRelatedByTableName(@Param("tableName") String tableName, Set<Long> projectIds);

    @Query("FROM Layer l WHERE l.dataset = :datasetId AND l.project.id IN :projectIds")
    List<Layer> findRelatedByDataset(@Param("datasetId") String datasetId, Set<Long> projectIds);

    @Modifying
    @Query("DELETE FROM Layer l where l.id = :layerId")
    void deleteLayerById(@Param("layerId") Long layerId);

    void deleteByTableName(String tableName);
}
