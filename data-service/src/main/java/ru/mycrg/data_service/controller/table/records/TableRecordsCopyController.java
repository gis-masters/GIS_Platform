package ru.mycrg.data_service.controller.table.records;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.FeaturesCopyModel;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.cqrs.table_records.requests.CopyTableRecordsRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class TableRecordsCopyController {

    private final Mediator mediator;
    private final TableService tableService;
    private final ISchemaTemplateService schemaService;

    public TableRecordsCopyController(Mediator mediator, TableService tableService, ISchemaTemplateService schemaService) {
        this.mediator = mediator;
        this.tableService = tableService;
        this.schemaService = schemaService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/records/copy")
    public ResponseEntity<Feature> copyTableRecords(@RequestBody @Valid FeaturesCopyModel copyModel) {
        ResourceQualifier sourceQualifier = new ResourceQualifier(copyModel.getSource().getSchema(),
                                                                  copyModel.getSource().getTable());
        ResourceQualifier targetQualifier = new ResourceQualifier(copyModel.getTarget().getSchema(),
                                                                  copyModel.getTarget().getTable());

        IResourceModel sourceTable = tableService.getInfo(sourceQualifier);
        SchemaDto sourceSchema = sourceTable.getSchema();
        if (sourceSchema == null) {
            throw new NotFoundException("Не найдена схема таблицы: " + sourceTable.getIdentifier());
        }

        IResourceModel targetTable = tableService.getInfo(targetQualifier);
        SchemaDto targetSchema = targetTable.getSchema();
        if (targetSchema == null) {
            throw new NotFoundException("Не найдена схема таблицы: " + targetTable.getIdentifier());
        }

        ifNotValidThrow(sourceTable, sourceSchema, targetTable, targetSchema);

        mediator.execute(new CopyTableRecordsRequest(sourceSchema,
                                                     targetSchema,
                                                     sourceQualifier,
                                                     targetQualifier,
                                                     copyModel.getFeatureIds()));

        return ResponseEntity.ok().build();
    }

    private static void ifNotValidThrow(IResourceModel sourceTable, SchemaDto sourceSchema, IResourceModel targetTable,
                                        SchemaDto targetSchema) {
        if (targetSchema.isReadOnly()) {
            String message = "Таблица, в которую производится копирование, доступна только для чтения.";

            throw new BadRequestException(message);
        }

        if (!sourceSchema.isCompatibleByGeometry(targetSchema)) {
            String message = String.format(
                    "Типы геометрии слоёв не совпадают. Слой из которого производится копирование имеет тип геометрии:" +
                            " %s, тип геометрии слоя в который производится копирование : %s",
                    sourceSchema.getGeometryType(),
                    targetSchema.getGeometryType());

            throw new BadRequestException(message);
        }

        if (!sourceTable.isCompatibleByCrs(targetTable)) {
            String message = "Системы координат выбранных слоёв не совпадают";

            throw new BadRequestException(message);
        }
    }
}
