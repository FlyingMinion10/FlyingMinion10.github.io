// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const db = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

/// API PARA LOS RESTAURANTES
/// API PARA LOS RESTAURANTES
/// API PARA LOS RESTAURANTES

app.post('/api/register-rest', (req, res) => {
    const { user, password, name, location } = req.body;
    const stmt = db.prepare("INSERT INTO rest_users (user, password, name, location) VALUES (?, ?, ?, ?)");
    stmt.run(user, password, name, location, function(err) {
        if (err) {
            return res.status(500).send("Error al registrar el restaurante");
        }
        res.status(200).send("Restaurante registrado con éxito");
        console.log(`Restaurante ${name} registrado con éxito`);
    });
    stmt.finalize();
});

app.post('/api/login-rest', (req, res) => {
    const { user, password } = req.body;
    db.get("SELECT * FROM rest_users WHERE user = ? AND password = ?", [user, password], (err, row) => {
        if (err) {
            return res.status(500).send("Error al iniciar sesión");
        }
        if (row) {
            req.session.restaurantName = row.name; // Guardar el nombre del restaurante en la sesión
            res.status(200).send("Inicio de sesión exitoso");
        } else {
            res.status(401).send("Usuario o contraseña incorrectos");
        }
    });
});

app.get('/api/restaurant-name', (req, res) => {
    if (req.session.restaurantName) {
        res.json({ name: req.session.restaurantName });
    } else {
        res.status(401).send("Usuario no autenticado");
    }
});

app.post('/api/create-order', (req, res) => {
    const { clientName, orderDescription, destination, pickupTime } = req.body;
    const restaurant = req.session.restaurantName; // Obtener el nombre del restaurante de la sesión

    if (!restaurant) {
        return res.status(401).send("Usuario no autenticado");
    }

    const stmt = db.prepare("INSERT INTO orders (restaurant, clientName, orderDescription, destination, pickupTime) VALUES (?, ?, ?, ?, ?)");
    stmt.run(restaurant, clientName, orderDescription, destination, pickupTime, function(err) {
        if (err) {
            return res.status(500).send("Error al crear la orden");
        }
        res.status(200).send("Orden creada con éxito");
    });
    stmt.finalize();
});

app.get('/api/orders-rest', (req, res) => {
    const restaurant = req.session.restaurantName; // Obtener el nombre del restaurante de la sesión

    if (!restaurant) {
        return res.status(401).send("Usuario no autenticado");
    }

    db.all("SELECT * FROM orders WHERE restaurant = ? AND delivered = 0", [restaurant], (err, rows) => {
        if (err) {
            return res.status(500).send("Error al obtener las órdenes");
        }
        res.status(200).json(rows);
    });
});

app.get('/api/delivers-rest', (req, res) => {
    const restaurant = req.session.restaurantName; // Obtener el nombre del restaurante de la sesión

    if (!restaurant) {
        return res.status(401).send("Usuario no autenticado");
    }

    db.all("SELECT * FROM orders WHERE restaurant = ? AND delivered = 1", [restaurant], (err, rows) => {
        if (err) {
            return res.status(500).send("Error al obtener las órdenes");
        }
        res.status(200).json(rows);
    });
});

app.post('/api/clear-delivered-orders', (req, res) => {
    const restaurant = req.session.restaurantName;

    db.run("DELETE FROM orders WHERE restaurant = ? AND delivered = 1", [restaurant], function(err) {
        if (err) {
            return res.status(500).send("Error al confirmar la entrega");
        }
        res.status(200).send("Entrega confirmada");
    });
});

/// API PARA LOS REPARTIDORES
/// API PARA LOS REPARTIDORES
/// API PARA LOS REPARTIDORES

app.post('/api/register-coll', (req, res) => {
    const { email, password, user, name, curp } = req.body;
    const stmt = db.prepare("INSERT INTO collector_users (email, password, user, name, curp) VALUES (?, ?, ?, ?, ?)");
    stmt.run(email, password, user, name, curp, function(err) {
        if (err) {
            return res.status(500).send("Error al registrar al repartidor");
        }
        res.status(200).send("Repartidor registrado con éxito");
        console.log(`Repartidor ${user} registrado con éxito`);
    });
    stmt.finalize();
});

app.post('/api/login-coll', (req, res) => {
    const { user, password } = req.body;
    db.get("SELECT * FROM collector_users WHERE user = ? AND password = ?", [user, password], (err, row) => {
        if (err) {
            return res.status(500).send("Error al iniciar sesión");
        }
        if (row) {
            req.session.collectorName = row.name; // Guardar el nombre del restaurante en la sesión
            res.status(200).send("Inicio de sesión exitoso");
        } else {
            res.status(401).send("Usuario o contraseña incorrectos");
        }
    });
});

app.get('/api/collector-name', (req, res) => {
    if (req.session.collectorName) {
        res.json({ name: req.session.collectorName });
    } else {
        res.status(401).send("Usuario no autenticado");
    }
});

app.get('/api/orders-coll', (req, res) => {
    db.all("SELECT * FROM orders WHERE delivered = 0", (err, rows) => {
        if (err) {
            return res.status(500).send("Error al obtener las órdenes");
        }
        res.status(200).json(rows);
    });
});

app.post('/api/confirm-pickup/:id', (req, res) => {
    const orderId = req.params.id;
    const collector = req.session.collectorName;

    db.run("UPDATE orders SET collector = ? WHERE id = ?", [collector, orderId], function(err) {
        if (err) {
            return res.status(500).send("Error al confirmar la orden");
        }
        res.status(200).send("Orden confirmada");
    });
});

app.post('/api/leave-pickup/:id', (req, res) => {
    const orderId = req.params.id
    db.run("UPDATE orders SET collector = 'libre' WHERE id = ?", [orderId], function(err) {
        if (err) {
            return res.status(500).send("Error al confirmar la orden");
        }
        res.status(200).send("Orden confirmada");
    });
});

app.post('/api/confirm-delivery/:id', (req, res) => {
    const orderId = req.params.id;

    db.run("UPDATE orders SET delivered = 1 WHERE id = ?", [orderId], function(err) {
        if (err) {
            return res.status(500).send("Error al confirmar la entrega");
        }
        res.status(200).send("Entrega confirmada");
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
