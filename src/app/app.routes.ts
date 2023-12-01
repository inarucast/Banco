import { Routes } from '@angular/router';
import {HomeComponent} from "./modules/home/home.component";
import {NewProductComponent} from "./modules/new-product/new-product.component";

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'add-product/:id', component:  NewProductComponent},
  {path: 'add-product', component:  NewProductComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];
