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

function getReservations() {
  return Object.entries(calendar.popups ?? {}).map(([date, data]) => {
      return {
          "date": date, 
          "userId": data.userId
      }
  });
}

function setReservations(reservations, currentUserId) {
  calendar.settings.selected.dates = [];
  calendar.popups = Object.fromEntries(reservations.map(({date, userId}) => [date, { modifier: 'bg-red', html: (currentUserId === undefined || userId === currentUserId) ? `<button onclick="removeDate('${date}')">Remove</button>` : '', userId: userId}]));
  calendar.update();
}

function getSelectedDates() {
  return calendar.settings.selected.dates ?? [];
}