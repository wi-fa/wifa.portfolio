//Declaring the chart variable
let myChart

// Setting the theme colors for the charts to match the root elements theme
const themeColors = {
    light: {
        textColor: 'black',
    },
    dark: {
        textColor: 'white',
    }
}

// Function to update the chart text and doughnut border colors depending on the theme
function updateChartColors(theme) {
    const currentThemeColors = themeColors[theme];
    // Line charts changes
    if (myChart) {
        myChart.options.scales.y.ticks.color = currentThemeColors.textColor;
        myChart.options.scales.x.ticks.color = currentThemeColors.textColor;
        myChart.options.plugins.legend.labels.color = currentThemeColors.textColor;
        myChart.options.plugins.title.color = currentThemeColors.textColor;
        myChart.update();
    }
    const doughnutChart = Chart.getChart('myDonutChart');
    // Donut changes
    if (doughnutChart) {
        doughnutChart.options.plugins.legend.labels.color = currentThemeColors.textColor;
        doughnutChart.options.plugins.title.color = currentThemeColors.textColor;
        doughnutChart.update();
    }
}

// Function to initialize chart colors based on the current theme
function initChartColors() {
    // Getting the theme from local or setting it to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    // Updating the colors depending on what theme is in localstorage
    updateChartColors(currentTheme);
}

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

