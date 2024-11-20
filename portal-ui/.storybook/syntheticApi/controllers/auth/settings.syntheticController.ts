import { InternalAxiosRequestConfig } from 'axios';

import { SyntheticController } from '../masterController';
import { err404 } from '../../utils';
import { CompositeSettings } from '../../../../src/app/stores/OrganizationSettings.store';

class SettingsSyntheticController implements SyntheticController {
  pattern = /^.*\/organizations\/settings$/;

  get(config: InternalAxiosRequestConfig): CompositeSettings {
    if (!config.url) {
      throw err404(config);
    }

    return {
      id: 1,
      name: 'Hogwarts 1',
      system: {
        downloadXml: true,
        createLibraryItem: true,
        showPermissions: true,
        reestrs: true,
        editProjectLayer: true,
        sedDialog: true,
        taskManagement: true,
        viewDocumentLibrary: true,
        viewBugReport: true,
        downloadGml: true,
        importShp: true,
        viewServicesCalculator: true,
        createProject: true,
        default_epsg: 'WGS 84 / Pseudo-Mercator, EPSG:3857, метры',
        favorites_epsg: [
          '{"authName":"EPSG","authSrid":3857,"srtext":"PROJCS[\\"WGS 84 / Pseudo-Mercator\\",GEOGCS[\\"WGS 84\\",DATUM[\\"WGS_1984\\",SPHEROID[\\"WGS 84\\",6378137,298.257223563,AUTHORITY[\\"EPSG\\",\\"7030\\"]],AUTHORITY[\\"EPSG\\",\\"6326\\"]],PRIMEM[\\"Greenwich\\",0,AUTHORITY[\\"EPSG\\",\\"8901\\"]],UNIT[\\"degree\\",0.0174532925199433,AUTHORITY[\\"EPSG\\",\\"9122\\"]],AUTHORITY[\\"EPSG\\",\\"4326\\"]],PROJECTION[\\"Mercator_1SP\\"],PARAMETER[\\"central_meridian\\",0],PARAMETER[\\"scale_factor\\",1],PARAMETER[\\"false_easting\\",0],PARAMETER[\\"false_northing\\",0],UNIT[\\"metre\\",1,AUTHORITY[\\"EPSG\\",\\"9001\\"]],AXIS[\\"X\\",EAST],AXIS[\\"Y\\",NORTH],EXTENSION[\\"PROJ4\\",\\"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs\\"],AUTHORITY[\\"EPSG\\",\\"3857\\"]]","proj4Text":"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs","title":"WGS 84 / Pseudo-Mercator, EPSG:3857, метры","auth_srid":3857}'
        ],
        downloadFiles: true,
        tags: ['НТО', 'Инвентаризация недвижимости', 'КПТ']
      },
      organization: {
        downloadXml: true,
        createLibraryItem: true,
        showPermissions: true,
        reestrs: true,
        editProjectLayer: true,
        sedDialog: true,
        taskManagement: true,
        viewDocumentLibrary: true,
        viewBugReport: true,
        downloadGml: true,
        importShp: true,
        viewServicesCalculator: true,
        createProject: true,
        default_epsg: 'WGS 84 / Pseudo-Mercator, EPSG:3857, метры',
        favorites_epsg: [
          '{"authName":"EPSG","authSrid":3857,"srtext":"PROJCS[\\"WGS 84 / Pseudo-Mercator\\",GEOGCS[\\"WGS 84\\",DATUM[\\"WGS_1984\\",SPHEROID[\\"WGS 84\\",6378137,298.257223563,AUTHORITY[\\"EPSG\\",\\"7030\\"]],AUTHORITY[\\"EPSG\\",\\"6326\\"]],PRIMEM[\\"Greenwich\\",0,AUTHORITY[\\"EPSG\\",\\"8901\\"]],UNIT[\\"degree\\",0.0174532925199433,AUTHORITY[\\"EPSG\\",\\"9122\\"]],AUTHORITY[\\"EPSG\\",\\"4326\\"]],PROJECTION[\\"Mercator_1SP\\"],PARAMETER[\\"central_meridian\\",0],PARAMETER[\\"scale_factor\\",1],PARAMETER[\\"false_easting\\",0],PARAMETER[\\"false_northing\\",0],UNIT[\\"metre\\",1,AUTHORITY[\\"EPSG\\",\\"9001\\"]],AXIS[\\"X\\",EAST],AXIS[\\"Y\\",NORTH],EXTENSION[\\"PROJ4\\",\\"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs\\"],AUTHORITY[\\"EPSG\\",\\"3857\\"]]","proj4Text":"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs","title":"WGS 84 / Pseudo-Mercator, EPSG:3857, метры","auth_srid":3857}',
          '{"authName":"EPSG","authSrid":28407,"srtext":"PROJCS[\\"Pulkovo 1942 / Gauss-Kruger zone 7\\",GEOGCS[\\"Pulkovo 1942\\",DATUM[\\"Pulkovo_1942\\",SPHEROID[\\"Krassowsky 1940\\",6378245,298.3,AUTHORITY[\\"EPSG\\",\\"7024\\"]],TOWGS84[23.92,-141.27,-80.9,0,0.35,0.82,-0.12],AUTHORITY[\\"EPSG\\",\\"6284\\"]],PRIMEM[\\"Greenwich\\",0,AUTHORITY[\\"EPSG\\",\\"8901\\"]],UNIT[\\"degree\\",0.0174532925199433,AUTHORITY[\\"EPSG\\",\\"9122\\"]],AUTHORITY[\\"EPSG\\",\\"4284\\"]],PROJECTION[\\"Transverse_Mercator\\"],PARAMETER[\\"latitude_of_origin\\",0],PARAMETER[\\"central_meridian\\",39],PARAMETER[\\"scale_factor\\",1],PARAMETER[\\"false_easting\\",7500000],PARAMETER[\\"false_northing\\",0],UNIT[\\"metre\\",1,AUTHORITY[\\"EPSG\\",\\"9001\\"]],AUTHORITY[\\"EPSG\\",\\"28407\\"]]","proj4Text":"+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,0,0.35,0.82,-0.12 +units=m +no_defs ","title":"Pulkovo 1942 / Gauss-Kruger zone 7, EPSG:28407, метры","auth_srid":28407,"auth_name":"EPSG"}',
          '{"authName":"EPSG","authSrid":28406,"srtext":"PROJCS[\\"Pulkovo 1942 / Gauss-Kruger zone 6\\",GEOGCS[\\"Pulkovo 1942\\",DATUM[\\"Pulkovo_1942\\",SPHEROID[\\"Krassowsky 1940\\",6378245,298.3,AUTHORITY[\\"EPSG\\",\\"7024\\"]],TOWGS84[23.92,-141.27,-80.9,0,0.35,0.82,-0.12],AUTHORITY[\\"EPSG\\",\\"6284\\"]],PRIMEM[\\"Greenwich\\",0,AUTHORITY[\\"EPSG\\",\\"8901\\"]],UNIT[\\"degree\\",0.0174532925199433,AUTHORITY[\\"EPSG\\",\\"9122\\"]],AUTHORITY[\\"EPSG\\",\\"4284\\"]],PROJECTION[\\"Transverse_Mercator\\"],PARAMETER[\\"latitude_of_origin\\",0],PARAMETER[\\"central_meridian\\",33],PARAMETER[\\"scale_factor\\",1],PARAMETER[\\"false_easting\\",6500000],PARAMETER[\\"false_northing\\",0],UNIT[\\"metre\\",1,AUTHORITY[\\"EPSG\\",\\"9001\\"]],AUTHORITY[\\"EPSG\\",\\"28406\\"]]","proj4Text":"+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,0,0.35,0.82,-0.12 +units=m +no_defs ","title":"Pulkovo 1942 / Gauss-Kruger zone 6, EPSG:28406, метры","auth_srid":28406,"auth_name":"EPSG"}'
        ],
        downloadFiles: true,
        tags: ['НТО', 'Инвентаризация недвижимости', 'КПТ']
      }
    };
  }
}

export const settingsSyntheticController = new SettingsSyntheticController();
