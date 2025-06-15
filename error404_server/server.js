const http = require('http');
const fs = require('fs').promises;
const path = require('path');

//Defining port

const PORT = 3000;

//reads the 404 page
const notFoundPagePath = path.join(__dirname, 'error-page.html');


//creating a request handler that handles the request

const requestHandler = (async (req, res) => {
    try {
        let filePath = req.url.slice(1);
        if (!filePath.endsWith('.html')) {
            filePath += '.html';
        }
        //to get the fullpath of the index.html request
        const fullPath = path.join(__dirname, filePath);

        //getting the content of the file from the file system and sending a response to the client
        if (filePath === 'index.html') {
            const htmlContent = await fs.readFile(fullPath, 'utf8');
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end(htmlContent)
        } else {
            const notFoundPage = await fs.readFile(notFoundPagePath, 'utf8');
            res.writeHead(404, { 'Content-type': 'text/html' })
            res.end(notFoundPage)
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            const notFoundPage = await fs.readFile(notFoundPagePath, 'utf8');
            res.writeHead(404, { 'Content-type': 'text/html' })
            res.end(notFoundPage)
        } else {
            res.writeHead(500, { 'Content-type': 'text/html' })
            res.end("Internal Server Error")
        }
    }
});

//starting a server
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})