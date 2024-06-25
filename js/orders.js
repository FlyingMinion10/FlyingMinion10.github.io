// orders.js
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const nombre = urlParams.get('nombre');
    const destino = urlParams.get('destino');
    const descripcion = urlParams.get('descripcion');
    const tiempo = urlParams.get('tiempo');
    const rest = urlParams.get('rest');
    const nid = urlParams.get('nid');

    document.getElementById('customer-name').textContent = nombre || 'No especificado';
    document.getElementById('destino').textContent = destino || 'No especificado';
    document.getElementById('order-description').textContent = descripcion || 'No especificado';
    document.getElementById('pickup-time').textContent = tiempo || 'No especificado';
    document.getElementById('restaurant-name').textContent = rest || 'No especificado'; // problema

    // Codificar los valores de rest y destino para uso en URL
    const encodedRest = encodeURIComponent(rest);
    const encodedDestino = encodeURIComponent(destino);

    // Construir la URL de Google Maps
    const googleMapsUrl = `https://www.google.com/maps/dir/${encodedRest},Cdad.+Guzmán,+Jal./${encodedDestino},+Cd+Guzmán+Centro+Cdad.+Guzmán,+Jal./`;
    // Enviar la URL a la etiqueta <a> con id 'gmaps-link'
    document.getElementById('gmaps-link').href = googleMapsUrl;

    // Construir nuevos enlaces para la confirmación de la orden
    const name = encodeURIComponent(nombre);
    const destination = encodeURIComponent(destino);
    const orderDescription = encodeURIComponent(descripcion);
    const pickupTime = encodeURIComponent(tiempo);
    const restaurant = encodeURIComponent(rest);
    const id = encodeURIComponent(nid);

    const orderDetailsForm = document.getElementById("order-details__form");
    
    window.confirmPickup = async function() {
        const collectorName = sessionStorage.getItem('collectorName');
        const response = await fetch(`/api/confirm-pickup/${nid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ collector: collectorName })
        });

        if (response.ok) {
            alert("Orden confirmada para reparto!");
            // Redirige a la nueva página con los parámetros de URL
            window.location.href = `/order_confirmed.html?nombre=${nombre}&descripcion=${descripcion}&destino=${destino}&tiempo=${tiempo}&rest=${rest}&nid=${nid}`;
        } else {
            alert("Error al confirmar la orden");
        }
    };
    
    window.leavePickup = async function() {
        const response = await fetch(`/api/leave-pickup/${nid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            alert('Pedido abandonado, lo sentimos usted ha sido penalizado por 30 minutos');
            // Redirige a la nueva página con los parámetros de URL
            window.location.href='collector_dashboard.html'
        } else {
            alert("Error al abandonar la orden : a");
        }
    };
    
    window.confirmDelivery = async function() {
        const response = await fetch(`/api/confirm-delivery/${nid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            alert("Entrega confirmada!");

            let countdown = 6;
            const countdownElement = document.createElement('p');
            countdownElement.id = 'countdown';
            document.body.appendChild(countdownElement);

            const countdownInterval = setInterval(() => {
                countdown--;
                countdownElement.textContent = `Redirigiendo al menú principal en ${countdown} segundos...`;

                if (countdown === 0) {
                    clearInterval(countdownInterval);
                    window.location.href = 'collector_dashboard.html';
                }
            }, 1000);
        } else {
            alert("Error al confirmar la entrega");
        }
    };
        
});
