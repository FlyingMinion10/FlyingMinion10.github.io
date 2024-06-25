// collectors.js
document.addEventListener("DOMContentLoaded", function() {
    const collectorLoginForm = document.getElementById("collector-login-form");
    const collectorRegisterForm = document.getElementById("collector-register-form");

    if (collectorLoginForm) {
        collectorLoginForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const user = document.getElementById("collector-login-user").value;
            const password = document.getElementById("collector-login-password").value;
            
            const response = await fetch('/api/login-coll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, password })
            });

            if (response.ok) {
                alert("Inicio de sesión exitoso!");
                window.location.href = "/collector_dashboard.html";
            } else {
                alert("Usuario o contraseña incorrectos!");
            }
        });
    }

    if (collectorRegisterForm) {
        collectorRegisterForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("collector-email").value;
            const password = document.getElementById("collector-password").value;
            const user = document.getElementById("collector-user").value;
            const name = document.getElementById("collector-name").value;
            const curp = document.getElementById("collector-curp").value;

            const response = await fetch('/api/register-coll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, user, name, curp })
            });

            if (response.ok) {
                alert("Repartidor registrado con éxito!");
                window.location.href = "/collector_login.html";
            } else {
                alert("Error al registrar al repartidor");
            }
        });
    }

    async function loadOrdersColl() {
        const response = await fetch('/api/orders-coll');
        if (response.ok) {
            const orders = await response.json();
            const ordersContainer = document.getElementById("orders-container-coll");
            ordersContainer.innerHTML = '';
            orders.forEach(order => {
                const orderCard = document.createElement("div");
                orderCard.classList.add("order-card");
                orderCard.innerHTML = `
                    <h3>Restaurante - ${order.restaurant}</h3>
                    <p><strong>Tiempo estimado:</strong> ${order.pickupTime}</p>
                    <p><strong>Destino:</strong> ${order.destination}</p>
                    <p><strong>Descripción:</strong> ${order.orderDescription}</p>
                    <div class="button blue">
                        <a href="order_detail.html?nombre=${order.clientName}&descripcion=${encodeURIComponent(order.orderDescription)}&destino=${order.destination}&tiempo=${order.pickupTime}&rest=${order.restaurant}&nid=${order.id}">Más detalles</a>
                    </div>
                `;
                ordersContainer.appendChild(orderCard);
            });
        }
    }
    loadOrdersColl();

    async function loadCollectorName() {
        const response = await fetch('/api/collector-name');
        if (response.ok) {
            const data = await response.json();
            const collectorNameElement = document.getElementById("collector-name");
            collectorNameElement.textContent = data.name;
        } else {
            window.location.href = "/collector_login.html";
        }
    }

    // Llama a la función inmediatamente
    const currentPath = window.location.pathname;
    if (currentPath === '/collector_dashboard.html') {
        loadCollectorName();
    }    

    const toggleDeliveredButton = document.getElementById("confirm-delivery-button");
    const deliveredForm = document.getElementById("delivered-form");

    if (toggleDeliveredButton) {
        toggleDeliveredButton.addEventListener("click", function() {
            deliveredForm.classList.toggle("hidden");
        });
    }
});
