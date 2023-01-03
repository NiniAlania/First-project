// $('#calendar').datepicker({
//   format: "yyyy-mm-dd",
//   multidate: true,
//   todayHighlight: true,
//   startDate: new Date().toISOString().split('T')[0],
// });

// function getDates() {
//   return $('#calendar').datepicker('getUTCDates').map(date => date.toISOString().split('T')[0]);
// }

// function setDates(dates) {
//   $('#calendar').datepicker('setDatesDisabled', dates);
// }

// $('#calendar').datepicker()
//     .on("changeDate", function(e) {
//         console.log(e);
//     });

let calendar;

document.addEventListener('DOMContentLoaded', () => {
  calendar = new VanillaCalendar('#calendar', {
    type: 'default',
    settings: {
      range: {
        min: new Date().toISOString().split('T')[0],
      },
      selection: {
        day: 'multiple-ranged',
      },
    }
  });
  calendar.init();
});

function removeDate(date) {
  delete calendar.popups[date];
  calendar.update();
}

function getDates() {
  const dates = [];
  dates.push(...calendar.settings.selected.dates);
  dates.push(...Object.keys(calendar.popups));
  return dates;;
}

function setDates(dates) {
  calendar.settings.selected.dates = [];
  calendar.popups = Object.fromEntries(dates.map(date => [date, { modifier: 'bg-red', html: `<button onclick="removeDate('${date}')">Remove</button>`}]));
  calendar.update();
}