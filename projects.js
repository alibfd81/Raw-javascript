const openModalCategory = document.querySelector(".category")
const backdrop = document.querySelector(".backdrop")
const container = document.querySelector(".container")
const modal = document.querySelector(".modal")
const addproduct = document.querySelector(".Add-product")
const notes = document.querySelector(".notes")
const addcategory = document.querySelector(".Add-category")
const category = document.querySelector(".categories")
const filterSearch = document.querySelector(".filter-search-text")
const filterSort = document.querySelector(".filter-sort-date")
const filterCategory = document.querySelector(".filter-category")
const cancel = document.querySelector(".cancel")


let products = JSON.parse(localStorage.getItem("products")) || []
let Category = JSON.parse(localStorage.getItem("category")) || []

let updateProduct = null

addproduct.addEventListener("click", (e) => {
    e.preventDefault()
    const title = document.querySelector(".title").value
    const quantity = document.querySelector(".quantity").value
    const selectedCategoryTitle = category.options[category.selectedIndex].text
    const createdAt = new Date().toISOString()
    if (!title.trim()) {
        alert("لطفاً عنوان محصول را وارد کنید.");
        return
    }
    if (!quantity.trim()) {
        alert("لطفاً مقدار محصول را وارد کنید.");
        return
    }
    if (updateProduct) {
        products = products.map(p => p.createdAt === updateProduct.createdAt ? { ...p, title, quantity, category: selectedCategoryTitle } : p)
        updateProduct = null;
    } else {
        products.push({ title, quantity, category: selectedCategoryTitle, createdAt })
    }

    saveLocalStorge("products", products)
    productList(products)
    document.querySelector(".title").value = ''
    document.querySelector(".quantity").value = ''
})

function editProducts(product) {
    document.querySelector(".title").value = product.title;
    document.querySelector(".quantity").value = product.quantity;
    updateProduct = product;
}

addcategory.addEventListener("click", (e) => {
    e.preventDefault()
    const titlecategory = document.querySelector(".title-category").value
    const description = document.querySelector(".description").value
    const id = new Date().toISOString()
    if (!titlecategory) return
    Category.push({ titlecategory, description, id })
    saveLocalStorge("category", Category)
    document.querySelector(".title-category").value = ''
    document.querySelector(".description").value = ''
    console.log(Category)
    getCategory()
    closeModal()
})

filterSearch.addEventListener("input", () => {
    const filterSearchValue = filterSearch.value.toLowerCase();
    const filteredProducts = products.filter((p) => {
        return p.title.toLowerCase().includes(filterSearchValue);
    });
    productList(filteredProducts)
})

filterSort.addEventListener("change", () => {
    const filterSortValue = filterSort.value
    if (filterSortValue === "latest") {
        const productFilter = products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        productList(productFilter)
    } else if (filterSortValue === "earliset") {
        const productFilter = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        productList(productFilter)
    } else {
        const productFilter = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        productList(productFilter);
    }
})
filterCategory.addEventListener("change", () => {
    const selectedCategoryTitle = filterCategory.options[filterCategory.selectedIndex].text
    let filterProduct;
    if (selectedCategoryTitle === "All") {
        filterProduct = products
    } else {
        filterProduct = products.filter((p) => { return p.category === selectedCategoryTitle })
    }
    productList(filterProduct)
})


function productList(product) {
    let results = ''
    product.forEach((item) => {
        results += `
            <div class="notes detail">
                <p>${item.title}</p>
                <span>${new Date(item.createdAt).toLocaleDateString("fa-IR")}</span>
                <span>${item.category}</span>
                <span>${item.quantity}</span>
                <button class="edit" data-id=${item.createdAt}>edit</button>
                <button class="delete" data-id=${item.createdAt}> delete</button>
            </div>`
    })
    notes.innerHTML = results
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const buttonId = e.target.getAttribute("data-id")
            products = products.filter((p) => p.createdAt !== buttonId)
            saveLocalStorge("products", products);
            productList(products)
        })
    })
    const editButtons = document.querySelectorAll(".edit")
    editButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const buttonId = e.target.dataset.id
            const productEdit = products.find((p) => p.createdAt === buttonId)
            editProducts(productEdit)
        })
    })
}

function getCategory() {
    let results = '';
    let filterResults = '<option value="All">All</option>';
    Category.forEach((item) => {
        const option = `<option value=${item.id}>${item.titlecategory}</option>`
        results += option
        filterResults += option
    })
    category.innerHTML = results
    filterCategory.innerHTML = filterResults
}

document.addEventListener("DOMContentLoaded", () => {
    productList(products)
    getCategory()
})



function saveLocalStorge(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}



function openModal() {
    backdrop.style.display = "block"
    modal.style.display = "block"
}
function closeModal() {
    backdrop.style.display = "none"
    modal.style.display = "none"
}
openModalCategory.addEventListener("click", openModal)
backdrop.addEventListener("click", closeModal)
cancel.addEventListener("click", closeModal)

