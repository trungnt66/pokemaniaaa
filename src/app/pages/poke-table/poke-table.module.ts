import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { TeamsMessageModule } from 'src/app/services/teams-message/teams-message.module';
import { AddMultipleUserComponent } from './poke-table-details/add-multiple-user/add-multiple-user.component';
import { PokeTableDetailsComponent } from './poke-table-details/poke-table-details.component';
import { PokeTableRoutingModule } from './poke-table-routing.module';
import { PokeTableComponent } from './poke-table.component';

@NgModule({
  declarations: [PokeTableComponent, PokeTableDetailsComponent, AddMultipleUserComponent],
  imports: [
    CommonModule,
    PokeTableRoutingModule,
    NzPopconfirmModule,
    NzMessageModule,
    IconsProviderModule,
    NzButtonModule,
    NzListModule,
    NzModalModule,
    NzInputNumberModule,
    NzInputModule,
    NzCheckboxModule,
    FormsModule,
    NzAutocompleteModule,
    TeamsMessageModule,
  ]
})
export class PokeTableModule { }
