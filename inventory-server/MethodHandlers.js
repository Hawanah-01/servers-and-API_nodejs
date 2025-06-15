const { 
    readItems, 
    writeItems, 
    sendResponse, 
    validateItem, 
    validatePartialItem, 
    getRequestBody, 
    getNextId 
} = require('./utils');


 // Creating a new item (POST /items)
 
async function createItem(req, res) {
    const items = await readItems();
    const newItem = await getRequestBody(req);
    if (!validateItem(newItem)) {
        return sendResponse(res, 400, { error: 'Invalid item data' });
    }
    newItem.id = getNextId(items);
    items.push(newItem);
    await writeItems(items);
    sendResponse(res, 201, { success: true, data: newItem });
}


// Retrieving all items (GET /items)

async function getAllItems(req, res) {
    const items = await readItems();
    sendResponse(res, 200, { success: true, data: items });
}


// Retrieving a single item (GET /items/:id)

async function getItem(req, res, itemId) {
    const items = await readItems();
    const item = items.find(i => i.id === itemId);
    if (!item) {
        return sendResponse(res, 404, { error: 'Item not found' });
    }
    sendResponse(res, 200, { success: true, data: item });
}


// Updating an item (PUT /items/:id)

async function updateItem(req, res, itemId) {
    const items = await readItems();
    const updatedItem = await getRequestBody(req);
    if (!validatePartialItem(updatedItem)) {
        return sendResponse(res, 400, { error: 'Invalid item data' });
    }
    const index = items.findIndex(i => i.id === itemId);
    if (index === -1) {
        return sendResponse(res, 404, { error: 'Item not found' });
    }
    items[index] = { ...items[index], ...updatedItem, id: itemId };
    await writeItems(items);
    sendResponse(res, 200, { success: true, data: items[index] });
}


// Deleting an item (DELETE /items/:id)

async function deleteItem(req, res, itemId) {
    const items = await readItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index === -1) {
        return sendResponse(res, 404, { error: 'Item not found' });
    }
    items.splice(index, 1);
    await writeItems(items);
    sendResponse(res, 200, { success: true, data: null });
}

module.exports = {
    createItem,
    getAllItems,
    getItem,
    updateItem,
    deleteItem
};