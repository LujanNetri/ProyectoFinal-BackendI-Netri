const { Router } = require("express")
const ProductManager = require("../dao/ProductManager.js");

const router=Router()

router.get('/products', async (req,res)=>{
    try{
        let products = await ProductManager.getProducts()
        console.log("Productos:", products)
        res.render("home", {products})
    } catch(err)
    {
        console.error(err)
        res.status(500).send("Error al cargar la vista products");
    }
})

router.get('/realtimeproducts', async (req,res)=>{
    try{
        let products = await ProductManager.getProducts()
        res.render("realTimeProducts", { products })
    }catch(err)
    {
        res.status(500).send("Error al cargar la vista realtimeproducts");
    }
})

module.exports=router