# Vendora Non-React Frontend

This package is a full static frontend rewrite of the original React UI using:
- HTML
- CSS
- JavaScript (ES modules)

## Backend
Keep your existing Spring Boot backend unchanged.

## API base
By default the frontend calls `/api`.
You can change that in `assets/js/config.js`.

## Pages
- `index.html` → dashboard
- `products.html` → admin inventory list
- `product-detail.html?id=ID` → admin detail page
- `create-product.html` → create product
- `edit-product.html?id=ID` → edit product
- `low-stock.html` → stock alerts
- `user-products.html` → customer-facing catalog
- `user-product-detail.html?id=ID` → customer-facing detail page

## Notes
- This frontend no longer uses React or Vite.
- It still depends on the same backend routes.
- Use a static server or host these files under the same origin as the backend for `/api` to work cleanly.
