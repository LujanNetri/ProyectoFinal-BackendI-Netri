import { Router } from "express"
import CartManager from "../dao/CartManager.js"
import ProductManager from "../dao/ProductManager.js"

const router = Router()

router.post("/", async (req, res) => {
  try {
    const newCart = await CartManager.createCart()
    res.status(201).json(newCart)
  } catch (err) {
    console.error("Error al crear carrito:", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/", async (req, res) => {
  try {
    const carts = await CartManager.getcarts()
    res.json({ carts })
  } catch (err) {
    console.error("Error al obtener carritos:", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartManager.getCartById(req.params.cid)
    if (!cart)
      return res.status(404).json({ error: "Carrito no encontrado" })

    res.json(cart.products);
  } catch (err) {
    console.error("Error al obtener carrito:", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cart = await CartManager.addProductToCart(cid, pid)

    if (typeof cart === "string")
      return res.status(404).json({ error: result })

    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: "Error al agregar producto al carrito" })
  }
})

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const result = await CartManager.deleteProductFromCart(req.params.cid, req.params.pid)

    if (typeof result === "string")
      return res.status(404).json({ error: result })

    res.json(result);
  } catch (err) {
    console.error("Error al eliminar producto del carrito:", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    const result = await CartManager.updateCart(req.params.cid, products)

    if (typeof result === "string")
      return res.status(404).json({ error: result })

    res.json(result);
  } catch (err) {
    console.error("Error al actualizar carrito:", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const bodyKeys = Object.keys(req.body)

    if (bodyKeys.length !== 1 || !bodyKeys.includes("quantity")) {
      return res.status(400).json({ 
        error: "Solo se permite actualizar la cantidad (quantity)" 
      })
    }

    const { quantity } = req.body

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ 
        error: "La cantidad debe ser un número entero positivo" 
      })
    }

    const result = await CartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity)

    if (typeof result === "string")
      return res.status(404).json({ error: result })

    res.json(result)
  } catch (err) {
    console.error("Error al actualizar cantidad del producto:", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.delete("/:cid", async (req, res) => {
  try {
    const result = await CartManager.clearCart(req.params.cid)

    if (typeof result === "string")
      return res.status(404).json({ error: result })

    res.json(result);
  } catch (err) {
    console.error("Error al vaciar carrito:", err.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router