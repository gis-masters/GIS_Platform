import { type FiasApiItem } from '../../../../src/app/services/data/fias/fias.models';
import { fiasOktmo } from '../../data/fias';
import { type SyntheticController } from '../masterController';

class FiasOktmoSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/integration\/fias\/oktmo$/;

  get(): FiasApiItem[] {
    return fiasOktmo;
  }
}

export const fiasOktmoSyntheticController = new FiasOktmoSyntheticController();
