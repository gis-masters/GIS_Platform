export interface ImportRequestData {
  import: {
    targetWorkspace: {
      workspace: {
        name: string;
      };
    };
    targetStore?: {
      dataStore: {
        name: string;
      };
    };
  };
}

export interface ScratchImport {
  id: number;
  href: string;
  state: string;
  archive: boolean;
  targetWorkspace: {
    workspace: {
      name: string;
      isolated: boolean;
    };
  };
  targetStore: {
    dataStore: {
      name: string;
      type: string;
    };
  };
  tasks: ImportTaskShort[];
}

export interface InputStartResponseDto {
  import: ScratchImport;
}

export interface ImportTaskResponse {
  tasks?: ImportTaskShort[];
  task?: ImportTaskShort;
}

export interface ImportTaskShort {
  id: number;
  href: string;
  state: TaskStatusCode;
}

export interface ImportTaskFull extends ImportTaskShort {
  layer: { name: string; href: string };
  progress: string;
}

export interface ImportTask extends ImportTaskShort {
  layer?: { name: string; href: string };
  progress?: string;
}

export interface ImportTaskProgress {
  progress?: string;
  total?: string;
  state: string;
  message?: string;
}

export interface TaskItem {
  id: number;
  href: string;
  progress: string;
  state: string;
  dataStore: unknown;
  updateMode: string;

  data: {
    type: string;
    format: string;
    file: string;
  };

  layer: {
    name: string;
    href: string;
  };

  target: {
    href: string;
  };

  transforms: unknown;
  transformChain: {
    type: string;
  };
}

export interface ImportLayerItem {
  name: string;
  href: string;
  title: string;
  originalName: string;
  nativeName: string;
  srs: string;
  bbox: {
    minx: string;
    miny: string;
    maxx: string;
    maxy: string;
    crs: string;
  };
  attributes: LayerAttribute[];
  style: {
    name: string;
    href: string;
  };

  isActive?: boolean;
  isMapped?: boolean;
}

export interface LayerAttribute {
  name: string;
  binding: string;
}

export interface ImportLayer {
  layer: ImportLayerItem;
}

export enum TaskStatusCode {
  PENDING = 'PENDING',
  READY = 'READY',
  RUNNING = 'RUNNING',
  NO_CRS = 'NO_CRS',
  NO_BOUNDS = 'NO_BOUNDS',
  NO_FORMAT = 'NO_FORMAT',
  BAD_FORMAT = 'BAD_FORMAT',
  ERROR = 'ERROR',
  CANCELED = 'CANCELED',
  COMPLETE = 'COMPLETE',
  UNKNOWN = 'UNKNOWN'
}
