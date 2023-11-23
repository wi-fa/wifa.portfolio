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

// Function to show the current data in a modal when editing a portfolioitem
function openModal(itemId) {
    //First we fetch the data for the current item
    axios
        .get(`/admin-dashboard/portfolio/edit-item/${itemId}`)
        .then((response) => {
            console.log(response.data)
            const item = response.data // Then we store the data in "item"

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
        .catch((error) => {
            console.error(error)
            alert('Error fetching item data')
        })
}

document.querySelectorAll('.edit-btn').forEach((button) => {
    button.addEventListener('click', function (e) {
        e.preventDefault()
        const itemId = this.getAttribute('data-id')
        if (itemId) {
            openModal(itemId)
        } else {
            console.error('Objekt-ID är null eller undefined')
        }
    })
})

// Handling the events when deleting a portfolioitem
document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', function (e) {
        e.preventDefault()
        const itemId = this.getAttribute('data-id')

        // Adding a confirmation box so no item accidentally is deleted
        if (confirm('Är du säker på att du vill ta bort detta objekt?')) {
            axios
                .delete(`/admin-dashboard/portfolio/delete-item/${itemId}`)
                .then((response) => {
                    console.log(response)
                    this.closest('.portfolio-cards').remove() // Removing the card from the dom
                })
                .catch((error) => {
                    console.error(error)
                    alert('Fel vid borttagning av objektet')
                })
        }
    })
})

document.addEventListener('DOMContentLoaded', function () {
    // Image preview;
    const activePage = extractActivePage()
    if (activePage === 'admin-dashboard/portfolio/add-item') {
        document
            .getElementById('addProjectImg')
            .addEventListener('change', function (event) {
                //When we add a image to the add form a preview of the image is shown
                console.log('File input changed') // Check if this logs in the console
                const [file] = event.target.files
                // If a file is there we set the src to the image and changing the elements display to black
                if (file) {
                    console.log('File selected: ', file.name) // Check file details in the console
                    document.getElementById('addImgPreview').src =
                        URL.createObjectURL(file)
                    document.getElementById('addImgPreview').style.display =
                        'block'
                }
            })
    }
})

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
    if (activePage === 'admin') {
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
