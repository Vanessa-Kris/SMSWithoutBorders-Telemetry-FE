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

        let filter = (category, from, to, type) => {
          if (category == "months") {
            filter_months();
          }
        };
        filter(category.value);

        function filter_months() {
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

          entry.forEach((element) => {
            if (
              new Date(element.date) > new Date("2022-02-01") &&
              new Date(element.date) < new Date("2022-08-19") &&
              element.type == "active"
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
          console.log(result);
          document.getElementById("length").innerHTML = result;
        }

        let headers = ["Month", "Users"];

        // call chart function
        line();
        bar();

        function line() {
          // Set a callback to run when the Google Visualization API is loaded.
          google.charts.setOnLoadCallback(drawChart);

          function drawChart() {
            result = [];

            // Condition for month types
            if (type == "active") {
              result.push(headers);

              entry.map(function (element) {
                data = [];

                data.push(element.Month);
                data.push(element.users);

                result.push(data);
              });
            } else {
              result.push([entry[0].Month, entry[0].users]);

              entry.map(function (element) {
                if (element.Type == type) {
                  data = [];

                  data.push(element.Month);
                  data.push(element.users);

                  result.push(data);
                }
              });
            }

            var data = google.visualization.arrayToDataTable(result);

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

            chart.draw(data, options);
          }
        }

        function bar() {
          // Set a callback to run when the Google Visualization API is loaded.
          google.charts.setOnLoadCallback(drawChart);

          function drawChart() {
            result = [];

            // Condition for month types
            if (type == "active") {
              result.push(headers);

              entry.map(function (element) {
                data = [];

                data.push(element.Month);
                data.push(element.users);

                result.push(data);
              });
            } else {
              result.push([entry[0].Month, entry[0].users]);

              entry.map(function (element) {
                if (element.Type == type) {
                  data = [];

                  data.push(element.Month);
                  data.push(element.users);

                  result.push(data);
                }
              });
            }

            var data = google.visualization.arrayToDataTable(result);
            // Set chart options
            var options = {
              vAxis: {
                title: "Days",
                format: "0",
              },

              hAxis: {
                title: "Months",
                minValue: 0,
              },
              title: "Monthly Subscribers Visualization",
              height: 250,
            };

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.BarChart(
              document.getElementById("bar_div")
            );

            chart.draw(data, options);
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
