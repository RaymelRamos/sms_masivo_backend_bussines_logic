import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      },
      {
        path: 'send',
        loadChildren: './send-components/send-components.module#SendComponentsModule'
      },
      {
        path: 'admin',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
const config: ExtraOptions = {
  useHash: true,
};
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, config)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
