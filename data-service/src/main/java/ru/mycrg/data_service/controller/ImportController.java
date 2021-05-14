package ru.mycrg.data_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.WorkImport;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.import_.ImportService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourceProtector;
import ru.mycrg.data_service.service.tables.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import javax.validation.Valid;

import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;

@RestController
public class ImportController extends BaseController {

    private final ImportService importService;
    private final TableService tableService;
    private final SchemaService schemaService;
    private final ResourceProtector resourceProtector;

    public ImportController(ImportService importService, TableService tableService,
                            SchemaService schemaService,
                            ResourceProtector resourceProtector) {
        this.importService = importService;
        this.tableService = tableService;
        this.schemaService = schemaService;
        this.resourceProtector = resourceProtector;
    }

    @PostMapping("/import/{projectId}")
    public ResponseEntity<Process> initImport(@PathVariable long projectId,
                                              @Valid @RequestBody WorkImport workImport) {
        Process process = importService.initProcess(projectId, workImport.getTargetSchema(), workImport);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/import/file")
    public ResponseEntity<Process> importXmlFileToDb(@RequestParam String datasetId,
                                                     @RequestParam String tableId,
                                                     @RequestParam("file") MultipartFile file) {

        if (!MediaType.APPLICATION_XML_VALUE.equals(file.getContentType())
                && !MediaType.TEXT_XML_VALUE.equals(file.getContentType())) {
            throw new BadRequestException("Type of file is not XML");
        }

        ResourceIdentifier table = new ResourceIdentifier(tableId, ResourceType.TABLE, datasetId, ResourceType.SCHEMA);

        IResourceModel resourceModel = tableService.getByIdentifier(table);

        resourceProtector.throwIfNotExist(table);

        SchemaDto schemaDto =
                schemaService.getSchemaByName(resourceModel.getSchemaId())
                             .orElseThrow(() -> new NotFoundException(SchemaDto.class, resourceModel.getSchemaId()));

        importService.importXmlToDB(file, schemaDto, table, extractCrsNumber(resourceModel.getCrs()));

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
