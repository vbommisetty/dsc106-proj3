document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('yearRange');
    const yearDisplay = document.getElementById('yearDisplay');
    const circleContainers = document.querySelectorAll('.circle-container');

    function colorScale(crimeRate, vi) {
        // Define color scale using D3.js
        const color = d3.scaleLinear()
            .domain([0, 0.34]) // Adjust the domain based on your data
            .range(["green", "red"]);
        return color(vi / crimeRate);
    }

    function radius(crimeRate) {
        // Define radius scale using D3.js
        const rad = d3.scaleSqrt()
            .domain([0, 53.89]) // Adjust the domain based on your data
            .range([0, 20]);
        return rad(crimeRate);
    }

    function displayDataForYear(year) {
        fetch('SANDAG_Crime_Data_20240512.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').slice(1); // Skip header
                const filteredData = rows
                    .map(row => row.split(','))
                    .filter(row => row[0] === year.toString());

                filteredData.forEach(row => {
                    console.log(row)
                    const location = row[1];
                    const crimeRate = parseFloat(row[2]);
                    const vi = parseFloat(row[3]);
                    const circleContainer = Array.from(circleContainers).find(container => container.querySelector('.text').textContent === location);
                    if (circleContainer) {
                        const circle = circleContainer.querySelector('.circle');
                        circle.style.backgroundColor = colorScale(crimeRate, vi);
                        const circleRadius = radius(crimeRate);
                        circle.style.width = `${circleRadius * 2}px`; // Diameter
                        circle.style.height = `${circleRadius * 2}px`; // Diameter
                    }
                });
            });
    }

    slider.addEventListener('input', function() {
        yearDisplay.textContent = slider.value;
        displayDataForYear(slider.value);
    });

    // Initial display
    displayDataForYear(slider.value);
});

document.addEventListener("DOMContentLoaded", function () {
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    // Load the CSV file
    d3.csv("SANDAG_Crime_Data_20240512.csv").then(function(data) {
        // Function to find data by location and year
        function findDataByLocationAndYear(location, year) {
            return data.filter(d => d.Jurisdiction === location && d.year === year);
        }

        var slider = document.getElementById('slider-container');  // Make sure this matches your slider's ID
        var yearDisplay = document.getElementById('yearDisplay'); // And this matches your display element's ID

        function displayDataForYear(selectedYear) {
            // Update display of the year
            yearDisplay.textContent = selectedYear;

            // Select all circle containers
            var circleContainers = d3.selectAll(".circle-container");

            // Update circles based on the selected year
            circleContainers.each(function() {
                var container = d3.select(this);
                var locationName = container.select(".text").text();
                var locationData = findDataByLocationAndYear(locationName, selectedYear);

                container.select(".circle")
                    .on("mouseover", function () {
                        tooltip.style("opacity", 0.9);
                    })
                    .on("mousemove", function (event) {
                        var text = locationName;
                        if (locationData.length > 0) {
                            var data = locationData[0];  // Assuming the first match is what we want
                            text += ": Total Crime " + data.Crimerate + ", Violent " + data.Violentcrimerate + ", Property " + data.Propertycrimerate;
                        } else {
                            text += ": No data available for " + selectedYear;
                        }
                        tooltip.html(text)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY + 10) + "px");
                    })
                    .on("mouseout", function () {
                        tooltip.style("opacity", 0);
                    });
            });
        }

        // Slider event listener
        slider.addEventListener('input', function() {
            displayDataForYear(slider.value);
        });

        // Initial display
        displayDataForYear(slider.value);
    });
});
