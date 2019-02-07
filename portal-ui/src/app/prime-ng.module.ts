import {NgModule} from '@angular/core';

import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ContextMenuModule} from 'primeng/contextmenu';

@NgModule({
  exports: [
    TableModule,
    DialogModule,
    SidebarModule,
    ScrollPanelModule,
    ContextMenuModule,
  ]
})
export class PrimeNgModule {
}
