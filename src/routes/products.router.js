const { Router } = require("express");
const ProductManager = require("../dao/ProductManager.js");

const router = Router();

router.get('/', async (req, res) => {
    try {
        let products = await ProductManager.getProducts();
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        let {pid} = req.params
        let product = await ProductManager.getProductById(parseInt(pid))

        if (!product) 
        {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

router.post("/", async (req, res) => {
    let { title, description, price, thumbnail, code, stock, status, category } = req.body;

    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `Complete todos los parámetros` });
    }

    try {
        const product = req.body;
        await ProductManager.addProduct(product);
        res.status(201).json({ message: "Producto agregado correctamente" });
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`
        })
    }
})

router.put("/:pid", async(req,res)=>{
    try{
        let {pid} = req.params
        let productData = req.body

        let updated = await ProductManager.updateProduct(parseInt(pid), productData)

        if(!updated)
            return res.status(404).json({error: "Producto no encontrado"})
        
        res.json({message: "Producto actualizado correctamente"})
    }catch(err)
    {
        res.status(500).json({error: "Error al actualizar el producto "})
    }
})

router.delete("/:pid", async(req,res)=>{
    try{
        let {pid} = req.params

        let deleted = await ProductManager.deleteProducts(parseInt(pid))

        if(!deleted)
            return res.status(404).json({error: "Producto no encontrado"})

        res.json({message: "Producto eliminado correctamente"})
    } catch(err)
    {
        res.status(500).json({error:"Error al eliminar producto"})
    }
})

module.exports = router;
