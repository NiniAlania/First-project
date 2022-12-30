$("#calendar").datepicker({
  format: "yyyy-mm-dd",
  multidate: true,
  todayHighlight: true,
  startDate: new Date().toISOString().split("T")[0],
});

function getDates() {
  return $("#calendar")
    .datepicker("getUTCDates")
    .map((date) => date.toISOString().split("T")[0]);
}

function setDates(dates) {
  $("#calendar").datepicker("setDatesDisabled", dates);
}
