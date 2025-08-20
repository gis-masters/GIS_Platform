package ru.mycrg.gis_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Project;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "projects", path = "projects")
public interface ProjectRepository extends PagingAndSortingRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE p.organizationId = :orgId " +
            "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "AND p.path IS NULL")
    Page<Project> findAllByRoot(@Param("orgId") Long orgId,
                                @Param("name") String name,
                                Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.organizationId = :orgId " +
            "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "AND LOWER(p.path) LIKE LOWER(CONCAT('%', :path))")
    Page<Project> findAllByPath(@Param("orgId") Long orgId,
                                @Param("name") String name,
                                @Param("path") String path,
                                Pageable pageable);

    List<Project> findAllByOrganizationId(Long orgId);

    Optional<Project> findByIdAndOrganizationId(Long id, Long organizationId);

    /**
     * Проверяет, есть ли проекты в указанной папке
     *
     * @param folderId идентификатор папки
     *
     * @return true, если в папке есть проекты, иначе false
     */
    @Query("SELECT COUNT(p) > 0 FROM Project p WHERE p.path LIKE CONCAT('%/', :folderId) OR p.path = CONCAT('/', :folderId)")
    boolean existsByPath(@Param("folderId") Long folderId);

    @Modifying
    @Query("UPDATE Project SET " +
            "   path = CASE WHEN id = :movedFolderId THEN NULL " +
            "               ELSE REPLACE(path, :movedFolderSelfPath, :newParentForChildren) END, " +
            "   lastModified = now() " +
            " WHERE id = :movedFolderId OR path LIKE CONCAT(:movedFolderSelfPath, '%')")
    void moveFolderToRoot(Long movedFolderId, String movedFolderSelfPath, String newParentForChildren);

    @Modifying
    @Query("UPDATE Project SET " +
            "   path = CASE WHEN id = :movedFolderId THEN :targetFolderSelfPath " +
            "               ELSE REPLACE(path, :movedFolderSelfPath, :newParentForChildren) END, " +
            "   lastModified = now()" +
            " WHERE id = :movedFolderId OR path LIKE CONCAT(:movedFolderSelfPath, '%')")
    void moveFolder(Long movedFolderId,
                    String movedFolderSelfPath,
                    String newParentForChildren,
                    String targetFolderSelfPath);

    void deleteAllByIdIn(List<Long> ids);
}
