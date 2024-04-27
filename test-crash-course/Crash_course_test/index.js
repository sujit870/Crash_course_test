document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("productList");
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");
    const sortOrder = document.getElementById("sortOrder");

    // Fetch products and render
    function renderProducts() {
      const category = categoryFilter.value;
      const search = searchInput.value.toLowerCase();
      const sort = sortOrder.value;

      let apiUrl = "https://fakestoreapi.com/products";

      fetch(apiUrl)
        .then((response) => response.json())
        .then((products) => {
          // Extract unique categories from the products
          const categories = [
            ...new Set(products.map((product) => product.category)),
          ];

          // Populate category filter dropdown
          categoryFilter.innerHTML =
            '<option value="">All Categories</option>';
          categories.forEach((category) => {
            const option = document.createElement("option");
            option.textContent = category;
            option.value = category;
            categoryFilter.appendChild(option);
          });

          // Filter products by category
          const filteredProducts = category
            ? products.filter(
                (product) => product.category === category
              )
            : products;

          // Filter products by search query
          const searchFilteredProducts = filteredProducts.filter(
            (product) => product.title.toLowerCase().includes(search)
          );

          // Sort products
          searchFilteredProducts.sort((a, b) => {
            const priceA = a.price;
            const priceB = b.price;
            return sort === "asc" ? priceA - priceB : priceB - priceA;
          });

          // Render products
          productList.innerHTML = "";
          searchFilteredProducts.forEach((product) => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.innerHTML = `
    <img src="${product.image}" alt="   ${product.title}">
    <h3>${product.title}</h3>
    <p><b>Price: </b>$${product.price}</p>
  `;
            productList.appendChild(productItem);
          });
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }

    // Event listeners
    categoryFilter.addEventListener("change", function () {
      renderProducts();
    });

    searchInput.addEventListener("input", renderProducts);
    sortOrder.addEventListener("change", renderProducts);

    // Initial render
    renderProducts();
  });