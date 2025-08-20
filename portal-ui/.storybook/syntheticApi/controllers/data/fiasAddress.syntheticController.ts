import { SyntheticController } from '../masterController';
import { FiasApiItem } from '../../../../src/app/services/data/fias/fias.models';
import { fiasAddress } from '../../data/fias';

class FiasAddressSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/integration\/fias\/fulladdress$/;

  get(): FiasApiItem[] {
    return fiasAddress;
  }
}

export const fiasAddressSyntheticController = new FiasAddressSyntheticController();
