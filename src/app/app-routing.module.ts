import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActasComponent } from './components/actas/actas.component';
import { ResultadosComponent } from './components/resultados/resultados.component';

const routes: Routes = [
  {path:'resultados', component:ResultadosComponent},
  {path:'actas', component:ActasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
