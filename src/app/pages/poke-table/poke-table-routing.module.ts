import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PokeTableDetailsComponent } from './poke-table-details/poke-table-details.component';
import { PokeTableComponent } from './poke-table.component';

const routes: Routes = [
  { path: '', component: PokeTableComponent },
  { path: 'detail/:tableId', component: PokeTableDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokeTableRoutingModule { }
