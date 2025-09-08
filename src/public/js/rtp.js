const socket = io()

const productForm = document.getElementById('productForm')
const productList = document.getElementById('products')

socket.on('products', (products) => {
    productList.innerHTML = ""

    if (!Array.isArray(products)) 
    {
        console.error("El servidor no envió un array:", products)
        return;
    }

    products.forEach(prod => {
        const li = document.createElement('li');
        const textContent = `${prod.title} - $${prod.price} (ID: ${prod._id})`
        li.textContent = textContent

        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'

         deleteButton.onclick = () => {
            socket.emit('deleteProduct', prod._id)
        }
        li.appendChild(deleteButton)
        productList.appendChild(li)
    })
})

socket.on('productAdded', (data)=>{
    Swal.fire({
        icon: 'success',
        title: 'Added product',
        text: `Added: ${data.title}`,
        timer: 2000,
        showConfirmButton: false
    })
})

socket.on('productDeleted', (data) =>{
        Swal.fire({
        icon: 'info',
        title: 'Product removed',
        text: `ID deleted: ${data._id}`,
        timer: 2000,
        showConfirmButton: false
    })
})


 productForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(productForm)
    const productData = Object.fromEntries(formData.entries())

    if (!productData.status) {
        productData.status = true
    }

    socket.emit('addProduct', productData)

    productForm.reset()
})