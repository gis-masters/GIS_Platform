import { Injectable } from '@angular/core';

import { currentUser } from '../../stores/CurrentUser.store';
import { usersService } from '../auth/users/users.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserResolver {
  /**
   * Сходим за инфой пользователя/организации перед загрузкой страницы
   */
  async resolve(): Promise<void> {
    await usersService.fetchCurrentUser();

    if (!currentUser.id) {
      return;
    }

    const { resumePersistedGpkgImports } = await import('../data/file-placement/gpkg-import.service');
    void resumePersistedGpkgImports();
  }
}
