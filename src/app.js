const express = require("express")
const {engine} = require("express-handlebars")
const {Server, Socket} = require("socket.io")
const productsRouter = require("./routes/products.router")
const viewsRouter = require("./routes/views.router")
const ProductManager = require("./dao/ProductManager")
const CartManager = require("./dao/CartManager")

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./src/public"))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views","./src/views")

app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

app.get("/", async (req,res) =>{
    try {
            const products = await ProductManager.getProducts()
            res.json({ products })
        } catch (err) {
            console.error("Error al obtener productos:", err.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
})

app.post("/api/carts", async (req,res) =>{
    try{
        const newCart = await CartManager.createCart()
        res.status(201).json(newCart)
    } catch(err)
    {
        console.error("Error al crear carrito:", err.message)
        res.status(500).json({ error: "Internal Server Error"}) 
    }
})

app.get("/api/carts", async (req, res) => {
    try{
        const carts = await CartManager.getcarts();
        res.json({ carts });
    }catch(err)
    {
        console.error("Error al obtener carritos:", err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
});

app.get("/api/carts/:cid", async(req,res) =>{
    try{
        const cart = await CartManager.getCartById(req.params.cid)
        if(!cart)
            return res.status(404).json({error: "Carrito no encontrado"})
        
        res.json(cart.products)
    }catch(err)
    {
        console.error("Error al obtener carrito:", err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

app.post("/api/carts/:cid/product/:pid", async(req,res)=>{
    try{
        const product = await ProductManager.getProductById(req.params.pid)

        if(!product)
            return res.status(404).json({error:"Producto no encontrado"})
        
        const result = await CartManager.addProductToCart(req.params.cid,product.id)   
        
        if(typeof result === "string")
            return res.status(404).json({error: result})

        res.status(200).json(result)
    } catch(err)
    {
        console.error("Error al agregar producto al carrito:", err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

const serverHTTP=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const serverSocket = new Server(serverHTTP) 

serverSocket.on("connection", async (socket) =>{
    console.log(`Usuario conectado con id: ${socket.id}`)

    const products = await ProductManager.getProducts();

    socket.emit("products", products)

    
    socket.on('addProduct', async (newProduct) => {
        try {
                if (!newProduct.status) 
                    newProduct.status = true;
            
                if (!newProduct.thumbnail) 
                    newProduct.thumbnail = "No tiene imagen"

                const added = await ProductManager.addProduct(newProduct)
            
                const updatedProducts = await ProductManager.getProducts()
                serverSocket.emit('products', updatedProducts)

                socket.emit('productAdded', {title: added.title})

            } catch (error) {
            console.error(`Error al agregar el producto:`, error);
        }
    });



    socket.on('deleteProduct', async (productId) => {
        try {
            await ProductManager.deleteProducts(productId)
            
            const updatedProducts = await ProductManager.getProducts()
            
            serverSocket.emit('products', updatedProducts)

            socket.emit('productDeleted', { id: productId })
        
        } catch (error) {
            console.error(`Error al eliminar el producto con ID ${productId}:`, error);
        }
    });
})


