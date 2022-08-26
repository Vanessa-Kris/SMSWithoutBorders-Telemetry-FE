function plotFunction() {
  // Default
  // Load google API
  google.charts.load("current", {
    packages: ["corechart"],
  });
  // get months input type
  let input = document.getElementById("type");

  run(input.value);

  input.addEventListener("change", () => {
    run(input.value);
  });

  function run(type) {
    let xhttp = new XMLHttpRequest();

    // Make AJAX call
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let entry = JSON.parse(this.responseText);
        let category = document.getElementById("category");
        let start_month = document.getElementById("start_month");
        let end_month = document.getElementById("end_month");
        let type = document.getElementById("type");
        let start_date = document.getElementById("start_date");
        let end_date = document.getElementById("end_date");

        let filter = (
          category,
          start_month,
          end_month,
          type,
          start_date,
          end_date
        ) => {
          if (category == "months") {
            return filter_months(start_month, end_month, type);
          } else {
            return filter_days(start_date, end_date, type);
          }
        };

        let filter_data = filter(
          category.value,
          start_month.value,
          end_month.value,
          type.value,
          start_date.value,
          end_date.value
        );

        function filter_months(start_month, end_month, type) {
          const month = [
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

          let filter_data = [];

          console.log(start_month);
          console.log(end_month);

          entry.forEach((element) => {
            if (
              new Date(element.date).getFullYear() >=
              new Date(start_month).getFullYear() &&
              new Date(element.date).getMonth() >=
              new Date(start_month).getMonth() &&
              new Date(element.date).getFullYear() <=
              new Date(end_month).getFullYear() &&
              new Date(element.date).getMonth() <=
              new Date(end_month).getMonth() &&
              element.type == type
            ) {
              filter_data.push(month[new Date(element.date).getMonth()]);
            }
          });
          let data = {};

          filter_data.forEach((element) => {
            data[element] = (data[element] || 0) + 1;
          });

          let result = Object.keys(data).map((key) => {
            return [key, data[key]];
          });

          return result
        }

        function filter_days(start_date, end_date, type) {
          let filter_data = [];

          entry.forEach((element) => {
            if (
              new Date(element.date) >= new Date(start_date) &&
              new Date(element.date) <= new Date(end_date) &&
              element.type == type
            ) {
              filter_data.push(new Date(element.date));
            }
          });
          let data = {};

          filter_data.forEach((element) => {
            data[element] = (data[element] || 0) + 1;
          });

          let result = Object.keys(data).map((key) => {
            return [key, data[key]];
          });

          return result
        }


        let headers = ["Month", "Users"];

        // call chart function
        document.getElementById("length").innerHTML = filter_data;
        filter_data.unshift(headers)

        line(filter_data);
        bar(filter_data);

        function line(data) {
          // Set a callback to run when the Google Visualization API is loaded.
          google.charts.setOnLoadCallback(drawChart);
          
          function drawChart() {

            var result = google.visualization.arrayToDataTable(data);

            // Set chart options
            var options = {
              vAxis: {
                title: "Days",
                format: "0",
                minValue: 0,
              },
              hAxis: {
                title: "Months",
              },
              title: "Monthly Subscribers Visualization",
              height: 250,
            };

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.LineChart(
              document.getElementById("line_div")
            );

            chart.draw(result, options);
          }
        }

        function bar(data) {
          // Set a callback to run when the Google Visualization API is loaded.
          google.charts.setOnLoadCallback(drawChart);
          function drawChart() {

            var result = google.visualization.arrayToDataTable(data);

            // Set chart options
            var options = {
              vAxis: {
                title: "Days",
                format: "0",
                minValue: 0,
              },
              hAxis: {
                title: "Months",
              },
              title: "Monthly Subscribers Visualization",
              height: 250,
            };

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.BarChart(
              document.getElementById("bar_div")
            );

            chart.draw(result, options);
          }
        }
      }
    };

    xhttp.open(
      "GET",
      "https://62ffa49234344b6431fe43fc.mockapi.io/statistics",
      true
    );
    xhttp.send();
  }
}