import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeTableRoutingModule } from './poke-table-routing.module';
import { PokeTableComponent } from './poke-table.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzListModule } from 'ng-zorro-antd/list';
import { PokeTableDetailsComponent } from './poke-table-details/poke-table-details.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PokeTableComponent, PokeTableDetailsComponent],
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
    FormsModule,
  ]
})
export class PokeTableModule { }
