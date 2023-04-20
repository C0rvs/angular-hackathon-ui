import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HscodesService } from './services/hscodes.service';
import { hsCodes } from './interface/hsCodes';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    hsCodes: hsCodes[] = [];
    natureOfGoods: string [] = [];
    constructor(private service: HscodesService){

    }


    getHsCodes(){
      this.service.getList().subscribe(newHsCode => {
        this.hsCodes = newHsCode; 
        this.addNatureOfGoods()
      })
    }

    addNatureOfGoods()
    {
      this.hsCodes.map(hsCode=>{
        this.natureOfGoods.push(hsCode.nature_of_goods);
      })
      this.printNatureOfGoods();
    }

    printNatureOfGoods()
    {
      console.log(this.natureOfGoods);
    }

}

  


