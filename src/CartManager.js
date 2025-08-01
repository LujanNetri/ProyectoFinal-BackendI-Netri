const fs = require("fs")
const path = require("path")

class CartManager 
{
  static path = "./data/carts.json";

  static async getcarts()
  {
    if(fs.existsSync(this.path))
    {
        const data = await fs.promises.readFile(this.path,"utf-8")
        return JSON.parse(data)
    } else 
        return []
  }

  static async saveCarts(carts)
  {
    await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2),"utf-8")
  }

  static async createCart()
  {
    const carts = await this.getcarts()
     let newId = 1;
     if (carts.length > 0) 
        newId = Math.max(...carts.map((p) => p.id)) + 1;

    const newCart = 
    {
        id: newId,
        products: []
    }

    carts.push(newCart)
    await this.saveCarts(carts)

    return newCart
  }

  static async getCartById(id)
  {
    const carts = await this.getcarts()
    return carts.find(cart => cart.id == id)
  }

  static async addProductToCart(cartId, productId)
  {
    const carts = await this.getcarts()
    const cart = carts.find(c => c.id == cartId)

    if(!cart)
        return `No existe el carrito con id: ${cartId}`

    const prodInCart = cart.products.find( p => p.product === productId)

    if(prodInCart)
        prodInCart.quantity += 1
    else 
        cart.products.push({product: productId, quantity: 1})

    await this.saveCarts(carts)
    return carts
  }
}

module.exports = CartManager