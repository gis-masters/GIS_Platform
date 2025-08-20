import { Injectable } from '@angular/core';

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
  }
}
