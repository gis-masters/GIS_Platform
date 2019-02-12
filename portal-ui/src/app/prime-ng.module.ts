import {NgModule} from '@angular/core';

import {TreeModule} from 'primeng/tree';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ContextMenuModule} from 'primeng/contextmenu';

@NgModule({
  exports: [
    TreeModule,
    TableModule,
    DialogModule,
    SidebarModule,
    ScrollPanelModule,
    ContextMenuModule,
  ]
})
export class PrimeNgModule {
}
