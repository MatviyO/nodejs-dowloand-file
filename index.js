// DEPENDENCIES
const fs = require('fs');
const express = require('express');
const app = express();
const port = `5001`;
const cors = require('cors');

// LOAD LIBRARIES
app.use(cors());

// API ENDPOINTS
app.get('/', (req, res) => {
    const fileTypes = [
        'csv',
        'jpg',
        'pdf',
        'png',
        'xslx'
    ];

    // Check if the right request is coming through for the file type
    return new Promise((resolve, reject) => {
        if (req.query.file && fileTypes.indexOf(req.query.file.toLowerCase()) > -1) {
            return resolve(`sample.${fileTypes[fileTypes.indexOf(req.query.file.toLowerCase())]}`);
        }
        return reject(`Please provide a file type of ?file=${fileTypes.join('|')}`);
    })
    // Validate if the files exists
    .then((file) => {
        return new Promise((resolve, reject) => {
            if(fs.existsSync(`./files/${file}`)) {
                return resolve(`./files/${file}`)
            }
            return reject(`File '${file}' was not found.`);
        })
    })
    // Return the file to download
    .then((filePath) => {
        res.download(filePath);
    })
    // Catches errors and displays them
    .catch((e) => {
        res.status(400).send({
            message: e,
        });
    });
});

// HTTP SERVER
app.listen(port, () => console.log(`Listening on port: ${port}`));


//  const options: any = {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',

//             },
//             credentials: "same-origin"
//         };
//         try {
//             fetch(`http://localhost:5001?file=pdf`, options)
//                 .then((response) => response.blob())
//                 .then((blob) => {
//                     const url = window.URL.createObjectURL(new Blob([blob],  { type: 'application/pdf' }));
//                     const link = document.createElement('a');
//                     link.href = url;
//                     link.setAttribute('download', `sample.pdf`);
//                     link.setAttribute('id', `frame`);
//                     document.body.appendChild(link);
//                     link.click();


//                     let iframe = document.createElement('iframe');
//                     iframe.id = 'pdfIframe'
//                     iframe.className='pdfIframe'
//                     document.body.appendChild(iframe);
//                     iframe.style.display = 'none';
//                     iframe.src = url;
//                     iframe.onload = function () {
//                         setTimeout(function () {
//                             iframe.focus();
//                             if (iframe.contentWindow) iframe.contentWindow.print();

//                         }, 1000);
//                     };
//                     setTimeout(() => {
//                         document.body.removeChild(iframe)
//                         document.body.removeChild(link)
//                          URL.revokeObjectURL(url)
//                     }, 10000)


//                 })
//                 .then(res => console.log(res))
//         } catch (error) {
//             return Promise.reject(new Error(error))
//         }