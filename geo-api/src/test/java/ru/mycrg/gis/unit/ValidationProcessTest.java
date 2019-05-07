package ru.mycrg.gis.unit;

import org.junit.Ignore;
import org.junit.Test;

import java.util.concurrent.ExecutionException;

public class ValidationProcessTest {

    @Test
    @Ignore
    public void shouldCorrectHandleResponse() throws ExecutionException, InterruptedException {
//        ValidationRequestDto request1 = new ValidationRequestDto();
//        request1.setDbName("gis");
//        request1.setSchemaName("fiz");
//        request1.setTableName("some_table1");
//
//        ValidationRequestDto request2 = new ValidationRequestDto();
//        request2.setDbName("gis");
//        request2.setSchemaName("fiz");
//        request2.setTableName("some_table2");
//
//        ValidationProcess process = new ValidationProcess();
//        process.addRequest(Arrays.asList(request1, request2));
//
//        ValidationMqResponse response1 = new ValidationMqResponse();
//        response1.setStatus(ProcessStatus.ERROR);
//        String resourceId1 = String.join(":", request1.getDbName(), request1.getSchemaName(), request1.getTableName());
//        response1.setResourceId(resourceId1);
//        ValidationMqResponse response2 = new ValidationMqResponse();
//        response2.setStatus(ProcessStatus.DONE);
//        String resourceId2 = String.join(":", request2.getDbName(), request2.getSchemaName(), request2.getTableName());
//        response2.setResourceId(resourceId2);
//
//        CompletableFuture<List<ValidationResponseDto>> futureResponse = process.getFutureResponse();
//
//        // Act
//        process.handleMqResponse(response1);
//        process.handleMqResponse(response2);
//
//        // Assert
//        // Проверяем что при данных запросах и ответах обработчика, корректно сформируется конечный ответ на UI
//        assertTrue(futureResponse.isDone());
//
//        List<ValidationResponseDto> responseDtos = futureResponse.get();
//
//        assertEquals(2, responseDtos.size());
//
//        assertEquals(ProcessStatus.ERROR, responseDtos.get(0).getStatus());
//        assertEquals(resourceId1, responseDtos.get(0).getResourceId());
//
//        assertEquals(ProcessStatus.DONE, responseDtos.get(1).getStatus());
//        assertEquals(resourceId2, responseDtos.get(1).getResourceId());
    }

}
