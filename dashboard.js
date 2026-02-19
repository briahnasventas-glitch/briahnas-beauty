const Dashboard = {
    async init() {
        // MATCHING SECURITY WITH ADMIN PANEL
        const ALLOWED_EMAILS = ['fabian@example.com', 'eunice@example.com', 'briahnasbeauty@gmail.com', 'briahnas.ventas@gmail.com'];

        auth.onAuthStateChanged(async user => {
            if (!user) {
                window.location.href = 'index.html';
                return;
            }

            if (!ALLOWED_EMAILS.includes(user.email)) {
                alert('⛔ Acceso Denegado: Tu email no está autorizado para el panel administrativo.');
                window.location.href = 'index.html';
                return;
            }

            // In a real app, check for admin role in Firestore
            console.log('✅ Admin Session Active:', user.email);
            this.loadStats();
            this.loadProducts();
        });
    },

    async loadStats() {
        try {
            const productsSnapshot = await db.collection('productos').get();
            const ordersSnapshot = await db.collection('pedidos').get();

            document.getElementById('total-products').textContent = productsSnapshot.size;
            document.getElementById('total-orders').textContent = ordersSnapshot.size;
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },

    async loadProducts() {
        try {
            const snapshot = await db.collection('productos').get();
            const table = document.getElementById('products-table');

            if (snapshot.empty) {
                table.innerHTML = '<p style="padding:2rem; text-align:center">No hay productos en la base de datos.</p>';
                return;
            }

            let html = `
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>`;

            snapshot.docs.forEach(doc => {
                const p = doc.data();
                html += `
                    <tr>
                        <td style="font-weight:600">${p.name}</td>
                        <td><span class="badge-tag">${p.category}</span></td>
                        <td>L. ${p.price.toFixed(2)}</td>
                        <td>
                            <button onclick="Dashboard.editProduct('${doc.id}')" class="btn-ghost btn-sm" style="margin-right:5px">Editar</button>
                            <button onclick="Dashboard.deleteProduct('${doc.id}')" class="btn-ghost btn-sm" style="color:#d00">Eliminar</button>
                        </td>
                    </tr>
                `;
            });

            html += '</tbody>';
            table.innerHTML = html;
        } catch (error) {
            console.error('Error loading products:', error);
        }
    },

    showSection(section) {
        // Toggle Sections
        document.getElementById('stats-section').style.display = section === 'stats' ? 'block' : 'none';
        document.getElementById('productos-section').style.display = section === 'productos' ? 'block' : 'none';
        document.getElementById('ordenes-section').style.display = section === 'ordenes' ? 'block' : 'none';

        // Toggle Nav Links
        document.querySelectorAll('.nav-link-admin').forEach(link => {
            link.classList.toggle('active', link.id === `nav-${section}`);
        });

        if (section === 'productos') this.loadProducts();
        if (section === 'stats') this.loadStats();
    },

    async deleteProduct(productId) {
        if (!confirm('¿Estás seguro de eliminar este producto de forma permanente?')) return;

        try {
            await db.collection('productos').doc(productId).delete();
            alert('✅ Producto eliminado del catálogo.');
            this.loadProducts();
            this.loadStats();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('❌ Error al eliminar: ' + error.message);
        }
    },

    showAddProduct() {
        alert('Funcionalidad de "Añadir Producto" : \nEsta función requiere un formulario completo para todos los campos de Firestore.');
    },

    editProduct(id) {
        alert('Editar producto ID: ' + id);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});
