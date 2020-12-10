import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { usersService } from '../crg/users.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserResolver implements Resolve<void> {
  /**
   * Сходим за инфой пользователя/организации перед загрузкой старницы
   */
  async resolve() {
    await usersService.fetchCurrentUser();
  }
}
