import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupModel } from '../models/group-model';
import { TargetModel } from '../models/target-model';
import { GroupService } from '../services/group-service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  private title: string = "Gestión de grupos";
  errores_detectados_csv: number = 0;
  edit_target: TargetModel = new TargetModel();
  list_groups: GroupModel[];
  @ViewChild('csvReader') csvReader: any;

  // Body from request
  group_name: string = '';
  records: any[] = [];
  group_description: string = ''

  // Only edit mode
  group_id: string = '';

  constructor(private modalService: NgbModal, private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupService.getAllGroup().subscribe(x => {
      this.list_groups = x;
    });
  }

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;
    try {
      if (this.isValidCSVFile(files[0])) {

        let input = $event.target;
        let reader = new FileReader();
        reader.readAsText(input.files[0]);

        reader.onload = () => {
          let csvData = reader.result;
          let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

          let headersRow = this.getHeaderArray(csvRecordsArray);

          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        };

        reader.onerror = function () {
          console.log('error is occured while reading file!');
        };

      } else {
        alert("Please import valid .csv file.");
        this.fileReset();
      }
    }
    catch (e) {
      console.log(`Error detected: ${e}`)
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    let phoneNumberValidate = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    let emailValidate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im;

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: TargetModel = new TargetModel();
        csvRecord.name = curruntRecord[0].trim();
        csvRecord.phone_number = phoneNumberValidate.test(curruntRecord[1].trim()) ? curruntRecord[1].trim() : "ERROR";
        csvRecord.email = emailValidate.test(curruntRecord[2].trim()) ? curruntRecord[2].trim() : "ERROR";

        csvArr.push(csvRecord);
        this.errores_detectados_csv += csvRecord.email === "ERROR" || csvRecord.phone_number === "ERROR" ? 1 : 0
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  open(content, target = null, create_mode = -1) {
    if (create_mode != -1) {
      this.edit_target.name = target.name
      this.edit_target.phone_number = target.phone_number
      this.edit_target.email = target.email
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      if (result === "Save") {
        if (create_mode == -1) {
          this.createTarget();
        }
        else {
          this.editTarget(create_mode);
        }
      }
      else {

      }
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  removeTarget(i) {
    this.errores_detectados_csv -= this.records[i].name === 'ERROR' || this.records[i].phone_number === 'ERROR' ? 1 : 0
    this.records.splice(i, 1);
  }

  editTarget(index) {
    let email_last = this.records[index].email
    let phone_number_last = this.records[index].phone_number

    this.records[index].name = this.edit_target.name
    this.records[index].phone_number = this.edit_target.phone_number
    this.records[index].email = this.edit_target.email

    console.log(`EDIT ${this.edit_target.name}`);
    this.errores_detectados_csv -= email_last === "ERROR" || phone_number_last === "ERROR" ? 1 : 0
  }
  createTarget() {
    this.records.push(this.edit_target);
    console.log(`CREATE ${this.edit_target.name}`);
  }

  // Actions
  submit(): void {
    if (this.group_id === '') {
      let grupo: GroupModel = new GroupModel();
      grupo.name = this.group_name
      grupo.description = this.group_description
      grupo.target_list = this.records
      this.groupService.createGroup(grupo).subscribe(x => {
        this.list_groups.push(x);
      });
    }
    else {
      let grupo: GroupModel = new GroupModel();
      grupo.name = this.group_name
      grupo.description = this.group_description
      grupo.target_list = this.records
      grupo.uuid = this.group_id

      this.groupService.updateGroup(grupo,this.group_id).subscribe(x => {
        this.list_groups[this.list_groups.findIndex(x => x.uuid === this.group_id)].name = this.group_name
        this.list_groups[this.list_groups.findIndex(x => x.uuid === this.group_id)].description = this.group_description
        this.list_groups[this.list_groups.findIndex(x => x.uuid === this.group_id)].target_list = this.records

        this.group_id = ''
      });
    }
  }

  remove(uuid: string): void {
    this.groupService.deleteGroup(uuid).subscribe(x => {
      this.list_groups.splice(this.list_groups.findIndex(x => x.uuid === uuid), 1);
    });
  }

  show_group(item: GroupModel): void 
  {
    this.group_name = item.name
    this.group_description = item.description
    this.records = item.target_list
    this.group_id = item.uuid
  }

  //validations
  phoneNumberValidation(): boolean {
    let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    return re.test(this.edit_target.phone_number) ? true : false
  }
  emailValidation(): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im;
    return re.test(this.edit_target.email) ? true : false
  }
}
