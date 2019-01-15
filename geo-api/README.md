# Getting Started

1.	Installation process.

    You will need:
        - git clone https://programgeoplan@dev.azure.com/programgeoplan/GIS%20Platform/_git/GIS%20Platform

        - Install/Or use docker image: postgresql database (Tested on version 10.5)
          connection url and database name specify in property file / or docker-compose file

# Build

        - mvn clean install                            - for make jar file
        - docker build -t host/gis-platform:latest .   - for build docker image
        - docker-compose up -d                         - run via compose 

# Test
        - mvn test                                     - for run UNIT tests
        - mvn integration-test                         - run ACCEPTANCE tests
                                                       (You just need the application deployed through docker-compose) 
