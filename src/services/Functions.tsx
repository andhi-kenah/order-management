import type { quantity } from "../Data";

export const getDeliveryDate = (data: string, fullDate: string = 'short-date') => {
    if (data) {
      const months = [
        {month: 'Janvier', m: 'Jan'},
        {month: 'Fevrier', m: 'Fev'},
        {month: 'Mars', m: 'Mar'},
        {month: 'Avril', m: 'Avr'},
        {month: 'Mai', m: 'Mai'},
        {month: 'Juin', m: 'Jun'},
        {month: 'Juillet', m: 'Jul'},
        {month: 'Aout', m: 'Aou'},
        {month: 'Septembre', m: 'Sept'},
        {month: 'Octobre', m: 'Oct'},
        {month: 'Novembre', m: 'Nov'},
        {month: 'Decémbre', m: 'Dec'},
      ]
      const date = new Date(data.split('/').reverse().join('-'));
      const month = fullDate === 'short-date' ? months[date.getMonth()].m : months[date.getMonth()].month;
      const year = fullDate === 'short-date' ? '' : date.getFullYear();
      return date.getDate().toString() + ' ' + month + ' ' + year;
    }
    return '';
  };


  export const getTotal = (data: quantity[]) => {
    if (data) {
      let total = 0;
      for (const n of data) {
        total += parseInt(n.number.toString());
      }
      return total;
    }
    return 0;
  };