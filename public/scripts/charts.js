//Declaring the chart variable
let myChart

// Asynchronous function to fetch data from an API endpoint
async function fetchDayData(days) {
    // Using 'fetch' to make an HTTP request to the specified endpoint
    const response = await fetch(`/api/page-stats?days=${days}`)

    // Parsing the JSON response body
    const data = await response.json()

    // Logging the fetched data to the console for debugging
    console.log('Fetched data:', data)

    // Returning the data received from the API
    return data
}

// Asynchronous function to fetch data from an API endpoint
async function fetchData() {
    // Using 'fetch' to make an HTTP request to the specified endpoint
    const response = await fetch('/api/page-stats')

    // Parsing the JSON response body
    const data = await response.json()

    // Logging the fetched data to the console for debugging
    console.log('Fetched data:', data)

    // Returning the data received from the API
    return data
}

// Function to update or create the chart
async function updateChart(days) {
    // Fetch data for the specified number of days from the API
    const statsData = await fetchData(days)

    // Creating an array to store the number of visits for each day
    let visitsData = new Array(days).fill(0)

    // Here we loop over the fetched daily visits data
    for (let i = 0; i < statsData.dailyVisits.length; i++) {
        // Adding the data from visitsData to the array so its match the right day
        visitsData[days - statsData.dailyVisits.length + i] =
            statsData.dailyVisits[i]
    }

    // Setting up the data to be displayed in the chart
    const chartData = {
        // Creating labels for each day (day 1, day 2, day 3 etc)
        labels: [...Array(days).keys()].map((day) => `Day ${day + 1}`),
        datasets: [
            {
                // Name of the data
                label: 'Visitors',
                // The data itself
                data: visitsData,
                // Styling for the data
                borderColor: '#2bd890',
                backgroundColor: '#2bd890',
                borderWidth: 2
            }
        ]
    }

    // Selecting the canvas element from DOM
    const ctx = document.getElementById('my7DaysChart')

    // Checking if the chart already exists
    if (myChart) {
        // If chart already exists, update its data
        myChart.data = chartData
        myChart.update()
    } else {
        // If not, we create a new chart
        myChart = new Chart(ctx, {
            // Type of chart
            type: 'line',
            // Actual data
            data: chartData,
            // Chart option like behavior, responsiveness, scales etc
            options: {
                // Makes the chart responsive to window resizing
                responsive: true,
                // Making it super responsive. :D
                maintainAspectRatio: false,
                scales: {
                    y: {
                        // Configuration for the Y-axis
                        // Setting maximum value
                        suggestedMax: 100,
                        // Starts scale from zero
                        beginAtZero: true,
                        ticks: {
                            // Step size between ticks
                            stepSize: 20,
                            // Tick styling
                            color: 'white',
                            font: { family: 'system-ui' } // Font style for the ticks
                        }
                    },
                    x: {
                        // Configuration for the X-axis, in this case only styling
                        ticks: {
                            color: 'white',
                            font: { family: 'system-ui' }
                        }
                    }
                },
                plugins: {
                    // This datalabels was i plugin i used to show percentage in the actual chart
                    // I removed it because it didnt give me the result i wanted
                    // But im keeping it here for future if i want to use it again
                    // But for now its set to display false..
                    datalabels: {
                        display: false // Hide the data labels
                    },
                    // Configuration for the chart legend
                    legend: {
                        // Position of the legend
                        position: 'top',
                        labels: {
                            // Styling for the labels
                            color: 'white',
                            font: { family: 'system-ui' }
                        }
                    },
                    // Configuration for the chart title
                    title: {
                        // Text and styling for the title
                        display: true,
                        text: 'Total visits on the homepage',
                        color: 'white',
                        font: { family: 'system-ui' }
                    }
                }
            }
        })
    }
}

// Might want to use this later..
// Chart.register(ChartDataLabels)

// Asynchronous function to render page visit statistics as a doughnut chart
async function renderPageVisitDonutChart() {
    // Fetching the stats data from my API
    const statsData = await fetchData()

    // Checking if the data exists
    if (statsData.pageVisitCounts) {
        // Getting the names of my pages and number of visits for each page
        const pageNames = statsData.pageVisitCounts.map((item) => item[0])
        const visitCounts = statsData.pageVisitCounts.map((item) => item[1])

        // Getting the canvas element from DOM
        const ctx = document.getElementById('myDonutChart')

        // Check if there's already a chart instance and destroy it
    if (Chart.getChart(ctx)) {
        Chart.getChart(ctx).destroy();
    }

        // Creating a new chart
        new Chart(ctx, {
            // Type of chart
            type: 'doughnut',
            data: {
                // Labels for each page collected from API
                labels: pageNames,
                datasets: [
                    {
                        // Actual data
                        data: visitCounts,
                        // Chart styling
                        borderColor: '#000000',
                        backgroundColor: [
                            '#2bd890',
                            '#d2f00e',
                            '#33e7f3',
                            '#fd650f',
                            'red'
                        ]
                    }
                ]
            },
            // Chart options.. again..
            options: {
                // Setting the chart to be responsive
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    // This datalabels was i plugin i used to show percentage in the actual chart
                    // I removed it because it didnt give me the result i wanted
                    // But im keeping it here for future if i want to use it again
                    // But for now its set to display false..
                    datalabels: {
                        display: false // Hide the data labels
                    },
                    // Configuration for the chart legend
                    legend: {
                        // Legend position
                        position: 'top',
                        // Label styling
                        labels: {
                            color: 'white',
                            font: { family: 'system-ui' }
                        }
                    },
                    // Title text and styling
                    title: {
                        display: true,
                        text: 'Page Visits',
                        color: 'white',
                        font: { family: 'system-ui' }
                    },
                    // Configuration for the chart tooltip
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                // Setting label to empty string if label doesnt exist
                                let label = context.label || ''
                                // If label exist we adding a : and a space
                                if (label) {
                                    label += ': '
                                }
                                // Getting the value from the context
                                let value = context.raw
                                // Getting the sum of all data values
                                let sum =
                                    context.chart.data.datasets[0].data.reduce(
                                        (a, b) => a + b,
                                        0
                                    )
                                // Calculating the percentage of the value
                                let percentage =
                                    ((value * 100) / sum).toFixed(2) + '%'
                                //Adding the percentage to the label and then returning it
                                label += percentage
                                return label
                            }
                        }
                    }
                },
                // Font styling
                font: {
                    family: "'system-ui', '-apple-system', 'BlinkMacSystemFont'",
                    color: 'white'
                }
            }
        })
    }
}


