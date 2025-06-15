const fs = require('fs').promises;
const path = require('path');

const ITEMS_FILE = path.join(__dirname, 'items.json');

//Initializes the items.json file if it doesn't exist and resolves when file is created or already exists
async function initializeFile() {
    try {
        await fs.access(ITEMS_FILE);
    } catch {
        await fs.writeFile(ITEMS_FILE, JSON.stringify([]));
    }
}


//* Reads and parses the items from items.json

async function readItems() {
    const data = await fs.readFile(ITEMS_FILE, 'utf8');
    return JSON.parse(data);
}

//Writes items array to items.json
async function writeItems(items) {
    await fs.writeFile(ITEMS_FILE, JSON.stringify(items));
}

// Sends a standardized JSON response

function sendResponse(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// Validates item data structure and values
 function validateItem(item) {
    return item.name && 
           item.price && 
           ['s', 'm', 'l'].includes(item.size);
}

// Validates partial item data structure and values for PUT requests
 
function validatePartialItem(item) {
    return (
        (item.name || item.price || item.size) && // At least one field must be present
        (!item.size || ['s', 'm', 'l'].includes(item.size)) // If size is provided, it must be valid
    );
}

// Gets request body from POST/PUT requests
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}

// Gets the next ID for a new item based on the current items array
function getNextId(items) {
    return items.length > 0 ? Math.max(...items.map(item => parseInt(item.id))) + 1 : 1;
}

module.exports = {
    initializeFile,
    readItems,
    writeItems,
    sendResponse,
    validateItem,
    validatePartialItem,
    getRequestBody,
    getNextId
};