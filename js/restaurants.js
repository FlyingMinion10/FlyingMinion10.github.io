document.addEventListener("DOMContentLoaded", function() {
    const restaurantLoginForm = document.getElementById("login-form");
    const restaurantRegisterForm = document.getElementById("restaurant-register-form");

    if (restaurantLoginForm) {
        restaurantLoginForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const user = document.getElementById("login-user").value;
            const password = document.getElementById("login-password").value;
            
            const response = await fetch('/api/login-rest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, password })
            });

            if (response.ok) {
                alert("Inicio de sesión exitoso!");
                window.location.href = "/restaurant_interface.html";
            } else {
                alert("Usuario o contraseña incorrectos!");
            }
        });
    }

    if (restaurantRegisterForm) {
        restaurantRegisterForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const user = document.getElementById("restaurant-user").value;
            const password = document.getElementById("restaurant-password").value;
            const name = document.getElementById("restaurant-name").value;
            const location = document.getElementById("restaurant-location").value;

            const response = await fetch('/api/register-rest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, password, name, location })
            });

            if (response.ok) {
                alert("Restaurante registrado con éxito!");
                window.location.href = "/";
            } else {
                alert("Error al registrar el restaurante");
            }
        });
    }

    const createOrderForm = document.getElementById("create-order-form");
    const toggleCreationButton = document.getElementById("toggle-creation");
    const orderForm = document.getElementById("order-form");

    if (createOrderForm) {
        createOrderForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const clientName = document.getElementById("client-name").value;
            const orderDescription = document.getElementById("order-description").value;
            const destination = document.getElementById("destination").value;
            const pickupTime = document.getElementById("pickup-time").value;

            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ clientName, orderDescription, destination, pickupTime })
            });

            if (response.ok) {
                alert("Orden creada con éxito!");
                loadOrdersRest();
                createOrderForm.reset(); // Limpiar el formulario después de crear la orden
            } else {
                alert("Error al crear la orden");
            }
        });
    }

    if (toggleCreationButton) {
        toggleCreationButton.addEventListener("click", function() {
            orderForm.classList.toggle("hidden");
        });
    }

    async function loadOrdersRest() {
        const response = await fetch('/api/orders-rest');
        if (response.ok) {
            const orders = await response.json();
            const ordersContainer = document.getElementById("orders-container-rest");
            ordersContainer.innerHTML = '';
            orders.forEach(order => {
                const orderCard = document.createElement("div");
                orderCard.classList.add("order-card");
                orderCard.innerHTML = `
                    <h3>Orden de ${order.clientName}</h3>
                    <p><strong>Descripción:</strong> ${order.orderDescription}</p>
                    <p><strong>Destino:</strong> ${order.destination}</p>
                    <p><strong>Tiempo de Recolección:</strong> ${order.pickupTime}</p>
                `;
                ordersContainer.appendChild(orderCard);
            });
        }
    }
    loadOrdersRest();
    
    async function loadDeliversRest() {
        const response = await fetch('/api/delivers-rest');
        if (response.ok) {
            const orders = await response.json();
            const ordersContainer = document.getElementById("delivers-container-rest");
            ordersContainer.innerHTML = '';
            orders.forEach(order => {
                const orderCard = document.createElement("div");
                orderCard.classList.add("order-card");
                orderCard.innerHTML = `
                    <h3>Orden de ${order.clientName}</h3>
                    <p><strong>Descripción:</strong> ${order.orderDescription}</p>
                    <p><strong>Destino:</strong> ${order.destination}</p>
                    <p><strong>Tiempo de Recolección:</strong> ${order.pickupTime}</p>
                `;
                ordersContainer.appendChild(orderCard);
            });
        }
    }
    loadDeliversRest()

    async function loadRestaurantName() {
        const response = await fetch('/api/restaurant-name');
        if (response.ok) {
            const data = await response.json();
            const restaurantNameElement = document.getElementById("restaurant-name");
            restaurantNameElement.textContent = data.name;
        } else {
            window.location.href = "/restaurant_login.html";
        }
    }

    // Llama a la función inmediatamente
    const currentPath = window.location.pathname;
    if (currentPath === '/restaurant_interface.html') {
        loadRestaurantName();
    }

    const clearDeliveredOrders = document.getElementById("clear-delivered-orders");

    if (clearDeliveredOrders) {
        clearDeliveredOrders.addEventListener("click", async function() {
            const response = await fetch('/api/clear-delivered-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("Ordenes entregadas eliminados con éxito!");
                loadOrdersRest();
            } else {
                alert("Error al eliminar las ordenes entregadas");
            }
        });
    }
    
});
