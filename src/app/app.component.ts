import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hackathon-ui';
  searchTerm: string = "";
  selectedOption: string = "";
  listForNatureOfGoods: string[] = ['fresh fish', 'live bees', 'pink dinosaur', 'consolidation'];
  filteredOptions: string[] = [];

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
  }
}
  

