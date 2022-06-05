import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponentsRoutingModule } from './admin-components-routing.module';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';


@NgModule({
  declarations: [UserComponent, RoleComponent],
  imports: [
    CommonModule,
    AdminComponentsRoutingModule
  ]
})
export class AdminComponentsModule { }
