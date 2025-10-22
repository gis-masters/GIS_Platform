import { staticImplements } from '../../../../services/util/staticImplements';
import { type Adapter, type ExplorerItemData } from '../../Explorer.models';

@staticImplements<Adapter>()
export class ExplorerAdapterTypeNone {
  static getId(item: ExplorerItemData): string {
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
