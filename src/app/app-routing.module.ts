import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SwapComponent } from './swap/swap.component';

const routes: Routes = [
  {
    path: '',
    component: SwapComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
