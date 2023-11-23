// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Selects all elements with the class 'message-card'
    const messageCards = document.querySelectorAll('.message-card');

    // Iterates over each message card
    messageCards.forEach(card => {
        // Adds a click event listener to the element with class 'message-summary' inside the card
        card.querySelector('.message-summary').addEventListener('click', () => {
            // Selects the element with class 'message-details' inside the card
            const details = card.querySelector('.message-details');

            // Toggles the 'expanded' class on the details element
            // This is typically used to show or hide additional information
            details.classList.toggle('expanded');
        });
    });
});
