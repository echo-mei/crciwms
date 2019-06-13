import { Injectable } from '@angular/core';

@Injectable()
export class DateUtilProvider {

  // 一天毫秒数
  public DAY_MILLISECOND = 1 * 24 * 60 * 60 * 1000;

  format(date: Date, fmt: string): string {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  // 是否同一天
  isSameDay(date1: Date, date2: Date) {
    return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
  }

  // 是否闰年
  isLeapYear(year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
  }

  // 获取某年中某月的天数
  getMonthDays(year, month) {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (this.isLeapYear(year) ? 29 : 28);
  }

  // 获取某年的第几周的开始和结束日期（周一为每周第一天，每年1号所在周为当年的第一周，从0开始表示第一周）
  getOneWeek(year, index) {
    let firstDate, lastDate;
    let date = new Date(year, 0, 1);
    if (date.getDay() > 1) {
      date = new Date(date.getTime() - (date.getDay() - 1) * this.DAY_MILLISECOND);
    } else if (date.getDay() == 0) {
      date = new Date(date.getTime() - 6 * this.DAY_MILLISECOND);
    }
    for (let i = 0; i <= index; i++) {
      firstDate = date;
      while (date.getDay()) {
        date = new Date(date.getTime() + 1 * this.DAY_MILLISECOND);
      }
      lastDate = date;
      date = new Date(date.getTime() + 1 * this.DAY_MILLISECOND);
    }
    return {
      firstDate: firstDate,
      lastDate: lastDate
    }
  }

  // 获取一年的所有周（周一为每周第一天，每年1号所在周为当年的第一周）
  getWeeksOfYear(year): {
    firstDate: Date,
    lastDate: Date
  }[] {
    let weeks = [];
    // 本年的第一周第一天的日期
    let firstDate = new Date(year, 0, 1);
    if (firstDate.getDay() == 0) {
      firstDate = new Date(firstDate.getTime() - 6 * this.DAY_MILLISECOND);
    } else {
      firstDate = new Date(firstDate.getTime() - (firstDate.getDay() - 1) * this.DAY_MILLISECOND);
    }
    // 本年的最后周最后一天的日期
    let lastDate = new Date(year, 11, 31);
    lastDate = new Date(lastDate.getTime() - firstDate.getDay() * this.DAY_MILLISECOND);
    while (firstDate.getTime() < lastDate.getTime()) {
      weeks.push({
        firstDate: new Date(firstDate.getTime()),
        lastDate: new Date(firstDate.getTime() + 7 * this.DAY_MILLISECOND-1)
      });
      firstDate = new Date(firstDate.getTime() + 7 * this.DAY_MILLISECOND);
    }
    return weeks;
  }

  // 获取日期所在周（周一为每周第一天，每年1号所在周为当年的第一周，从0开始表示第一周）
  getWeekOfDay(date: Date): {
    year: number,
    index: number,
    week: {
      firstDate: Date,
      lastDate: Date
    }
  } {
    let result;
    this.getWeeksOfYear(date.getFullYear()).find((week, i) => {
      let b = date >= week.firstDate && date <= week.lastDate;
      if (b) {
        result = {
          year: date.getFullYear(),
          index: i,
          week: week
        };
      }
      return b;
    });
    if (!result) {
      this.getWeeksOfYear(date.getFullYear() + 1).find((week, i) => {
        let b = date >= week.firstDate && date <= week.lastDate;
        if (b) {
          result = {
            year: date.getFullYear() + 1,
            index: i,
            week: week
          };
        }
        return b;
      });
    }
    return result;
  }

  // 获取日期所在季（从1开始表示第一季）
  getQuarterOfDay(date: Date): {
    year?: number,
    index?: number,
    quarter?: {
      firstDate: Date,
      lastDate: Date
    }
  } {
    let result;
    let year = date.getFullYear();
    let month = date.getMonth();
    if (month >= 0 && month <= 2) {
      result = {
        year: year,
        index: 1,
        quarter: {
          firstDate: new Date(year, 0, 1),
          lastDate: new Date(year, 2, 31)
        }
      };
    } else if (month >= 3 && month <= 5) {
      result = {
        year: year,
        index: 2,
        quarter: {
          firstDate: new Date(year, 2, 1),
          lastDate: new Date(year, 5, 30)
        }
      };
    } else if (month >= 6 && month <= 8) {
      result = {
        year: year,
        index: 3,
        quarter: {
          firstDate: new Date(year, 6, 1),
          lastDate: new Date(year, 8, 30)
        }
      };
    } else if (month >= 9 && month <= 11) {
      result = {
        year: year,
        index: 4,
        quarter: {
          firstDate: new Date(year, 9, 1),
          lastDate: new Date(year, 11, 31)
        }
      };
    }
    return result;
  }
}
