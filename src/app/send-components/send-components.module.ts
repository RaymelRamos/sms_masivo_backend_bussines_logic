import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { SendComponentsRoutingModule } from './send-components-routing.module';
import { GroupComponent } from './group/group.component';
import { SendComponent } from './send/send.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [GroupComponent, SendComponent],
  imports: [
    CommonModule,
    SendComponentsRoutingModule,
    NgbPaginationModule, 
    NgbAlertModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class SendComponentsModule { }
