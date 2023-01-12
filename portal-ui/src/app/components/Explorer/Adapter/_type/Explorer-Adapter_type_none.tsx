import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.NONE]: {
      loading?: boolean;
    };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeNone {
  static getId(item: ExplorerItemData<{ loading: boolean }>): string {
    return item.type;
  }

  static getTitle(): string {
    return '';
  }

  static getMeta(): string {
    return '';
  }

  static isFolder(): boolean {
    return false;
  }
}
