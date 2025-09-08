async function addProductToCart(productId)
{
    try{
        let cartId = localStorage.getItem("cartId")

        if (cartId) 
        {
        const checkRes = await fetch(`/api/carts/${cartId}`)
        if (!checkRes.ok) {
            console.warn("Carrito guardado no existe, creando uno nuevo...")
            localStorage.removeItem("cartId")
            cartId = null
        }
        }
        if(!cartId)
        {
            const res = await fetch("/api/carts", { method: "POST" })
            const cart = await res.json()
            cartId = cart._id
            localStorage.setItem("cartId", cartId)
        }

        const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST"
            })
        
        if (!res.ok) 
            throw new Error("Error al agregar producto")
        const data = await res.json()
        console.log("Carrito actualizado:", data)
    } catch(err)
    {
        console.error("Error en addProductToCart:", err)
    }
}

document.addEventListener("DOMContentLoaded", () => 
{
    const cartId = localStorage.getItem("cartId")
    const cartLink = document.querySelectorAll(".cartLink")

    cartLink.forEach(link =>{
        link.href = `/carts/${cartId}`
    })
})

document.addEventListener("DOMContentLoaded", async()=>{
    const cartSelector = document.getElementById("cartSelector")

    if(cartSelector)
    {
        const res = await fetch("/api/carts")
        const data = await res.json()
        const carts = data.carts || []

        carts.forEach(c =>{
            const option = document.createElement("option")
            option.value = c._id
            option.textContent = `Carrito ${c._id}`
            cartSelector.appendChild(option)
        })

        const currentCartId = localStorage.getItem("cartId")
        if (currentCartId) 
        {
            cartSelector.value = currentCartId
        }
        cartSelector.addEventListener("change", ()=>{
            localStorage.setItem("cartId", cartSelector.value)
            window.location.href = `/carts/${cartSelector.value}`
        })
    }
})


