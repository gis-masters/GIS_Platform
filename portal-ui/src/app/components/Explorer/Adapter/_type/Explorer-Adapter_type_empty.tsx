import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.EMPTY]: { title: string };
  }
}

interface RootType {
  title: string;
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeEmpty {
  static getId(item: ExplorerItemData<RootType>): string {
    return item.type + item.payload.title;
  }

  static getTitle(item: ExplorerItemData<RootType>): string {
    return item.payload.title;
  }

  static getMeta(): string {
    return '';
  }

  static isFolder(): boolean {
    return true;
  }
}
