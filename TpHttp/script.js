// Select the main elements
const headersList = document.getElementById('headers-list');
const addHeaderBtn = document.getElementById('add-header-btn');

/**
 * Creates and appends a new header row to the list
 */
function addHeaderRow() {
    // Create the row container
    const row = document.createElement('div');
    row.className = 'header-row';

    // Set the internal HTML
    row.innerHTML = `
        <input type="text" class="header-key" placeholder="Key">
        <input type="text" class="header-value" placeholder="Value">
        <button type="button" class="remove-header-btn">&times;</button>
    `;

    // Append to the list
    headersList.appendChild(row);
}

/**
 * Event Listener for adding a row
 */
addHeaderBtn.addEventListener('click', () => {
    addHeaderRow();
});

/**
 * Event Listener for removing a row (Event Delegation)
 * We listen on headersList so we don't have to re-bind 
 * listeners every time a new row is added.
 */
headersList.addEventListener('click', (event) => {
    // Check if the clicked element is a remove button
    if (event.target.classList.contains('remove-header-btn')) {
        event.target.parentElement.remove();
    }
});


const sendRequest = async (method, body, url, headers) => {
    try {
        body = JSON.stringify(body)
        const response = await fetch(url, {
            method: method,
            headers: headers,
            ...(method == "GET" || method == "DELETE" ? {} : { body: body })
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
    }
   return null;
}


const initializeEvents = () => {


    const sendBtn = document.getElementById('send-btn');
    sendBtn.addEventListener('click', async () => {
        const method = document.getElementById('method').value;
        const url = document.getElementById('url').value;
        const body = JSON.parse(document.getElementById('body').value || '{}');
        const headerRows = document.querySelectorAll('.header-row');
        const headers = {};
        headerRows.forEach(row => {
            const key = row.querySelector('.header-key').value.trim();
            const value = row.querySelector('.header-value').value.trim();
            if (key) {
                headers[key] = value;
            }
        });
       const response =  await sendRequest(method, body, url, headers);
       if(response){
        const responseBody = await response.text();
        document.getElementById('res-body').textContent = responseBody;
        document.getElementById('status-badge').textContent = `Status: ${response.status}`;
        document.getElementById('res-headers').textContent = `Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`;
       } else {
        document.getElementById('res-body').textContent = 'Error sending request';
       }
    });





}

const main = () => {
    initializeEvents();
}


main();