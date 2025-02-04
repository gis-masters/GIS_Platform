package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.detached.AisUmsDao;
import ru.mycrg.data_service.dto.AisUmsModel;
import ru.mycrg.data_service.entity.AisUms;
import ru.mycrg.data_service.entity.IntegrationTokens;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.repository.AisUmsRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AisUmsService {

    private final Logger log = LoggerFactory.getLogger(AisUmsService.class);

    private final AisUmsRepository aisUmsRepository;
    private final IntegrationTokensService integrationTokensService;
    private final AisUmsDao aisUmsDao;

    public AisUmsService(AisUmsRepository aisUmsRepository,
                         IntegrationTokensService integrationTokensService,
                         AisUmsDao aisUmsDao) {
        this.aisUmsRepository = aisUmsRepository;
        this.integrationTokensService = integrationTokensService;
        this.aisUmsDao = aisUmsDao;
    }

    public Page<AisUms> getAll(Pageable pageable) {
        return aisUmsRepository.findAll(pageable);
    }

    public List<AisUms> saveAisUms(AisUmsModel aisUmsModel) {
        log.debug("Request create aisUms, total: {}", aisUmsModel.getContent().size());

        List<AisUms> aisUms = aisUmsModel.getContent().stream()
                                         .map(AisUms::new)
                                         .collect(Collectors.toList());
        aisUmsRepository.saveAll(aisUms);

        return aisUms;
    }

    // Обновляем данные в таблицах конкретного датасета - "СТП Крыма" - workspace_789
    // Слои из "СТП Крыма" подключены в остальные проекты
    public void updateAisUmsColumnsInStpDataset(List<AisUms> aisUmsData) {
        String datasetName = "workspace_789";
        List<String> schemasName = Arrays.asList("oks_constructions",
                                                 "oks_constructions_polyline",
                                                 "oks_polyline_pro",
                                                 "zu_pro",
                                                 "oks_constructions_points",
                                                 "oks_pro");
        try {
            List<String> allTablesNameBySchemas = aisUmsDao.getAllTablesNameBySchemas(datasetName, schemasName);
            log.debug("allTablesNameBySchemas: {}", allTablesNameBySchemas);

            allTablesNameBySchemas.stream()
                                  .map(tableName -> new ResourceQualifier(datasetName, tableName))
                                  .forEach(tQualifier -> aisUmsDao.updateTable(tQualifier, aisUmsData));
        } catch (DataAccessException ex) {
            String msg = String.format("Не удалось выполнить обновление данных из АИС УМС. Причина: %s",
                                       ex.getMessage());
            log.debug(msg);

            throw new DataServiceException(msg);
        }
    }

    @Transactional
    public void cleanDuplicate() {
        List<AisUms> allAisUms = new ArrayList<>();
        Iterable<AisUms> allAisUmsIter = aisUmsRepository.findAll(Sort.by("cadNum", "createdAt"));
        allAisUmsIter.forEach(allAisUms::add);
        Set<Long> idForDeleting = initIdsForDeleting(allAisUms);

        aisUmsRepository.removeByIdIn(idForDeleting);
    }

    public String getTokenAisUms() {
        Optional<IntegrationTokens> oIntegrationAisUms = integrationTokensService.getByServiceName("ais_ums");
        if (oIntegrationAisUms.isEmpty()) {
            throw new DataServiceException("Не найдена информация об интеграции с сервисом: ais_ums");
        }

        return oIntegrationAisUms.get().getToken();
    }

    @Transactional
    public void deleteAllByDepName(String departmentName) {
        aisUmsRepository.removeByDepartmentName(departmentName);
    }

    private Set<Long> initIdsForDeleting(List<AisUms> aisUms) {
        Set<Long> idForDeleting = new HashSet<>();

        for (int i = 0; i < aisUms.size(); ) {
            String cadNum = aisUms.get(i).getCadNum();
            List<AisUms> aisUmsSameCadNums = aisUms.stream()
                                                   .filter(aisUm -> cadNum.equals(aisUm.getCadNum()))
                                                   .collect(Collectors.toList());

            if (aisUmsSameCadNums.size() > 1) {
                for (int j = 0; j < aisUmsSameCadNums.size() - 1; j++) {
                    idForDeleting.add(aisUmsSameCadNums.get(j).getId());
                }
            }

            i += aisUmsSameCadNums.size();
        }

        return idForDeleting;
    }
}
