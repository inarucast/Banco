import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

// Component Imports
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

// Dialogs


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NavBarComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
  ],
  exports: [
    CommonModule,
    FormsModule,
    NavBarComponent,
    ReactiveFormsModule,
  ],
  providers: []
})
export class SharedModule {
}
