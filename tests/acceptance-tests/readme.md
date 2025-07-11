##### Acceptance tests is disabled by default. 
This will allow you to run it with params:

`mvn clean test -DskipAcceptanceTests=false -Denv.HOST=http://localhost -Denv.PORT=8100 -Denv.ROOT_NAME=test@mail.ru 
-Denv.ROOT_PASS=test`

For run some scenarios by tags add: `-Dcucumber.filter.tags="@someTags"`
