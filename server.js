// importera express-biblioteket för att kunna sätt upp vår webbserver
const express = require('express');
// // importera datan från vår json
const products = require('./static/data.json');
// fs använder vi för att modifiera i vårt filsystem
const fs = require('fs');
// kalla på express-funktionen för att express-appen skall initieras
const app = express();
// ta in cors middleware
const cors = require('cors');
// använd oss av cors i vår webbserver, vi kommer tillåta lla sidor att använda sig av den
app.use(cors({ origin: '*' }));

// använda sig av json-parser så vi kan läsa datan
app.use(express.json());

// definierar en route handler som hanterar get-metod mot '/'
// READ
app.get('/', (req, res) => {
    res.send(products);
});

// en route handler för när vi hanterar en delete-metod på endpointen '/'
app.delete('/', (req, res) => {
    // logik för att ta bort vald produkt
    let productId = req.body.productId;
    // spara kopia på products för att sedan manipulera den
    let updatedProducts = products;
    //hitta indexet för produkten som skall bort
    let id = updatedProducts.products.findIndex((product) => product.id == productId);
    // filtrera ut vald produkt från listan
    updatedProducts.products.splice(id, 1);
    // uppdatera datan i vår data.json-fil
    fs.writeFile("./static/data.json", JSON.stringify(updatedProducts, null, 2), (err) => {
        if (err) {
            console.log(err);
            // logik för att hantera fel ex. returnera 404-sida
            res.send('404');
        } else {
            // skicka tillbaka svar för att meddela användare att det gick bra
            res.send(updatedProducts);
        }
    });
});

app.put('/', (req, res) => {
    console.log(req.body);
    // req: { productId: 1, product: { title: 'new title', price: 32 } };

    // hitta reda på objektet i json som matchar id
    let productId = req.body.productId;
    let index = products.products.findIndex((product) => product.id == productId);
    let product = products.products[index];
    // sedan justera objektet
    product.title = req.body.product.title;
    product.price = req.body.product.price;
    console.log(product);
    // byt ut gmla produkten med uppdaterade produkten i listan
    products.products.splice(index, 1, product);
    // uppdatera vår data.json-fil med vår nya fina data
    fs.writeFile('./static/data.json', JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.log('error');
        } else {
            res.send(products);
        }
    })
});

//när vi vill lägga till en ny produkt
app.post('/', (req, res) => {
    let newProduct = req.body;
    // generera unikt id till den nya produkten
    newProduct.id = products.products.length + 1;
    console.log(newProduct);
    // lägga till produkten bland de andra produkterna i listan
    products.products.push(newProduct);

    fs.writeFile('./static/data.json', JSON.stringify(products, null, 2), (err) => {
        if (err) {
            res.send('här blev det fel')
        } else {
            res.send('topp')
        }
    });

});

app.listen(5000, () => {
    console.log('listening on port 5000');
});

