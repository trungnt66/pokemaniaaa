import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-add-multiple-user',
  templateUrl: './add-multiple-user.component.html',
  styleUrls: ['./add-multiple-user.component.css']
})
export class AddMultipleUserComponent implements OnInit, OnChanges {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() listUserName: any[] = [];
  @Output() onSave: EventEmitter<string[]> = new EventEmitter();
  public listUserNameChkBox: {label: string, value: string, checked: boolean}[] = []
  public data = [];
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['listUserName']){
      this.data = [];
      this.listUserNameChkBox = this.listUserName.map(x=>{return {label: x, value: x, checked: false}});
    }
  }
  submit () {
    const saveData = this.listUserNameChkBox?.filter(x=>x?.checked)?.map(x=>x?.value) || []
    this.onSave.emit(saveData);
  }
  
}
