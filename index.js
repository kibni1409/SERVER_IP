// Подключили библиотеки
const express = require('express');
const axios = require('axios');
const cors = require('cors');

//Настройки APP
const app = express();
app.use(cors());
app.use(express.json());

//Объявление ключевый переменных
const port = 8081;
const hostname = '192.168.0.6';
const instance = axios.create({
    baseURL: 'https://api.jsonbin.io/v3',
    headers: {
        "X-Master-Key": '$2b$10$0vceS6AqOhM/tVwuYA46RergFW/kUOW5.Bu2T64qgbHFxHwx8SNG.',
    },
})

//Авторизация
app.put('/users', (req, res) => {
    instance.get('/b/' + '641edfdface6f33a22fadc2f').then((response) => {
        let users = response.data.record.users
        let result = users.find((el) => el.login === req.body.login && el.password === req.body.password)
        if(result === undefined) {
            throw new Error('Invalid login or password')
        } else {
            res.json({
                ...result,
                statusCode: 200
            })
        }
    }).catch((err) => {
        res.status(401).send({message: err.message});
    })
})

//Запрос на обновление данных о продуктах
app.put('/products/edit', (req, res) => {
    instance.put('/b/' + req.body.productsID, {
        "products": req.body.productsArray,
        "totalCount": req.body.totalCount,
        "nextID": req.body.nextID
    }).then((response) => {
        res.json({
            products: response.data.record.products,
            nextId: response.data.record.nextID,
            totalCount: response.data.record.totalCount
        })
    }).catch((err) => {
        res.json({
            message: err.message
        })
    })
})

//Запрос на обновление данных о хранилище
app.put('/store/edit', (req, res) => {
    instance.put('/b/' + req.body.storeID, {
        "store": req.body.storeArray,
        "totalCount": req.body.totalCount,
        "nextID": req.body.nextID
    }).then((response) => {
        res.json({
            store: response.data.record.store,
            totalCount: response.data.record.totalCount,
            nextID: response.data.record.nextID
        })
    }).catch((err) => {
        res.json({
            message: err.message
        })
    })
})

//Запрос на получения хранилища
app.get('/store/:storeID', (req, res) => {
    instance.get('/b/' + req.params.storeID + '/1', ).then((response) => {
        res.json({
            store: response.data.record.store,
            totalCount: response.data.record.totalCount,
            nextID: response.data.record.nextID
        })
    }).catch((err) => {
        res.json({
            message: err.message
        })
    })
})

//Запрос на получения продуктов
app.get('/products/:productsID', (req, res) => {
    instance.get('/b/' +req.params.productsID, ).then((response) => {
        res.json({
            products: response.data.record.products,
            totalCount: response.data.record.totalCount,
            nextID: response.data.record.nextID
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

