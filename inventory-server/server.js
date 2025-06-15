const http = require('http');
const { initializeFile, sendResponse } = require('./utils');
const handlers = require('./MethodHandlers'); // Import the handlers module
const PORT = 4000;

// Initialize the file system and ensure the data file exists
async function requestHandler(req, res) {
    await initializeFile();
    const { method, url } = req;
    const urlParts = url.split('/').filter(Boolean);

    try {
        switch (method) {
            case 'POST':
                if (url === '/items') {
                    await handlers.createItem(req, res);
                } else {
                    sendResponse(res, 404, { error: 'Route not found' });
                }
                break;

            case 'GET':
                if (url === '/items') {
                    await handlers.getAllItems(req, res);
                } else if (urlParts[0] === 'items' && urlParts[1]) {
                    await handlers.getItem(req, res, Number(urlParts[1]));
                } else {
                    sendResponse(res, 404, { error: 'Route not found' });
                }
                break;

            case 'PUT':
                if (urlParts[0] === 'items' && urlParts[1]) {
                    await handlers.updateItem(req, res, Number(urlParts[1]));
                } else {
                    sendResponse(res, 404, { error: 'Route not found' });
                }
                break;

            case 'DELETE':
                if (urlParts[0] === 'items' && urlParts[1]) {
                    await handlers.deleteItem(req, res, Number(urlParts[1]));
                } else {
                    sendResponse(res, 404, { error: 'Route not found' });
                }
                break;

            default:
                sendResponse(res, 404, { error: 'Route not found' });
        }
    } catch (error) {
        sendResponse(res, 500, { error: 'Internal Server Error' });
    }
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`API server is running on port ${PORT}`);
});