async function updateChart(days) {
    // Fetching the data for specific amount of days
    const statsData = await fetchData(days)
    // Creating an array for visitData with 0
    let visitsData = new Array(days).fill(0)
    // Setting the array with the real data
    statsData.dailyVisits.forEach((visit, i) => {
        visitsData[days - statsData.dailyVisits.length + i] = visit
    })
    // Setting the chart structure
    const chartData = {
        // Creating labels for each day from the API
        labels: [...Array(days).keys()].map((day) => `Day ${day + 1}`),
        datasets: [
            {
                // Labels, data and styling
                label: 'Visitors',
                data: visitsData,
                borderColor: '#2bd890',
                backgroundColor: '#2bd890',
                borderWidth: 2
            }
        ]
    }
    // Getting the canvas for the right chart
    const ctx = document.getElementById('my7DaysChart')
    if (myChart) {
        // Updating the existing chart data
        myChart.data = chartData
        // Updating chart
        myChart.update()
    } else {
        // Creating new chart if it doenst exist
        myChart = new Chart(ctx, {
            // Chart config
            // Type of chart
            type: 'line',
            data: chartData,
            // Chart options
            options: {
                // Making chart responsive
                responsive: true,
                maintainAspectRatio: false,
                // y and x axis config
                scales: {
                    y: {
                        // y axis max
                        suggestedMax: 100,
                        beginAtZero: true,
                        ticks: {
                            // Step between ticks
                            stepSize: 20,
                            // Tick styles
                            color: themeColors.dark.textColor,
                            font: { family: 'system-ui' }
                        }
                    },
                    x: {
                        // X axis ticks styling
                        ticks: {
                            color: themeColors.dark.textColor,
                            font: { family: 'system-ui' }
                        }
                    }
                },
                plugins: {
                    legend: {
                        // Legend position
                        position: 'top',
                        // Label styles
                        labels: {
                            color: themeColors.dark.textColor,
                            font: { family: 'system-ui' }
                        }
                    },
                    // Title styles
                    title: {
                        display: true,
                        text: 'Total visits on the homepage',
                        color: themeColors.dark.textColor,
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
            Chart.getChart(ctx).destroy()
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
                            color: themeColors.dark.textColor,
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

// DOMContentLoaded event listener to initialize charts and buttons
document.addEventListener('DOMContentLoaded', async () => {
    // Update the line chart
    await updateChart(daysMode);
    // Render the doughnut chart
    await renderPageVisitDonutChart();
    // Setting chart color depending on the theme
    initChartColors();
    // Setting chart toggle button styles to show the active chart
    updateButtonStyles();
    // Moving the button with javascript since chart.js is stupid and streching down until the page crashes
    repositionButtons();
});

// Theme toggle event listener
document.getElementById('theme-toggle').addEventListener('change', async function(e) {
    let theme;
    // Check if the toggle switch is in the 'checked' state
    if (e.target.checked) {
        // Set theme to dark if the toggle is checked
        theme = 'dark';
    } else {
        // Set theme to light if the toggle is not checked
        theme = 'light';
    }

    // Apply the selected theme to the root element and then store it in local storage
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Setting chart color depending on the theme
    initChartColors();
    // Update the line chart
    await updateChart(daysMode);
    // Render the doughnut chart
    await renderPageVisitDonutChart();
    // Setting chart toggle button styles to show the active chart
    updateButtonStyles();
});

// Function to update the tooltip based on the display mode
function updateTooltipForDisplayMode() {
    // Get the donutchart instance
    const chart = Chart.getChart('myDonutChart')
    if (chart) {
        // Setting the tooltip label depending if percent or visits
        chart.options.plugins.tooltip.callbacks.label = function (context) {
            let label = context.label || ''
            if (label) {
                label += ': '
            }
            if (displayMode === 'percent') {
                // Getting the percent
                let value = context.raw
                let sum = context.chart.data.datasets[0].data.reduce(
                    (a, b) => a + b,
                    0
                )
                let percentage = ((value * 100) / sum).toFixed(2) + '%'
                label += percentage
            } else {
                // In visits mode, just show the visit count from db
                label += context.raw
            }
            // return the label
            return label
        }
        // Update the chart to display the changes
        chart.update()
    }
}

// Function to update button styles
function updateButtonStyles() {
    const btnPercent = document.getElementById('btnPercent')
    const btnVisits = document.getElementById('btnVisits')
    const btnSevenDays = document.getElementById('btnSevenDays')
    const btnThirtyDays = document.getElementById('btnThirtyDays')

    // Update styles for percentage/visits buttons depending on what mode is active
    btnPercent.style.backgroundColor =
        displayMode === 'percent' ? 'rgb(29, 130, 87)' : ''
    btnVisits.style.backgroundColor =
        displayMode === 'visits' ? 'rgb(29, 130, 87)' : ''

    // Update styles for 7 days/30 days buttons depepending on what mode is active
    btnSevenDays.style.backgroundColor =
        daysMode === 7 ? 'rgb(29, 130, 87)' : ''
    btnThirtyDays.style.backgroundColor =
        daysMode === 30 ? 'rgb(29, 130, 87)' : ''
}

// Event listeners for the donut chart buttons
document.getElementById('btnPercent').addEventListener('click', () => {
    // Set displaymode to percent
    displayMode = 'percent'
    // Updating tooltipcontent
    updateTooltipForDisplayMode()
    // Updating btn styles
    updateButtonStyles()
})
document.getElementById('btnVisits').addEventListener('click', () => {
    // Set displaymode to visits
    displayMode = 'visits'
    // Updating the tooltipcontent
    updateTooltipForDisplayMode()
    // Updating btn styles
    updateButtonStyles()
})

// Event listeners for the 7 days line chart buttons
document.getElementById('btnSevenDays').addEventListener('click', () => {
    daysMode = 7
    // Calling updateChart with 7 days
    updateChart(7)
    // Updating btn styles
    updateButtonStyles()
})
// Event listeners for the 30 days line chart buttons
document.getElementById('btnThirtyDays').addEventListener('click', () => {
    daysMode = 30
    // Calling updateChart with 30 days
    updateChart(30)
    // Updating btn styles
    updateButtonStyles()
})

// Function to handle the repositioning of buttons based on screen width
// This was becuase chart js is a real pain in the ass. When i placed the button below the
// chart container the cart kept streching down when the page was loaded making the page
// crash so i had to position the btns like this..
function repositionButtons() {
    // Get the width of the window
    const screenWidth = window.innerWidth

    // Get the buttons and the chart containers
    const btnContainerForFirstChart = document.querySelector(
        '#buttons-for-first-chart'
    )
    const btnContainerForSecondChart = document.querySelector(
        '#buttons-for-second-chart'
    )
    const firstChartContainer = document.querySelector('#dash-card-1')
    const secondChartContainer = document.querySelector('#dash-card-2')

    // Check if we're in mobile view
    if (screenWidth < 768) {
        // If in mobile view, insert the button containers before their respective charts
        firstChartContainer.parentNode.insertBefore(
            btnContainerForFirstChart,
            firstChartContainer
        )
        secondChartContainer.parentNode.insertBefore(
            btnContainerForSecondChart,
            secondChartContainer.nextSibling
        )
    } else {
        // If in desktop view, restore the button containers to their original position
        const chartBtnContainer = document.querySelector('#chart-btn')
        if (chartBtnContainer) {
            chartBtnContainer.appendChild(btnContainerForFirstChart)
            chartBtnContainer.appendChild(btnContainerForSecondChart)
        }
    }
}

// Add event listener for window resize
window.addEventListener('resize', repositionButtons)

// Variables for display mode and days mode
let displayMode = 'percent';
let daysMode = 7;
