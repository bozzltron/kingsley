module.exports = {
  getTheTime: () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const daysOfTheWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var d = new Date();
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();
    var month = monthNames[date.getUTCMonth()];
    var dayOfTheWeek = daysOfTheWeek[date.getDay()];
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minutesString = minutes < 10 ? "0" + minutes : "" + minutes;
    return Promise.resolve({
      text: `It's ${hours}:${minutesString} ${ampm} on ${dayOfTheWeek} ${month} ${day}, ${year}.`,
    });
  },
};
