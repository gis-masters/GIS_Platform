# Repository Guidelines

## Project Structure & Module Organization
`data-service` is a Spring Boot 2.x JAR module rooted at `pom.xml`. Application code lives in `src/main/java/ru/mycrg/data_service`, organized by role (`config`, `controller`, `dao`, `service`, `queue`, `mappers`, `entity`). Resources are in `src/main/resources`: Flyway migrations in `db/migration`, hand-written SQL in `sql`, and XSD inputs in `xsd_smev3` plus `kpt-import`. Tests mirror production packages under `src/test/java`; sample XML/GML payloads live in `src/test/resources`.

## Build, Test, and Development Commands
Do not use run commands
- `mvn test` runs the unit test suite.
- `mvn package` compiles the service, runs tests, generates JAXB classes, and builds the runnable JAR in `target/`.
- `mvn spring-boot:run` starts the service locally using the current Maven profile and local configuration.
- `docker build -t data-service .` builds the container image from `Dockerfile`.

This module inherits from the `ru.mycrg:gis-portal` parent POM, so shared snapshots must already be available in your local or remote Maven repositories.

## Coding Style & Naming Conventions
Use Java 11, 4-space indentation, and standard Spring style. Keep package names lowercase, classes/interfaces in `PascalCase`, methods and fields in `camelCase`, and constants in `UPPER_SNAKE_CASE`. Name Spring components by responsibility, such as `*Service`, `*Handler`, `*Mapper`, and `*Controller`. Prefer small, focused services and keep SQL/XSD-related changes close to their resource folders. No formatter or Checkstyle plugin is configured here, so match the surrounding code before submitting.

## Testing Guidelines
Tests currently use Spring Boot Test, Mockito, and a mix of JUnit 4 and JUnit 5 APIs. Add new tests beside the affected package and name them `*Test`. Prefer focused unit tests for mappers, utility classes, request processors, and SQL builders; reuse fixtures from `src/test/resources` when validating XML, GML, or SMEV flows. No coverage gate is configured, but every behavioral change should include or update tests.

## Commit & Pull Request Guidelines
Recent history mostly follows Conventional Commit style with scopes, for example `feat(data-service): schema new check` and `fix(assets): ...`. Follow that pattern: `<type>(<scope>): <imperative summary>`. Avoid placeholder subjects. PRs should describe the behavior change, list required config or migration steps, link the issue/task, and include request/response examples when API, SQL, or message-contract behavior changes.

## Database & Generated Sources
Do not hand-edit `target/generated-sources/jaxb`; regenerate it through Maven after changing XSD files. For schema changes, add a new Flyway file such as `V6__add_index.sql` in `src/main/resources/db/migration` instead of editing older migrations.
