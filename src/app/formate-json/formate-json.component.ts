import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-formate-json',
  templateUrl: './formate-json.component.html',
  styleUrls: ['./formate-json.component.css']
})
export class FormateJSONComponent implements OnInit {
  @ViewChild('InputValue', { static: true }) InputValue: any;
  inputErrorMsg: string;
  showInputError = false;
  data: any;

  constructor() { }

  ngOnInit() {
  }

  get code() {
    return JSON.stringify(this.data, null, 2);
  }

  getInputJSON() {
    try {
      const inputValue = JSON.parse(this.InputValue.nativeElement.value.trim());
      if (typeof inputValue === 'object' && inputValue !== null) {
        this.showInputError = false;
        this.inputErrorMsg = '';
        const flatArray = this.makeObjectFlat(inputValue);
        const resultArr = [];
        flatArray.filter(item => item.parent_id == null).forEach(item => {
          this.buildChildren(item, flatArray);
          resultArr.push(item);
        });
        this.data = resultArr;

      } else {
        this.showInputError = true;
        this.inputErrorMsg = 'Only Object Allowed';
      }
    } catch (error) {
      this.showInputError = true;
      this.inputErrorMsg = this.InputValue.nativeElement.value === '' ? 'Blank Input Not Allowed' : error;
    }

  }

  makeObjectFlat(rawJSON) {
    const flatArr = [];
    for (const key in rawJSON) {
      if (Array.isArray(rawJSON[key])) {
        rawJSON[key].forEach(element => {
          flatArr.push(element);
        });
      } else {
        flatArr.push();
      }
    }
    return flatArr;
  }

  buildChildren(parentObj, flatArray) {
    if (!flatArray) { return; }
    const children = flatArray.filter(item => item.parent_id === parentObj.id);
    parentObj.children = children || [];
    parentObj.children.forEach(item => {
      this.buildChildren(item, flatArray);
    });
  }

  reset() {
    this.data = '';
    this.InputValue.nativeElement.value = '';
  }

}
