import importModule from '../../spec-utils/import-module';

function hasCSSClasses(hash, classes){
  return classes.filter(clazz=>!!hash[clazz]).length === classes.length;
}

function getDatesWithClass(model, clazz){
  return [].concat.apply([], model.weeks).filter(d=>d.classes[clazz]);
}

function verifyDateRangeHasClass(model, [start, end], clazz){
  var result = {pass:false, message:''};
  var datesInRangeWithClass = [].concat.apply([], model.weeks).filter(d=>
    d.classes[clazz]
  );
}

describe('CalendarDatePickerModel', ()=>{
  var CalendarDatePickerModel = null;

  beforeEach(async function(done){
    CalendarDatePickerModel = CalendarDatePickerModel || (
      await importModule("elements/common/CalendarDatePickerModel", {})
    ).default;
    done();
  });

  beforeEach(function(){
    jasmine.addMatchers({
      toHaveDays(util){
        return {
          compare: function(actual, {month, year, weeks}){
            var result = {pass:false, message:''};
            var badDaysMessages = actual.weeks.reduce((acc, week, weekIndex)=>{
              week.forEach((day, dayIndex)=>{
                var expectedDay = weeks[weekIndex][dayIndex];
                var expectedDayObj =
                  expectedDay
                    ? {
                      text: expectedDay ? ''+expectedDay : '',
                      value: new Date(year, month, expectedDay).toLocaleDateString()
                    }
                    : {text:'', value:null}

                var actualDayObj = {
                  text:day.text,
                  value:day.value ? day.value.toLocaleDateString() : day.value
                };

                if(!util.equals(expectedDayObj, actualDayObj))
                  acc.push(`
                    Expected date ${JSON.stringify(expectedDayObj)}, but got ${
                    JSON.stringify(actualDayObj)
                    }
                  `)
              });

              return acc;
            }, []);

            result.pass = !badDaysMessages.length;
            result.message = badDaysMessages.join('\n');

            return result;
          }
        };
      },
      toHaveSelectedDateRange(){
        return {
          compare: function(actual, expected){
            var result = {pass:false, message:''};
            var [expectedStartDate, expectedEndDate] = expected;
            var actualSelectedDates = getDatesWithClass(actual, 's-selected');
            var unwantedSelectedDate = actualSelectedDates.filter(date=>
              date <= expectedStartDate && date >= expectedEndDate
            );

            result.pass =
              !unwantedSelectedDate.length &&
              actualSelectedDates.length === (expectedEndDate - expectedStartDate + 1 || 0)

            result.message = `
              Expected selected days ${expectedStartDate} - ${expectedEndDate}, but instead got:
              ${actualSelectedDates.map(d=>d.value && d.value.getDate()).join(', ') || '<none>'}
            `;

            return result;
          }
        };
      },
      toHaveStartEndDates(){
        return {
          compare: function(actual, expected){
            var result = {pass:false, message:''};
            var [expectedStartDate, expectedEndDate] = expected;
            var actualStartDates = getDatesWithClass(actual, 's-start-date');
            var actualEndDates = getDatesWithClass(actual, 's-end-date');

            result.pass =
              (expectedStartDate
                ? actualStartDates.length === 1 &&
                  actualStartDates[0].value.getDate() === expectedStartDate
                : actualStartDates.length === 0) &&
              (expectedEndDate
                ? actualEndDates.length === 1 &&
                  actualEndDates[0].value.getDate() === expectedEndDate
                : actualEndDates.length === 0);

            result.message = `
              Expected start date ${expectedStartDate || '<none>'}, but instead got:
              ${actualStartDates.map(d=>d.value && d.value.getDate()).join(', ') || '<none>'}

              Expected end date ${expectedEndDate || '<none>'}, but instead got:
              ${actualEndDates.map(d=>d.value && d.value.getDate()).join(', ') || '<none>'}
            `;

            return result;
          }
        };
      },
      toHaveEndDate(){
        return {
          compare: function(actual, expected){
            var result = {pass:false, message:''};
            var actualSelectedDates = getDatesWithClass(actual, 's-end-date');

            result.pass =
              actualSelectedDates.length === 1 &&
              actualSelectedDates[0].value.getDate() === expected;

            result.message = `
              Expected end date ${expected}, but instead got:
              ${actualSelectedDates.map(d=>d.value.getDate()).join(', ') || '<none>'}
            `;

            return result;
          }
        };
      }
    });
  });

  describe('constructor(year:int, month:int)', ()=>{
    it('@weeks is an array of arrays of days (initially unselected)', function(){
      expect(new CalendarDatePickerModel(2014,4)).toHaveDays({
        year: 2014,
        month: 4,
        weeks: [
          [ 0,  0,  0,  0,  1,  2,  3],
          [ 4,  5,  6,  7,  8,  9, 10],
          [11, 12, 13, 14, 15, 16, 17],
          [18, 19, 20, 21, 22, 23, 24],
          [25, 26, 27, 28, 29, 30, 31]
        ]
      });

      expect(new CalendarDatePickerModel(2014,5)).toHaveDays({
        year: 2014,
        month: 5,
        weeks: [
          [ 1,  2,  3,  4,  5,  6,  7],
          [ 8,  9, 10, 11, 12, 13, 14],
          [15, 16, 17, 18, 19, 20, 21],
          [22, 23, 24, 25, 26, 27, 28],
          [29, 30,  0,  0,  0,  0,  0]
          ]
      });
    });
  });

  describe('setSelectedDateRange(startDateTime:Date, endDateTime:Date)', ()=>{
    var model;

    beforeEach(()=>model = new CalendarDatePickerModel(2014, 5));

    it('sets appropriate classes when selected date range is within the month', ()=>{
      model.setSelectedDateRange(new Date(2014, 5, 1), new Date(2014, 5, 15));
      expect(model).toHaveSelectedDateRange([1, 15]);
      expect(model).toHaveStartEndDates([1,15]);
    });

    it('sets appropriate classes when selected date range outside the month', ()=>{
      model.setSelectedDateRange(new Date(2014, 4, 1), new Date(2014, 4, 15));
      expect(model).toHaveSelectedDateRange([]);
      expect(model).toHaveStartEndDates([]);

      model.setSelectedDateRange(new Date(2015, 5, 1), new Date(2015, 5, 15));
      expect(model).toHaveSelectedDateRange([]);
      expect(model).toHaveStartEndDates([]);
    });

    it('sets appropriate classes when selected date range overlaps the month', ()=>{
      model.setSelectedDateRange(new Date(2014, 4, 1), new Date(2014, 5, 15));
      expect(model).toHaveSelectedDateRange([1, 15]);
      expect(model).toHaveStartEndDates([undefined, 15]);

      model.setSelectedDateRange(new Date(2014, 5, 15), new Date(2014, 6, 15));
      expect(model).toHaveSelectedDateRange([15, 30]);
      expect(model).toHaveStartEndDates([15, undefined]);
    });
  });

  describe('setHoveredDate(date:int)', ()=>{
    var model;

    beforeEach(()=>model = new CalendarDatePickerModel(2014, 5));

    it('sets appropriate classes when expanding the range', ()=>{
      // model.setSelectedDateRange(new Date(2014, 4, 1), new Date(2014, 4, 15));
      // model.setHoveredDate(12);
      // expect(model).toHaveExpandingDateRange([1,12]);
      // expect(model).toHaveContractingDateRange([]);
      // expect(model).toHaveSelectedDateRange([]);
      // expect(model).toHaveStartEndDates([]);
    });
  });
});
