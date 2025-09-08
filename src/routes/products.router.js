import { Router } from "express"
import ProductManager from "../dao/ProductManager.js"

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { page, limit, sort, category, status } = req.query

    const result = await ProductManager.getProducts({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort,
      category,
      status
    });

    if (!result) {
      return res.json({
        status: "error",
        payload: [],
        totalPages: 0,
        prevPage: null,
        nextPage: null,
        page: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevLink: null,
        nextLink: null
      });
    }

    const {
      docs,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage
    } = result;

    res.json({
      status: "success",
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage
        ? `/api/products?page=${prevPage}&category=${category || ""}&status=${status || ""}&sort=${sort || ""}`
        : null,
      nextLink: hasNextPage
        ? `/api/products?page=${nextPage}&category=${category || ""}&status=${status || ""}&sort=${sort || ""}`
        : null
    });
  } catch (err) {
    console.error("Error en GET /products:", err)
    res.status(500).json({ status: "error", error: "Error al cargar productos" })
  }
});


router.get('/:pid', async (req, res) => {
    try {
        let {pid} = req.params
        let product = await ProductManager.getProductById(pid)

        if (!product) 
        {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
});

router.post("/", async (req, res) => {
    let { title, description, price, thumbnail, code, stock, status, category } = req.body;

    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `Complete todos los parámetros` })
    }

    try {
        const product = req.body;
        await ProductManager.addProduct(product);
        res.status(201).json({ message: "Producto agregado correctamente" })
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
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

        let updated = await ProductManager.updateProduct(pid, productData)

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

        let deleted = await ProductManager.deleteProducts(pid)

        if(!deleted)
            return res.status(404).json({error: "Producto no encontrado"})

        res.json({message: "Producto eliminado correctamente"})
    } catch(err)
    {
        res.status(500).json({error:"Error al eliminar producto"})
    }
})

export default router
