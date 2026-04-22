DROP DATABASE IF EXISTS storelink;
CREATE DATABASE storelink;
USE storelink;

-- 1. TABLA DE CATEGORÍAS 
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. TABLA DE CLIENTES
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL
);

-- 3. TABLA DE PRODUCTOS 
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
	author VARCHAR(100),
    category_id INT,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT chk_quantity_positive CHECK (quantity >= 0),
    CONSTRAINT chk_price_positive CHECK (price > 0)
);



-- 4. TABLA DE PAGOS
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    cardholder_name VARCHAR(100),
    amount DECIMAL(10,2),
    payment_status VARCHAR(50)
);

-- 5. TABLA DE ÓRDENES
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    payment_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_address VARCHAR(255),
    total_amount DECIMAL(10,2),
    order_status ENUM('Pending', 'Processing', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id),
    CONSTRAINT chk_amount_positive CHECK (total_amount > 0)
);

-- 6. TABLA DE ITEMS DE ORDEN
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) AS (quantity * product_price) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT chk_quantity CHECK (quantity > 0),
    CONSTRAINT chk_price CHECK (product_price > 0)
);

-- 7. SEGURIDAD: ROLES Y USUARIOS
CREATE TABLE role_details (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL
);

CREATE TABLE user_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) NOT NULL,
    password VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_info_roles_details (
    id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (id, role_id),
    FOREIGN KEY (id) REFERENCES user_details(id),
    FOREIGN KEY (role_id) REFERENCES role_details(role_id)
);

-- 8. PROMOCIONES 
CREATE TABLE category_promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL UNIQUE, -- Relación directa por ID
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    discount_percentage DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- ==========================================
-- DATA DE PRUEBA (DATA SEEDING)
-- ==========================================

-- Insertar Categorías 
INSERT INTO categories (name) VALUES 
('Novelas'),
('Ciencia'),
('Historia'),
('Programación'),
('Desarrollo Personal'),
('Fantasía');

-- Insertar Clientes
INSERT INTO customers (name, email, phone, password) VALUES
('Carlos Rojas', 'carlos@storelink.com', '987654321', '$2a$10$slsBrN9Q1UPTmLPTqna99eHRFfhjM78WIDwgn.BSSUJDTFCGjl6dq'),
('Lucía Mendoza', 'lucia@storelink.com', '912345678', '$2a$10$G4AlaS/KiuCcKPmW1Ef96eUN7FDPCWpdLMmhCiPVS6OynP3FtlSUi');

-- Insertar Productos 
INSERT INTO products (product_name, author, category_id, description, price, quantity, image_url) VALUES

-- NOVELAS
('Cien años de soledad', 'Gabriel García Márquez', 1, 'Obra maestra de Gabriel García Márquez', 65.00, 20, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?'),
('Orgullo y prejuicio', 'Jane Austen', 1, 'Clásico romántico de Jane Austen', 50.00, 15, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?'),

-- CIENCIA
('Breves respuestas a las grandes preguntas', 'Stephen Hawking', 2, 'Libro de Stephen Hawking sobre el universo', 70.00, 18, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?'),
('El gen egoísta', 'Richard Dawkins', 2, 'Obra de Richard Dawkins sobre evolución', 68.00, 12, 'https://images.unsplash.com/photo-1519681393784-d120267933ba?'),

-- HISTORIA
('Sapiens: De animales a dioses', 'Yuval Noah Harari', 3, 'Historia de la humanidad por Yuval Noah Harari', 75.00, 25, 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?'),
('Guns, Germs, and Steel', 'Jared Diamond', 3, 'Análisis histórico de civilizaciones', 72.00, 10, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?'),

-- PROGRAMACIÓN
('Clean Code', 'Robert C. Martin', 4, 'Buenas prácticas de programación', 95.00, 30, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?'),
('Java: The Complete Reference', 'Herbert Schildt', 4, 'Guía completa de Java', 110.00, 22, 'https://images.unsplash.com/photo-1518770660439-4636190af475?'),

-- DESARROLLO PERSONAL
('Hábitos atómicos', 'James Clear', 5, 'Mejora personal y formación de hábitos', 60.00, 35, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?'),
('El poder del ahora', 'Eckhart Tolle', 5, 'Guía espiritual y mindfulness', 58.00, 20, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?'),

-- FANTASÍA
('Harry Potter y la piedra filosofal', 'J.K. Rowling', 6, 'Inicio de la saga mágica', 80.00, 40, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?'),
('El Señor de los Anillos', 'J.R.R. Tolkien', 6, 'Épica historia de Tolkien', 120.00, 15, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?');

-- Insertar Roles
INSERT INTO role_details (role_name) VALUES ('ADMIN'), ('CUSTOMER');

-- Insertar Usuarios de Sistema
INSERT INTO user_details (name, email, password, enabled) VALUES
('Carlos Rojas', 'carlos@storelink.com', '$2a$10$slsBrN9Q1UPTmLPTqna99eHRFfhjM78WIDwgn.BSSUJDTFCGjl6dq', TRUE), -- password@123 - ADMIN
('Lucía Mendoza', 'lucia@storelink.com', '$2a$10$G4AlaS/KiuCcKPmW1Ef96eUN7FDPCWpdLMmhCiPVS6OynP3FtlSUi', TRUE); -- password@user - CUSTOMER

-- Asignar Roles (Carlos = ADMIN, Lucía = CUSTOMER)
INSERT INTO user_info_roles_details (id, role_id) VALUES (1,1), (2,2);

-- Insertar Promociones iniciales 
-- Novelas (10% activo)
INSERT INTO category_promotions (category_id, start_date, end_date, discount_percentage, is_active)
VALUES (1, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 10.0, TRUE);

-- Ciencia (15% activo)
INSERT INTO category_promotions (category_id, start_date, end_date, discount_percentage, is_active)
VALUES (2, '2026-02-01 00:00:00', '2026-12-31 23:59:59', 15.0, TRUE);

-- Historia (sin promo activa)
INSERT INTO category_promotions (category_id, start_date, end_date, discount_percentage, is_active)
VALUES (3, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 5.0, FALSE);

-- Programación (20%)
INSERT INTO category_promotions (category_id, start_date, end_date, discount_percentage, is_active)
VALUES (4, '2026-03-01 00:00:00', '2026-12-31 23:59:59', 20.0, TRUE);