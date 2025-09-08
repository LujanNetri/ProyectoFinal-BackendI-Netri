import Cart from "./models/cart.model.js"

class CartManager 
{
  async createCart()
  {
    return await Cart.create({ products: [] })
  }

  async getcarts()
  {
    return await Cart.find()
  }
  async getCartById(id)
  {
    return await Cart.findById(id).populate("products.product").lean()
  }

  async addProductToCart(cartId, productId, quantity = 1)
  {
    const cart = await Cart.findById(cartId)

    if(!cart)
        return `No existe el carrito con id: ${cartId}`

    const prodInCart = cart.products.find( p => p.product.toString() === productId)

    if(prodInCart)
        prodInCart.quantity += 1
    else 
        cart.products.push({product: productId, quantity: 1})

    await cart.save()
    return cart
  }

  async deleteProductFromCart(cartId, productId)
  {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      {
        $pull: 
        {
          products: {
            product: productId
          }
        }
      },
      {
        new: true
      }
    ).populate("products.product")
      
    if (!cart) 
      return `No existe el carrito con id: ${cartId}`
    return cart
  }

  async updateCart(cartId, products)
  {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      {products},
      {new: true}
    ).populate("products.product")

    if (!cart) 
      return `No existe el carrito con id: ${cartId}`
    
    return cart;
  }

  async updateProductQuantity(cartId,productId,quantity)
  {
    const cart = await Cart.findById(cartId)

    if(!cart) 
      return `No existe el carrito con id: ${cartId}`

    const prodInCart = cart.products.find(p=>p.product.toString() === productId)
    if (!prodInCart) 
      return `No existe el producto con id: ${productId} en el carrito`
    
    prodInCart.quantity = quantity
    await cart.save()

    return cart
  }

  async clearCart(cartId)
  {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      {products: []},
      {new: true}
    )

    if(!cart)
      return `No existe el carrito con id: ${cartId}`

    return cart
  }
}

export default new CartManager()