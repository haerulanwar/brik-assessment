## Description

This is test assessment from BRIK, test case can be found [here](https://github.com/brik-id/test-be-l2-en)

## Project setup
This app mean for docker only, since no ENV file provided

```bash
$ docker compose up --build
```
And open http://localhost:3000 in your browser.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Routes
Here are routes that available at this apps:

API Routes
| Route	| Method | Controller |
| ----- | ------ | ---------- |
|/	    | GET		 |IndexController|
|/products|	POST|		ProductController|
|/products|	GET	|	ProductController|
|/products/:id|	GET	|	ProductController|
|/products/:id|	DELETE|		ProductController|
|/products/:id|	PUT	|	ProductController|
|/categories|	POST|		CategoryController|
|/categories|	GET	|	CategoryController|
|/categories/:id|	GET|		CategoryController|
|/categories/:id|	DELETE|		CategoryController|
|/categories/:id|	PUT|		CategoryController|
|/file/upload|	POST|	FileController|
|/sale| POST| SaleController|
|/sale/history| GET| SaleController|
|/sale/history/:id| GET| SaleController|

## Sample Curl
These are sample curl, please import to postman for further modification for testing purpose

Category POST (should do this first so we can have 1st category before add products)
```
curl --location 'http://localhost:3000/categories' \
--header 'content-type: application/json' \
--data '{
    "name": "name #2"
}'
```
Category PUT
```
curl --location 'http://localhost:3000/categories/1' \
--header 'content-type: application/json' \
--data '{
    "name": "name #2"
}'
```

Product POST (depend on category id)
```
curl --location 'http://localhost:3000/products' \
--header 'content-type: application/json' \
--data '{
    "categoryId": 1,
    "sku": "name",
    "name": "name",
    "description": "string",
    "weight": null,
    "width": null,
    "length": null,
    "height": null,
    "image": null,
    "price": null,
    "qty": 1
}'
```
Product PUT
```
curl --location --request PUT 'http://localhost:3000/products/1' \
--header 'content-type: application/json' \
--data '{
    "categoryId": 1,
    "sku": "string",
    "name": "name",
    "description": "string",
    "weight": null,
    "width": null,
    "length": null,
    "height": null,
    "image": null,
    "price": null,
    "qty": 1
}'
```
Product Get (LIST)
list using three params:
- page: number of page,
- limit: total row at one page
- filter: filter work on these attributes ['name', 'id', 'categoryId', 'sku'] with eq(equal) and like(like) option
```
curl --location 'http://localhost:3000/products?page=1&limit=10&filter=sku%3Alike%3Aname' \
--header 'content-type: application/json'
```

Sale POST (depend on product id)
```
curl --location 'http://localhost:3000/sales' \
--header 'content-type: application/json' \
--data '{
    "productId": 1,
    "qty": 1
}'
```
Sale History GET (get all sale)
```
curl --location 'http://localhost:3000/sales/history?page=1&limit=10' \
--header 'content-type: application/json'
```
Sale History byProduct GET (get all sale by product id)
```
curl --location 'http://localhost:3000/sales/history/1?page=1&limit=10' \
--header 'content-type: application/json'
```

File POST
```
curl --location 'http://localhost:3000/file/upload' \
--form 'file=@"sampel.png"'
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
