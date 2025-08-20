package ru.mycrg.gis_service.config;

import com.zaxxer.hikari.HikariDataSource;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.impl.jobexecutor.DefaultJobExecutor;
import org.camunda.bpm.engine.spring.ProcessEngineFactoryBean;
import org.camunda.bpm.engine.spring.SpringProcessEngineConfiguration;
import org.camunda.bpm.spring.boot.starter.actuator.JobExecutorHealthIndicator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import ru.mycrg.gis_service.bpmn.CrgJobExecutorHealthIndicator;

@Configuration
public class BpmnEngineConfiguration {

    private final Environment environment;

    public BpmnEngineConfiguration(Environment environment) {
        this.environment = environment;
    }

    @Bean
    @Primary
    public JobExecutorHealthIndicator jobExecutorHealthIndicator() {
        return new CrgJobExecutorHealthIndicator(new DefaultJobExecutor());
    }

    @Bean
    public SpringProcessEngineConfiguration processEngineConfiguration() {
        SpringProcessEngineConfiguration config = new SpringProcessEngineConfiguration();

        final String camundaDbJdbcUrl = environment
                .getRequiredProperty("spring.datasource.url")
                .replace("crg_gis_service", "bpmn_camunda");

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setJdbcUrl(camundaDbJdbcUrl);
        dataSource.setUsername(environment.getRequiredProperty("spring.datasource.username"));
        dataSource.setPassword(environment.getRequiredProperty("spring.datasource.password"));

        final DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(dataSource);

        config.setDataSource(dataSource);
        config.setTransactionManager(transactionManager);
        config.setJobExecutorActivate(true);
        config.setHistory("full");

        return config;
    }

    @Bean
    public ProcessEngineFactoryBean processEngine() {
        ProcessEngineFactoryBean factoryBean = new ProcessEngineFactoryBean();
        factoryBean.setProcessEngineConfiguration(processEngineConfiguration());

        return factoryBean;
    }

    @Bean
    public RepositoryService repositoryService(ProcessEngine processEngine) {
        return processEngine.getRepositoryService();
    }

    @Bean
    public RuntimeService runtimeService(ProcessEngine processEngine) {
        return processEngine.getRuntimeService();
    }

    @Bean
    public TaskService taskService(ProcessEngine processEngine) {
        return processEngine.getTaskService();
    }
}
