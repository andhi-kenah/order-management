import type {quantity} from '../Type';

import moment from 'moment';

export const getDeliveryLate = (date: string) => {
  return moment(date, ['DD/MM/YYYY']).isBefore(moment().subtract(1, 'd'))
}


/**
 * getDeliveryDate : Get the long date of delivery
 * @param data 
 * @param fullDate
 * @returns string Date
 */
export const getDeliveryDate = (
  data: string,
  fullDate: string = 'short-date',
) => {
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
    ];
    const date = new Date(data.split('/').reverse().join('-'));
    const month =
      fullDate === 'short-date'
        ? months[date.getMonth()].m
        : months[date.getMonth()].month;
    const year = fullDate === 'short-date' ? '' : date.getFullYear();
    return date.getDate().toString() + ' ' + month + ' ' + year;
  }
  return '';
};

/**
 * getTotal : Get the number of item per detail
 * @param data Number of order
 * @returns number
 */
export const getTotal = (data: quantity[]): number => {
  if (data) {
    let total = 0;
    for (const n of data) {
      total += parseInt(n.number.toString());
    }
    return total;
  }
  return 0;
};

/**
 * getDone : Get the number of item done
 * @param data Number of order
 * @returns number
 */
export const getDone = (data: quantity[]): number => {
  if (data) {
    let done = 0;
    for (let n of data) {
      done += n.number;
    }
    return done;
  }
  return 0;
};