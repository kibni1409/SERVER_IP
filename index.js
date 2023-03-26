const express = require('express');
const axios = require('axios');

//Настройки APP
const app = express();
app.use(express.json());

//Объявление ключевый переменных
const port = 8081;
const hostname = '192.168.0.8';
const instance = axios.create({
    baseURL: 'https://api.jsonbin.io/v3',
    headers: {
        "X-Master-Key": '$2b$10$0vceS6AqOhM/tVwuYA46RergFW/kUOW5.Bu2T64qgbHFxHwx8SNG.',
    },
})

//Авторизация
// req: { login: string, password: string }
// res: { login: string }
app.get('/users', (req, res) => {
    instance.get('/b/' + '641edfdface6f33a22fadc2f').then((response) => {
        let users = response.data.record.users
        let result = users.find((el) => el.login === req.body.login && el.password === req.body.password)
        if(result === undefined) {
            res.json({
                message: "Invalid login or password",
                statuscode: 401
            })
        } else {
            res.json({
                login: result.login,
                statuscode: 200
            })
        }
    })
})

//Запрос на получение продуктов
// req: { productsID: string }
// res: { products: Array[Object] }
app.get('/products', (req, res) => {
    instance.get('/b/' + req.body.productsID).then((response) => {
        res.json({
            products: response.data.record.products
        })
    }).catch((err) => {
        res.json({
            message: err.message
        })
    })
})

//Запрос на обновление данных о продуктах
// req : { productsID: string, productsArray = Array[Object] }
// res: { products: Array[Object] }
app.put('/products/edit', (req, res) => {
    instance.put('/b/' + req.body.productsID, {
        "products": req.body.productsArray,
    }).then((response) => {
        res.json({
            products: response.data.record.products
        })
    }).catch((err) => {
        res.json({
            message: err.message
        })
    })
})

//Запрос на обновление данных о хранилище]
// req : { storeID: string, storeArray = Array[Object] }
// res: { store: Array[Object] }
app.put('/store/edit', (req, res) => {
    instance.put('/b/' + req.body.storeID, {
        "store": req.body.storeArray,
    }).then((response) => {
        res.json({
            store: response.data.record.store
        })
    }).catch((err) => {
        res.json({
            message: err.message
        })
    })
})

//Запуск сервера
app.listen(port, hostname, () => {
    console.log(`Started server ${hostname}:${port}`)
})

