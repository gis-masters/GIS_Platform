import { NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ImportService } from './geoserver/import/import.service';
import { ProjectsService } from './crg/projects.service';
import { DataSchemaService } from './crg/data-schema.service';
import { CommunicationService } from './communication.service';
import { HttpQueue } from './util/HttpQueue';

interface ServicesList {
  importService: ImportService;
  httpq: HttpQueue;
  projectsService: ProjectsService;
  dataSchemaService: DataSchemaService;
  communicationService: CommunicationService;
  route: ActivatedRoute;
  router: Router;
  ngZone: NgZone;
}

class Services implements ServicesList {
  importService: ImportService;
  httpq: HttpQueue;
  projectsService: ProjectsService;
  dataSchemaService: DataSchemaService;
  communicationService: CommunicationService;
  route: ActivatedRoute;
  router: Router;
  ngZone: NgZone;

  provided: Promise<void>;

  private onfullfilled: () => void;

  constructor () {
    this.provided = new Promise((onfullfilled) => {
      this.onfullfilled = onfullfilled;
    });
  }

  provide (servicesList: ServicesList) {
    this.importService = servicesList.importService;
    this.projectsService = servicesList.projectsService;
    this.dataSchemaService = servicesList.dataSchemaService;
    this.communicationService = servicesList.communicationService;
    this.httpq = servicesList.httpq;
    this.route = servicesList.route;
    this.router = servicesList.router;
    this.ngZone = servicesList.ngZone;

    this.onfullfilled();
  }
}

export const services = new Services();

export const getRoute = (): ActivatedRoute => services.route;
