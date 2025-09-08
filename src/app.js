import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routes/products.router.js"
import viewsRouter from "./routes/views.router.js"
import ProductManager from "./dao/ProductManager.js"
import CartManager from "./dao/CartManager.js"
import { config } from "./config/config.js"
import { conectarDB } from "./config/db.js"
import cartRouter from "./routes/carts.router.js"

await conectarDB(config.MONGO_URL, config.DB_NAME)

const app = express()
const PORT = 8080


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./src/public"))

app.engine("handlebars", engine({
  helpers: {
    eq: (a, b) => a == b
  }
}))
app.set("view engine", "handlebars")
app.set("views","./src/views")

app.use("/api/products", productsRouter);
app.use("/", viewsRouter);
app.use("/api/carts", cartRouter)

app.get("/", async (req,res) =>{
    try {
            const products = await ProductManager.getProducts()
            res.json({ products })
        } catch (err) {
            console.error("Error al obtener productos:", err.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
})

const serverHTTP=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`)
})

const serverSocket = new Server(serverHTTP) 

serverSocket.on("connection", async (socket) =>{
    console.log(`Usuario conectado con id: ${socket.id}`)

    const products = await ProductManager.getAllProducts()

    socket.emit("products", products)

    
    socket.on('addProduct', async (newProduct) => {
        try {
                if (!newProduct.status) 
                    newProduct.status = true;
            
                if (!newProduct.thumbnail) 
                    newProduct.thumbnail = "No tiene imagen"

                const added = await ProductManager.addProduct(newProduct)
            
                const updatedProducts = await ProductManager.getAllProducts()
                serverSocket.emit('products', updatedProducts)

                socket.emit('productAdded', {title: added.title})

            } catch (error) {
            console.error(`Error al agregar el producto:`, error);
        }
    });



    socket.on('deleteProduct', async (productId) => {
        try {
            await ProductManager.deleteProducts(productId)
            
            const updatedProducts = await ProductManager.getAllProducts()
            
            serverSocket.emit('products', updatedProducts)

            socket.emit('productDeleted', { id: productId })
        
        } catch (error) {
            console.error(`Error al eliminar el producto con ID ${productId}:`, error);
        }
    });
})


