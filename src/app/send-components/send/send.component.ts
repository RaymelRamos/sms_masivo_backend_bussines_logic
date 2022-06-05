import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group-service';
import { SmsService } from '../services/sms-service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {

  count_character: number = 0

  groups_list = [];
  groups_selected = [];
  dropdownSettings = {};
  topic: string = '';
  message: string = '';

  constructor(private groupService: GroupService, private smsService: SmsService) { }

  ngOnInit(): void {
    this.groupService.getSimpleGroup().subscribe( x => 
      {
        this.groups_list = x;
      });
    
    this.groups_selected = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'uuid',
      textField: 'name',
      selectAllText: 'Seleccionar Todo',
      unSelectAllText: 'Deseleccionar Todo',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar'
    };
  }
  // Dropdown function
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  // Actions

  adaptGroup = (x) => ({
    uuid: x.uuid
  })

  submit(): void
  {
    let body = {
      topic: '',
      body: '',
      groups: []
    }
    body.topic = this.topic
    body.body = this.message
    body.groups = this.groups_selected.map(this.adaptGroup)

    this.smsService.createSms(body).subscribe( x => 
      {
        console.log(x)
      });
  }
}
