const express = require("express")
const ProductManager = require("./ProductManager")
const CartManager = require("./CartManager")

const app = express()
const PORT = 8080

app.use(express.json())

app.get("/", async (req,res) =>{
        const products = await ProductManager.getProducts();
        res.json({ products });
})

app.get("/api/products", async (req,res) => {
    const products = await ProductManager.getProducts()
    res.json({products})
})

app.get("/api/products/:pid", async(req,res) =>{
    const pid = req.params.pid
    const product = await ProductManager.getProductById(pid)

    if(typeof product === "string")
    {
        res.status(404).json({error: product})
    } else 
    {
        res.json(product)
    }
})

app.post("/api/products", async (req,res) =>{
    try{
        const productData = req.body
        const newProduct = await ProductManager.addProduct(productData)

        if(!newProduct)
            return res.status(400).json({error: "Faltan campos o el código ya existe"})
        res.status(201).json(newProduct)
    
    } catch(err)
    {
        console.error("Error al agregar producto:", err.message)
    }
})

app.put("/api/products/:pid", async(req,res) =>{
    const pid = req.params.pid
    const updateData = req.body

    const updated = await ProductManager.updateProduct(pid,updateData)
    if(typeof updated === "string")
        return res.status(404).json({error: updated})

    res.json(updated)
})

app.delete("/api/products/:pid", async(req,res) =>{
    const pid = req.params.pid 

    const result = await ProductManager.deleteProducts(pid)

    if(result.startsWith("No existe"))
        return res.status(404).json({error:result})

    res.json({message:result})
})

app.post("/api/carts", async (req,res) =>{
    const newCart = await CartManager.createCart()
    res.status(201).json(newCart)
})

app.get("/api/carts", async (req, res) => {
  const carts = await CartManager.getcarts();
  res.json({ carts });
});

app.get("/api/carts/:cid", async(req,res) =>{
    const cart = await CartManager.getCartById(req.params.cid)
    if(!cart)
        return res.status(404).json({error: "Carrito no encontrado"})
    
    res.json(cart.products)
})

app.post("/api/carts/:cid/product/:pid", async(req,res)=>{
    const product = await ProductManager.getProductById(req.params.pid)

    if(!product)
        return res.status(404).json({error:"Producto no encontrado"})
    
    const result = await CartManager.addProductToCart(req.params.cid,product.id)   
    
    if(typeof result === "string")
        return res.status(404).json({error: result})

    res.status(200).json(result)
})



app.listen(PORT, () =>{
    console.log(`Servidor online en puerto ${PORT}`);
})