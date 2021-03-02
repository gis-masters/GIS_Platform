import { staticImplements } from '../../../../services/util/staticImplements';

import { ExplorerItemData } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

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
  static getId(item: ExplorerItemData<RootType>) {
    return item.type + item.payload.title;
  }

  static getTitle(item: ExplorerItemData<RootType>) {
    return item.payload.title;
  }

  static getMeta() {
    return '';
  }

  static isFolder() {
    return true;
  }
}
