import {Pipe, PipeTransform} from "@angular/core";
@Pipe({
  name: 'datetostring'
})
export class DateToStringPipe implements PipeTransform {
  transform(value: Date) {
    let [month, day, year]    = new Date().toLocaleDateString("en-US").split("/");
    const ageYear = (Number(year) - value.getFullYear());
    const ageMonth = (Number(month) - value.getMonth());
    const ageDay = (Number(day) - value.getDay());
    let outputText = "";
    if(ageYear===0 && ageMonth===0){
      outputText = ageDay + 'روز' ;
    } else if(ageYear===0){
      outputText = ageMonth + ' ماه و ' + ageDay + 'روز';
    }else{
      outputText = ageYear + ' سال و ' + ageMonth + 'ماه';
    }
    return   outputText;
  }
}
