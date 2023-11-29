// Get the active page from the url
function extractActivePage() {
    // First we take the current path from window location
    const url = window.location.pathname

    // Extract the page name or default to 'home' if it's the root path
    const activePage = url.replace('/', '') || 'home'

    // Return the active page
    return activePage
}

//Locating the icons in the DOM
let menuIcons = document.querySelectorAll('svg')
let menuLinks = document.querySelectorAll('.menu-links')

// Function to change the colors of the svgs in the menu
function iconHoverColor(event) {
    let svgIcon = event.currentTarget.querySelector('svg')
    svgIcon.style.stroke = 'white' // Changing color to white
}

// Function to change the color back
function iconOriginalColor(event) {
    let svgIcon = event.currentTarget.querySelector('svg')
    svgIcon.style.stroke = 'currentColor' // Changing the color back
}

// When hoverig over the svgs they change color
menuLinks.forEach(function (link) {
    link.addEventListener('mouseover', iconHoverColor)
    link.addEventListener('mouseout', iconOriginalColor)
})

// Function to show the date in the dashboard
function updateDateTime() {
    const activePage = extractActivePage()
    if(activePage !== 'admin'){
        const now = new Date()

    // Format the date as 'dd/mm/yyyy'
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0') // Month is 0-indexed
    const year = String(now.getFullYear()).slice(-2)
    const formattedDate = `${day}/${month}/${year}`

    // Combine date and time with a line break
    document.getElementById('date-time').innerHTML = formattedDate
    }
}
// Initialize the date and time
updateDateTime()

// Update the date and time every second
setInterval(updateDateTime, 1000)

// Function to show the current data in a modal when editing a portfolioitem
function openModal(itemId) {
    //First we fetch the data for the current item
    axios
        .get(`/admin-dashboard/portfolio/edit-item/${itemId}`)
        .then((response) => {
            // Debugging code
            console.log(response.data)
            // Then we store the data in "item"
            const item = response.data

            // Adding the value to the form with the actual data for the portfolioitem were about to edit
            const modalHeader = document.getElementById('modal-h2')
            modalHeader.textContent = item.projectName
            modalHeader.style.textAlign = 'center'
            document.getElementById(
                'edit-portfolio-form'
            ).action = `/admin-dashboard/portfolio/edit-item/${itemId}`
            document.querySelector('#edit-portfolio-form [name="_id"]').value =
                item._id
            document.querySelector(
                '#edit-portfolio-form [name="projectType"]'
            ).value = item.projectType || ''
            document.querySelector(
                '#edit-portfolio-form [name="projectName"]'
            ).value = item.projectName || ''
            document.querySelector(
                '#edit-portfolio-form [name="projectDescription"]'
            ).innerText = item.projectDescription || ''
            document.querySelector(
                '#edit-portfolio-form [name="projectTools"]'
            ).value = item.projectTools || ''
            document.querySelector(
                '#edit-portfolio-form [name="projectLinkUrl"]'
            ).value = item.projectLink.url || ''
            document.querySelector(
                '#edit-portfolio-form [name="projectImgAlt"]'
            ).value = item.projectImgAlt || ''
            document.getElementById('projectImgPreview').src = item.projectImg

            //Adding the backdrop so the other content is grayed out during the edit
            document.getElementById('config-overlay').style.display = 'block'
            document.getElementById('backdrop').style.display = 'block'
        })
        // If error we log it and showing an alert
        .catch((error) => {
            console.error(error)
            alert('Error fetching item data')
        })
}

// Adding eventlisteners for all edit buttons
document.querySelectorAll('.edit-btn').forEach((button) => {
    // For each btn add a click event
    button.addEventListener('click', function (e) {
        // Adding prevent default action of the button
        e.preventDefault()
        // Retrieve the 'data-id' value of the clicked button
        const itemId = this.getAttribute('data-id')
        // Check if the item exist and open the edit modal
        if (itemId) {
            openModal(itemId)
        } else {
            // If itemId is null/undefined log error
            console.error('ObjectId is null or undefined')
        }
    })
})

// Handling the events when deleting a portfolioitem
document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', function (e) {
        // Adding prevent default action of the button
        e.preventDefault()
        // Retrieve the 'data-id' value of the clicked button
        const itemId = this.getAttribute('data-id')

        // Adding a confirmation box so no item accidentally is deleted
        if (confirm('Are you really sure that you want to delete this item? ')) {
            axios
                // Deleting the item with axios
                .delete(`/admin-dashboard/portfolio/delete-item/${itemId}`)
                .then((response) => {
                    // Debugging code
                    console.log(response)
                     // Removing the card from the DOM
                    this.closest('.portfolio-cards').remove()
                })
                // If error we catch it, log the error and showing an alert
                .catch((error) => {
                    console.error(error)
                    alert('Could not delete the object')
                })
        }
    })
})

// Closing the editmodal if the backdrop is clicked
function closeModal() {
    const activePage = extractActivePage()
    if(activePage === 'admin-dashboard/portfolio'){
        // Selecting the backdrop element from the DOM
    const backdropElement = document.getElementById('backdrop')
    // Closing the modal(changing href) when clicking on the backdrop
    backdropElement.addEventListener('click', function () {
        window.location.href = '/admin-dashboard/portfolio'
    })
    }
}
// Calling the function
closeModal()

document.addEventListener('DOMContentLoaded', function () {
    // Image preview;
    const activePage = extractActivePage()
    if (activePage === 'admin-dashboard/portfolio/add-item') {
        document
            .getElementById('addProjectImg')
            .addEventListener('change', function (event) {
                //When we add a image to the add form a preview of the image is shown
                const [file] = event.target.files
                // If a file is there we set the src to the image and changing the elements display to black
                if (file) {
                    document.getElementById('addImgPreview').src =
                        URL.createObjectURL(file)
                    document.getElementById('addImgPreview').style.display =
                        'block'
                }
            })
    }
})

// I had some problems with these buttons..
function theseDamnBtns() {
    const activePage = extractActivePage()
    if (activePage === 'admin-dashboard/portfolio/add-item') {
        // Adding a href for the btn-cancel when adding a portfolioitem
        document.addEventListener('DOMContentLoaded', function () {
            document
                .getElementById('btn-cancel')
                .addEventListener('click', function () {
                    window.location.href = '/admin-dashboard/portfolio'
                })
        })
    }
    if (activePage === 'admin-dashboard/portfolio') {
        // Adding a href for the cancel-update-btn when editing a portfolioitem
        document.addEventListener('DOMContentLoaded', function () {
            document
                .getElementById('cancel-update-btn')
                .addEventListener('click', function () {
                    window.location.href = '/admin-dashboard/portfolio'
                })
        })
    }
    // If the active page is admin
    if (activePage === 'admin') {
        // The
        const navBtn = document.getElementById('admin-navbar-btn')

        navBtn.addEventListener('click', () => {
            window.location.href = '/'
        })
    }

    if (activePage !== 'admin') {
        //Function attached to the get back arrow thats getting you to the previous page.
        document
            .getElementById('back-arrow')
            .addEventListener('click', function () {
                window.history.back()
            })
    }
}
theseDamnBtns()
