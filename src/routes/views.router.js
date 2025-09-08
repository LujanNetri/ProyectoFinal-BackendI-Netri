import { Router } from "express"
import ProductManager from "../dao/ProductManager.js"
import CartManager from "../dao/CartManager.js"

const router=Router()

router.get('/products', async (req,res)=>{
    try{
        const { page = 1, limit = 10, sort, category, status } = req.query;
        let products = await ProductManager.getProducts({ page, limit, sort, category, status })

        res.render("home", {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            prevLink: products.hasPrevPage
              ? `/products?page=${products.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${category ? `&category=${category}` : ""}${status ? `&status=${status}` : ""}`
              : null,
            nextLink: products.hasNextPage
              ? `/products?page=${products.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${category ? `&category=${category}` : ""}${status ? `&status=${status}` : ""}`
              : null
        });
    } catch(err) 
    {
        console.error(err)
        res.status(500).send("Error al cargar la vista products")
    }
})
router.get('/realtimeproducts', async (req,res)=>{
    try{
        let products = await ProductManager.getProducts({})
        res.render("realTimeProducts", { products })
    }catch(err)
    {
        res.status(500).send("Error al cargar la vista realtimeproducts")
    }
})

router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductManager.getProductById(pid)
    if (!product) 
    {
      return res.status(404).send("Producto no encontrado")
    }

    res.render("productDetail", { product })
  } catch (err) 
  {
    console.error(err);
    res.status(500).send("Error al cargar producto");
  }
})

router.get('/carts/:cid', async(req,res) =>{
    try{
        const {cid} = req.params;
        const cart = await CartManager.getCartById(cid)

        if(!cart)
        {
            return res.status(404).send("Carrito no encontrado")
        }

        res.render("cart", {products: cart.products})

    } catch(err)
    {
        console.error(err);
        res.status(500).send("Error al cargar carrito");
    }
})

export default router