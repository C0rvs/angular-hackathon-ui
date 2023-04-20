import { Component, OnInit } from '@angular/core';
import { ezBookInterface } from './inteface/hsCodes';
import { HscodesService } from './services/hscodes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hackathon-ui';
  searchTerm: string = "";
  ezBoookDB: ezBookInterface[] = [];
  listForCurrency: string[] = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "HKD", "NZD", "KRW", "SGD", "SEK", "NOK", "MXN", "INR", "RUB",
    "BRL", "ZAR", "PHP"];
  listForNatureOfGoods: string[] = [];
  hsCode: string = "";
  specialHandlingcodes: String = "";
  filteredOptions: string[] = [];
  type: string = "warning";
  bookingProgress: number = 0;
  selectedMandatory: String[] = [];
  selectedNonMand: String[] = [];

  ngOnInit(): void {
    this.getHsCodes();
  }
  constructor(private service: HscodesService) {
  }
  getHsCodes() {
    this.service.getList().subscribe(newHsCode => {
      this.ezBoookDB = newHsCode;
      this.listNatureOfGoods()
    })
  }

  listNatureOfGoods() {
    this.ezBoookDB.map(hsCode => {
      this.listForNatureOfGoods.push(hsCode.nature_of_goods);
    })
    this.printNatureOfGoods();

  }

  printNatureOfGoods() {
    console.log(this.listForNatureOfGoods);
  }

  onSearch() {
    if (this.searchTerm) {
      this.filteredOptions = this.listForNatureOfGoods.filter(option => option.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.filteredOptions = [];
    }
  }

  onOptionSelected(option: string) {
    this.searchTerm = option;
    this.filteredOptions = [];
    this.onBlur(this.searchTerm);
  }

  progressValue(event: any) {
    const arrayList = ["prefix", "serial", "issueCarrier", "agent", "origin", "destination", "weight", "natureOfGoods", "hsCode"];
    const nonMandList = ["area", "pieces", "volume", "chargeableWeight", "priceClass", "currency", "product", "specialHandlingcodes"];
    const arrManLength = arrayList.length;
    const arrNonManLength = nonMandList.length;
    const inputValue = event.target.value;
    const selectedId = event.target.id;
    if (inputValue.length != 0) {
      if (arrayList.indexOf(selectedId) >= 0 && this.selectedMandatory.indexOf(selectedId) < 0) {
        //console.log('In the mand list, trying adding into the selected');
        this.selectedMandatory.push(selectedId);
      } else if (nonMandList.indexOf(selectedId) >= 0 && this.selectedNonMand.indexOf(selectedId) < 0) {
        //console.log('In the nonMand list, trying adding into the selected');
        this.selectedNonMand.push(selectedId);
      }
    } else {
      if ((arrayList.indexOf(selectedId) >= 0) && (this.selectedMandatory.indexOf(selectedId) >= 0)) {
        //console.log('In the mand list, trying delete from the list as empty');
        this.selectedMandatory.forEach((element, index) => {
          if (element == selectedId) this.selectedMandatory.splice(index, 1);
        });
      } else if ((nonMandList.indexOf(selectedId) >= 0) && (this.selectedNonMand.indexOf(selectedId) >= 0)) {
        //console.log('In the nonMand list, trying delete from the list as empty');
        this.selectedNonMand.forEach((element, index) => {
          if (element == selectedId) this.selectedNonMand.splice(index, 1);
        });
      }
    }
    const mandatoryCount = this.selectedMandatory.length;
    const nonMandCount = this.selectedNonMand.length;
    const sumScore = (arrManLength * 3) + nonMandCount;
    const selectScore = (mandatoryCount * 3) + nonMandCount;
    this.bookingProgress = Math.round((selectScore / sumScore) * 100);
    if (this.bookingProgress < 30) {
      this.type = "warning";
    } else if (this.bookingProgress < 75) {
      this.type = "info";
    } else if (this.bookingProgress >= 75) {
      this.type = "success";
    }
  }

  onBlur(value: String) {
    const userInput = value;
    let data: ezBookInterface = { primary: true, nature_of_goods: "", hs_code: "", shc: "" };
    this.ezBoookDB.filter(natureOfGood => {
      if (userInput == natureOfGood.nature_of_goods) {
        this.hsCode = natureOfGood.hs_code;
        this.changeUponUpdateProgressValue("hsCode");
        if (natureOfGood.shc != null) {
          this.specialHandlingcodes = natureOfGood.shc;
          this.changeUponUpdateProgressValue("specialHandlingcodes");
        }
        console.log(this.hsCode);
      }
    })
  }
  
  changeUponUpdateProgressValue(idName: string) {
      const arrayList = ["prefix", "serial", "issueCarrier", "agent", "origin", "destination", "weight", "natureOfGoods", "hsCode"];
      const nonMandList = ["area", "pieces", "volume", "chargeableWeight", "priceClass", "currency", "product", "specialHandlingcodes"];
      const arrManLength = arrayList.length;
      const arrNonManLength = nonMandList.length;
      const selectedId = idName;
      
      if (arrayList.indexOf(selectedId) >= 0 && this.selectedMandatory.indexOf(selectedId) < 0) {
        //console.log('In the mand list, trying adding into the selected');
        this.selectedMandatory.push(selectedId);
      } else if (nonMandList.indexOf(selectedId) >= 0 && this.selectedNonMand.indexOf(selectedId) < 0) {
        //console.log('In the nonMand list, trying adding into the selected');
        this.selectedNonMand.push(selectedId);
      }
      const mandatoryCount = this.selectedMandatory.length;
      const nonMandCount = this.selectedNonMand.length;
      const sumScore = (arrManLength * 3) + nonMandCount;
      const selectScore = (mandatoryCount * 3) + nonMandCount;
      this.bookingProgress = Math.round((selectScore / sumScore) * 100);
      if (this.bookingProgress < 30) {
        this.type = "warning";
      } else if (this.bookingProgress < 75) {
        this.type = "info";
      } else if (this.bookingProgress >= 75) {
        this.type = "success";
      }
    }
}




