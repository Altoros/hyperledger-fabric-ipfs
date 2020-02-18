// @flow

import moment from 'moment';

export const formatter = {
  number: (val: string | number) => Number(val).toLocaleString(),
  date: (date: Date) => date.toLocaleDateString(),
  time: (date: Date) => date.toLocaleTimeString(),
  fullName: (firstName: string, lastName: string) => firstName + ' ' + lastName,
  org: (orgKey: string) => orgKey || '###',
  datetime: (date: Date) => moment(date).format(moment.localeData().longDateFormat('l') + ' ' + moment.localeData().longDateFormat('LT')),
  dateTimeLong: (date: Date) => moment(date).format(moment.localeData().longDateFormat('l') + ' ' + moment.localeData().longDateFormat('LTS'))
};
