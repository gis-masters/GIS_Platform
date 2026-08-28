import { type FiasApiItem } from '../../../../src/app/services/data/fias/fias.models';
import { fiasAddress } from '../../data/fias';
import { type SyntheticController } from '../masterController';

class FiasAddressSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/integration\/fias\/fulladdress$/;

  get(): FiasApiItem[] {
    return fiasAddress;
  }
}

export const fiasAddressSyntheticController = new FiasAddressSyntheticController();
