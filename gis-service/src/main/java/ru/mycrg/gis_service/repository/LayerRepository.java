package ru.mycrg.gis_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.List;
import java.util.Set;

@RepositoryRestResource(collectionResourceRel = "layers", path = "layers", exported = false)
public interface LayerRepository extends PagingAndSortingRepository<Layer, Long> {

    @Query(value = "SELECT DISTINCT ON (table_name) id," +
            "    title," +
            "    table_name," +
            "    enabled," +
            "    position," +
            "    transparency," +
            "    max_zoom," +
            "    min_zoom," +
            "    style_name," +
            "    native_crs," +
            "    data_store_name," +
            "    created_at," +
            "    last_modified," +
            "    project_id," +
            "    parent_id," +
            "    data_source_uri," +
            "    type," +
            "    dataset," +
            "    library_id," +
            "    record_id" +
            "  FROM layers" +
            "  WHERE type = :type" +
            "    AND project_id IN :projectIds",
           countQuery = "SELECT count(DISTINCT table_name) FROM layers WHERE type = :type AND project_id IN :projectIds",
           nativeQuery = true)
    Page<Layer> findUniqueLayers(String type, Set<Long> projectIds, Pageable pageable);

    @Query("FROM Layer l WHERE l.tableName = :tableName AND l.project.id IN :projectIds")
    List<Layer> findRelatedByTableName(@Param("tableName") String tableName, Set<Long> projectIds);

    @Query("FROM Layer l WHERE l.tableName like %:fileId% AND l.project.id IN :projectIds")
    List<Layer> findRelatedByFileId(@Param("fileId") String fileId, Set<Long> projectIds);

    @Query("FROM Layer l WHERE l.dataset = :datasetId AND l.project.id IN :projectIds")
    List<Layer> findRelatedByDataset(@Param("datasetId") String datasetId, Set<Long> projectIds);

    @Modifying
    @Query("DELETE FROM Layer l where l.id = :layerId")
    void deleteLayerById(@Param("layerId") Long layerId);

    void deleteByTableName(String tableName);

    boolean existsByProjectAndTableNameAndNativeCRS(Project project, String tableName, String nativeCrs);

    List<Layer> findByTableNameAndNativeCRS(String tableName, String nativeCrs);

    List<Layer> findByNativeCRS(String nativeCrs);
}
