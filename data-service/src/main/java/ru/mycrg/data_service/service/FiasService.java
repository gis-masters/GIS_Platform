package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.FiasDao;
import ru.mycrg.data_service.dto.FullAddressDto;
import ru.mycrg.data_service.dto.LocalityDto;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.parsers.XmlFiasParser;

import java.io.File;
import java.util.Arrays;
import java.util.List;

@Service
public class FiasService {

    private final Logger log = LoggerFactory.getLogger(FiasService.class);

    private final XmlFiasParser fiasParser;
    private final FiasDao fiasDao;

    public FiasService(XmlFiasParser fiasParser,
                       FiasDao fiasDao) {
        this.fiasParser = fiasParser;
        this.fiasDao = fiasDao;
    }

    public void loadFiasDataToDB(String folderPath) {
        File xmlFile = new File(folderPath);

        if (xmlFile.isDirectory()) {
            File[] files = xmlFile.listFiles();
            if (files != null && files.length != 0) {

                List<File> fileNames = Arrays.asList(files);

                fileNames.forEach(file -> fiasParser.parseAndWriteData(file, fiasDao));
            }
        } else {
            String msg = "Переданный аргумент не является директорией.";
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    public void truncateFiasData() {
        try {
            fiasDao.truncateFiasData();
        } catch (DataAccessException e) {
            String message =
                    "SQL запрос для очистки базы данных ФИАС не может быть выполнен. Причина: " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }

    public void generateFullAddressesAndSave() {
        try {
            fiasDao.generateFullAddressesAndSave();
        } catch (DataAccessException e) {
            String message =
                    "SQL запрос для генерации полных адресов ФИАС не может быть выполнен. Причина: " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }

    public void generateLocalityData() {
        try {
            fiasDao.generateLocalityData();
        } catch (DataAccessException e) {
            String message =
                    "SQL запрос для генерации ОКТМО для населенного пункта не может быть выполнен. Причина: " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }

    public List<FullAddressDto> getAddresses(String address) {
        try {
            return fiasDao.getAddresses(address);
        } catch (DataAccessException e) {
            String message =
                    "SQL запрос для поиска адреса по базе данных ФИАС не может быть выполнен. Причина: " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }

    public List<FullAddressDto> getAddressesByCompleteMatch(String address) {
        try {
            return fiasDao.getAddressesByCompleteMatch(address);
        } catch (DataAccessException e) {
            String message = "SQL запрос для поиска адреса по базе данных ФИАС не может быть выполнен. Причина: " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }

    public List<LocalityDto> getLocalities(String address) {
        try {
            return fiasDao.getLocalities(address);
        } catch (DataAccessException e) {
            String message =
                    "SQL запрос для поиска населённого пункта по базе данных ФИАС не может быть выполнен. Причина: " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }
}
