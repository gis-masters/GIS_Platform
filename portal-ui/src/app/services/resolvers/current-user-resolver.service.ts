import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { usersService } from '../data/users.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserResolver implements Resolve<void> {
  /**
   * Сходим за инфой пользователя/организации перед загрузкой страницы
   */
  async resolve(): Promise<void> {
    await usersService.fetchCurrentUser();
  }
}