// Function to update the tooltip based on the display mode
function updateTooltipForDisplayMode() {
    // Get the chart instance
    const chart = Chart.getChart('myDonutChart')
    if (chart) {
        chart.options.plugins.tooltip.callbacks.label = function (context) {
            let label = context.label || ''
            if (label) {
                label += ': '
            }
            if (displayMode === 'percent') {
                let value = context.raw
                let sum = context.chart.data.datasets[0].data.reduce(
                    (a, b) => a + b,
                    0
                )
                let percentage = ((value * 100) / sum).toFixed(2) + '%'
                label += percentage
            } else {
                // In 'visits' mode, just show the raw visit count
                label += context.raw
            }
            return label
        }
        // Update the chart to display the changes
        chart.update()
    }
}

// Event listener for the 'Show Percentage' button
document.getElementById('btnPercent').addEventListener('click', () => {
    // Change mode to 'percent'
    displayMode = 'percent'
    // Update the tooltip
    updateTooltipForDisplayMode()
})

// Event listener for the 'Show Visits' button
document.getElementById('btnVisits').addEventListener('click', () => {
    // Change mode to 'visits'
    displayMode = 'visits'
    // Update the tooltip
    updateTooltipForDisplayMode()
})

// Initial chart rendering (already in your code)
renderPageVisitDonutChart()

// Function to update button styles
function updateButtonStyles() {
    const btnPercent = document.getElementById('btnPercent')
    const btnVisits = document.getElementById('btnVisits')
    const btnSevenDays = document.getElementById('btnSevenDays')
    const btnThirtyDays = document.getElementById('btnThirtyDays')

    // Update styles for percentage/visits buttons
    btnPercent.style.backgroundColor = displayMode === 'percent' ? 'rgb(29, 130, 87)' : ''
    btnVisits.style.backgroundColor = displayMode === 'visits' ? 'rgb(29, 130, 87)' : ''

    // Update styles for 7 days/30 days buttons
    btnSevenDays.style.backgroundColor = daysMode === 7 ? 'rgb(29, 130, 87)' : ''
    btnThirtyDays.style.backgroundColor = daysMode === 30 ? 'rgb(29, 130, 87)' : ''
}

// Event listeners for the donut chart buttons
document.getElementById('btnPercent').addEventListener('click', () => {
    displayMode = 'percent'
    updateTooltipForDisplayMode()
    updateButtonStyles()
})

document.getElementById('btnVisits').addEventListener('click', () => {
    displayMode = 'visits'
    updateTooltipForDisplayMode()
    updateButtonStyles()
})

// Event listeners for the line chart buttons
document.getElementById('btnSevenDays').addEventListener('click', () => {
    daysMode = 7;
    // Calling updateChart with 7 days
    updateChart(7);
    updateButtonStyles();
});

document.getElementById('btnThirtyDays').addEventListener('click', () => {
    daysMode = 30;
    // Calling updateChart with 30 days
    updateChart(30);
    updateButtonStyles();
});

// setting variables to track the current display mode and days mode
// Default mode for donut chart
let displayMode = 'percent';
// Default mode for line chart (7 or 30 days)
let daysMode = 7;

// Setting the chart with the default view when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Setting the line chart with default days mode
    updateChart(daysMode);
    // Render my donut chart
    renderPageVisitDonutChart();
    // Setting initial styles for the buttons
    updateButtonStyles();
})

// Function to handle the repositioning of buttons based on screen width
function repositionButtons() {
    // Get the width of the window
    const screenWidth = window.innerWidth;

    // Get the buttons and the chart containers
    const btnContainerForFirstChart = document.querySelector('#buttons-for-first-chart');
    const btnContainerForSecondChart = document.querySelector('#buttons-for-second-chart');
    const firstChartContainer = document.querySelector('#dash-card-1');
    const secondChartContainer = document.querySelector('#dash-card-2');

    // Check if we're in mobile view
    if (screenWidth < 768) {
      // If in mobile view, insert the button containers before their respective charts
      firstChartContainer.parentNode.insertBefore(btnContainerForFirstChart, firstChartContainer);
      secondChartContainer.parentNode.insertBefore(btnContainerForSecondChart, secondChartContainer.nextSibling);
    } else {
      // If in desktop view, restore the button containers to their original position
      const chartBtnContainer = document.querySelector('#chart-btn');
      if (chartBtnContainer) {
        chartBtnContainer.appendChild(btnContainerForFirstChart);
        chartBtnContainer.appendChild(btnContainerForSecondChart);
      }
    }
  }

  // Add event listener for window resize
  window.addEventListener('resize', repositionButtons);

  // Call the function on script load to check initial position
  repositionButtons();
