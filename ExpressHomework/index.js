// We need to get express and we need products. 
const express = require('express');
const products = require('./Products.json');
// the application is an express method
const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.listen(PORT, () =>{
    console.log(`Server has started on port ${PORT}`);
})

// Get all the products.
app.get('/products', (req,res) =>{
    res.json(products);
})

//Filter products
app.get('/products/:id', (req, res) => {
    const found = products.some((prod) => prod.id == parseInt(req.params.id));
    if(found){
        res.json(products.find((prod) => prod.id === parseInt(req.params.id))); 
    } else {
        res.status(400).json({msg: `Bad Request, product does not exist`});
    }
    // const anotherFound = products.inventory.find((prod) => prod.id === parseInt(req.params.id))
    res.send(found)
 });



// Add new products
app.post('/addproduct/:id', (req,res) =>{
    const product ={
        id: +req.params.id,
        name: req.body.name,
        brand: req.body.brand,
        price: +req.body.price,
        discount: +req.body.discount,
        timestamp: new Date().getTime(),
        description: req.body.description
    }
    const areTruthy = Object.values(product).every(value => value)
 
    if( !areTruthy) {
        return res.status(400).json({msg: "Bad request"});
    }

    products.push(product);
    res.json(product);
});

//edit 
app.put('/updateproduct/:id', (req, res) =>{
    const found = products.some(item => item.id == parseInt(req.params.id));

    if(found){
        const update = req.body;
        products.forEach(item =>{
          if(item.id === +req.params.id){
            item.name = update.name ? update.name : item.name;
            item.brand = update.brand ? update.brand : item.brand;
            item.price = update.price ? update.price : item.price;
            item.discount = update.discount ? update.discount : item.discount;
            item.description = update.description ? update.description : item.description;
            res.json({msg: "product updated", item})
          }
        });
    } else{
        res.status(400).json({mssg: "Request was bad, take it back to the kitchen"});
    }
});

//delete
app.delete('/deleteproduct/:id', (req,res) =>{
    const found = products.some(item => item.id === parseInt(req.params.id));

    if(found){
        res.json({
            mssg: "product was deleted",
            deleted: products.filter(item => item.id === parseInt(req.params.id)),
            products: products.filter(item => item.id !== parseInt(req.params.id))
        });
    } else{
        res.status(400).json({msg: "This product was not found"});
    }
});