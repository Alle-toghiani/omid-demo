import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-filter-sort',
  templateUrl: './filter-sort.component.html',
  styleUrls: ['./filter-sort.component.scss']
})
export class FilterSortComponent implements OnInit {
  sortOrder: boolean = false;
  sortBasedOn: string = 'dateAdded';
  checkedGender: boolean = false;
  checkedVac: boolean = false;
  filterGenderValue: string;

  filterGenderChecked:boolean= false;

  filterCriteria: {Field:string,Values:string[]}[]=[];

  @Output() sortEventEmitter = new EventEmitter< { basedOn: string, order: boolean }>();
  @Output() filterEventEmitter = new EventEmitter< {Field:string,Values:string[]}[] >();

  constructor() { }

  ngOnInit(): void {
  }
  onSetBasedOn(event){
    this.sortBasedOn = event.value;
    this.sortEventEmitter.emit({basedOn: this.sortBasedOn, order: this.sortOrder});
  }
  onSetOrder(event){
    this.sortOrder = (event.value ==='true') ? true : false ;
    this.sortEventEmitter.emit({basedOn: this.sortBasedOn, order: this.sortOrder});
  }

  onFilterChange(action:string,event){
    switch (action) {
      case "RemoveFilter": {
        //Remove Filter
        this.filterCriteria = this.filterCriteria.filter((item) => item.Field !== event.source.name)
        this.filterEventEmitter.emit( this.filterCriteria)
      }
        break;
      case "AddFilter": {
        //Add Filter
        console.log(event);
        this.filterCriteria.push({Field: event.source.name, Values: [].concat(event.source.value)})
        this.filterEventEmitter.emit( this.filterCriteria)
      }
        break;
      case "EditFilter": {
        //Edit Filter
        console.log("Edit Filter", event)
        this.filterCriteria = this.filterCriteria.map
          (
            (item) => {
            if (item.Field === event.source.name) {
              item.Values=[].concat(event.source.value);
              // item.Values.concat([event.source.value]);
              return item;
              }
            }
          )
        this.filterEventEmitter.emit( this.filterCriteria);
      }
        break;
      default : {
        throw (Error("Exception in FlexFilter function, check default"))
      }
    }
  }

  onToggle(){
    this.checkedGender = !this.checkedGender;
  }



}
