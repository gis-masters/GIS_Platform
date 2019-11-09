import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { ImportService } from './geoserver/import/import.service';
import { ProjectsService } from './crg/projects.service';
import { HttpQueue } from './util/HttpQueue';

class Services {
  importService: ImportService;
  httpClient: HttpClient;
  httpq: HttpQueue;
  projectsService: ProjectsService;
  route: ActivatedRoute;
  router: Router;
}

export const services = new Services();

export const getRoute = (): ActivatedRoute => services.route;