import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { SendComponent } from './send/send.component';

const routes: Routes = [
  { path: 'group', component: GroupComponent },
  { path: 'send_sms', component: SendComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendComponentsRoutingModule { }
