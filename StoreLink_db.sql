DROP DATABASE IF EXISTS storelink;
CREATE DATABASE storelink;
USE storelink;

-- 1. CATEGORY TABLE
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. CUSTOMER TABLE
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL
);

-- 3. PRODUCT TABLE
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



-- 4. PAYMENT TABLE
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    cardholder_name VARCHAR(100),
    amount DECIMAL(10,2),
    payment_status VARCHAR(50)
);

-- 5. ORDER TABLE
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

-- 6. PRODUCT ITEMS IN ORDER TABLE
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

-- 7. SECURITY: ROLES AND USERS
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

-- 8. PROMOTIONS 
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
-- TEST DATA (DATA SEEDING)
-- ==========================================

-- Insert Categories 
INSERT INTO categories (name) VALUES 
('Programación'), 
('Ficción'),
('Ciencia Ficción'),
('Desarrollo Personal'),
('Historia'),
('Fantasía'),
('Terror'),
('Misterio'),
('Realismo Magico'),
('Thriller Psicologico'),
('Exitos Empresariales'),
('Universo Juvenil'),
('Comics o Mangas');

-- Insert Clients
INSERT INTO customers (name, email, phone, password) VALUES
('Carlos Rojas', 'carlos@storelink.com', '987654321', '$2a$10$slsBrN9Q1UPTmLPTqna99eHRFfhjM78WIDwgn.BSSUJDTFCGjl6dq'),
('Lucía Mendoza', 'lucia@storelink.com', '912345678', '$2a$10$G4AlaS/KiuCcKPmW1Ef96eUN7FDPCWpdLMmhCiPVS6OynP3FtlSUi');

-- Insert Products
INSERT INTO products (product_name, author, category_id, description, price, quantity, image_url) VALUES
('Automate the Boring Stuff with Python', 'Al Sweigart', 1, 'Ideal para principiantes en Python.', 45.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960106/libro1_xurwq9.jpg'),
('Python Crash Course', 'Eric Matthes', 1, 'Curso rápido y práctico de Python.', 50.00, 8, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960106/libro2_tjjs1x.webp'),
('HTML & CSS: Design and Build Websites', 'Jon Duckett', 1, 'Guía visual para desarrollo web.', 55.00, 12, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960107/libro3_pazkjd.jpg'),
('JavaScript and JQuery: Interactive Front-End Web Development', 'Jon Duckett', 1, 'Interactividad y front-end moderno.', 60.00, 9, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960107/libro4_pfhyc0.jpg'),
('Cien Años de Soledad', 'Gabriel García Márquez', 2, 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de varias generaciones en el pueblo ficticio de Macondo.', 75.00, 5, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960107/libro5_vndjrn.jpg'),
('1984', 'George Orwell', 3, 'Una distopía sobre un mundo totalitario donde el gobierno controla todos los aspectos de la vida y vigila constantemente a los ciudadanos.', 80.00, 6, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960108/libro6_z4n2h4.jpg'),
('El Principito', 'Antoine de Saint-Exupéry', 2, 'Una historia filosófica sobre un pequeño príncipe de otro planeta que explora temas como el amor, la amistad y el sentido de la vida.', 40.00, 15, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960109/libro7_w5ye01.jpg'),
('Orgullo y Prejuicio', 'Jane Austen', 2, 'Una novela romántica que examina las dinámicas de clase social, el orgullo y los prejuicios en el siglo XIX en Inglaterra.', 50.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960109/libro8_zqm83m.jpg'),
('Dune', 'Frank Herbert', 3, 'La épica historia de un joven destinado a convertirse en el líder de un planeta desértico lleno de intrigas políticas, religiosas y ecológicas.', 85.00, 4, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960110/libro9_gvmcby.jpg'),
('Fundación', 'Isaac Asimov', 3, 'Una saga sobre el colapso y resurgimiento de una civilización galáctica a través de la ciencia y la psicohistoria.', 90.00, 7, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960111/libro10_drkpvr.webp'),
('Neuromante', 'William Gibson', 3, 'Una obra que define el género ciberpunk, siguiendo la historia de un hacker que realiza trabajos peligrosos en un futuro distópico.', 65.00, 6, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960111/libro11_osefrl.jpg'),
('Ready Player One', 'Ernest Cline', 3, 'Una aventura futurista donde los personajes buscan un tesoro escondido en un mundo virtual lleno de referencias a la cultura pop.', 70.00, 8, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960112/libro12_xwknc2.webp'),
('Hábitos Atómicos', 'James Clear', 4, 'Una guía práctica para construir buenos hábitos y romper los malos, enfocada en pequeños cambios que generan grandes resultados.', 40.00, 15, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960112/libro13_fdbcvl.webp'),
('Cómo Ganar Amigos e Influir en las Personas', 'Dale Carnegie', 4, 'Estrategias para mejorar las relaciones personales y profesionales a través de la empatía y la comunicación efectiva.', 50.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960113/libro14_s5jxwp.webp'),
('El Poder del Ahora', 'Eckhart Tolle', 4, 'Una exploración de cómo vivir plenamente en el presente y liberarse de las preocupaciones del pasado y el futuro.', 60.00, 12, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960114/libro15_efw7ip.jpg'),
('Piensa y Hazte Rico', 'Napoleon Hill', 4, 'Un clásico sobre mentalidad y estrategias para alcanzar el éxito financiero y personal.', 55.00, 9, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960114/libro16_neeksb.jpg'),
('Sapiens: De Animales a Dioses', 'Yuval Noah Harari', 5, 'Historia de la humanidad desde sus orígenes hasta el mundo moderno, analizando cómo las sociedades y la cultura han evolucionado.', 65.00, 8, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960115/libro17_k2pcsc.jpg'),
('El Diario de Ana Frank', 'Ana Frank', 5, 'El conmovedor relato de una niña judía que se escondió con su familia durante la ocupación nazi en la Segunda Guerra Mundial.', 55.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960115/libro18_fbdj6t.webp'),
('Guns, Germs, and Steel', 'Jared Diamond', 5, 'Analiza cómo la geografía y los recursos naturales influyeron en el desarrollo desigual de las civilizaciones humanas.', 70.00, 6, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960116/libro19_tcjzcs.webp'),
('El Arte de la Guerra', 'Sun Tzu', 5, 'Un antiguo tratado militar chino que también se aplica a estrategias en negocios y liderazgo.', 40.00, 12, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960117/libro20_zkzodf.webp'),
('El Señor de los Anillos', 'J.R.R. Tolkien', 6, 'La épica historia de la lucha entre el bien y el mal en la Tierra Media, centrada en un anillo que puede destruir o dominar el mundo.', 95.00, 5, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960117/libro21_gsqurf.jpg'),
('Harry Potter y la Piedra Filosofal', 'J.K. Rowling', 6, 'La primera entrega de una saga sobre un joven mago que descubre su herencia mágica y enfrenta a un oscuro enemigo.', 85.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960118/libro22_wygnrf.webp'),
('La Rueda del Tiempo', 'Robert Jordan', 6, 'Una serie épica que combina magia, profecías y una lucha entre la luz y la oscuridad en un mundo vasto y complejo.', 90.00, 8, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960119/libro23_knpqus.webp'),
('Juego de Tronos', 'George R.R. Martin', 6, 'La lucha por el poder entre varias casas nobles en un mundo de fantasía lleno de traiciones, intrigas y dragones.', 100.00, 7, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960119/libro24_k9oxdy.jpg'),
('It (Eso)', 'Stephen King', 7, 'Una novela de terror sobre un grupo de amigos que enfrentan a una entidad malvada que adopta la forma de un payaso.', 60.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960120/libro25_ue4sfn.webp'),
('Drácula', 'Bram Stoker', 7, 'La clásica historia de un vampiro que llega a Inglaterra, desatando una serie de eventos aterradores.', 50.00, 12, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960120/libro26_pzzh58.jpg'),
('El Exorcista', 'William Peter Blatty', 7, 'Una novela que relata el intento de un sacerdote por exorcizar a una niña poseída por un demonio.', 65.00, 8, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960122/libro27_d5yeud.jpg'),
('La Llamada de Cthulhu', 'H.P. Lovecraft', 7, 'Un relato de horror cósmico sobre entidades ancestrales que desafían la comprensión humana.', 55.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960122/libro28_aukswj.webp'),
('El Gran Gatsby', 'F. Scott Fitzgerald', 8, 'Explora la decadencia de la sociedad estadounidense en los años 20 a través de Jay Gatsby y su amor no correspondido por Daisy Buchanan, criticando el sueño americano.', 60.00, 12, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960173/libro30_tp16rk.jpg'),
('La Sombra del Viento', 'Carlos Ruiz Zafón', 8, 'Ambientada en la Barcelona de la postguerra, Daniel Sempere descubre un libro olvidado que lo lleva a una intriga sobre su autor y oscuros secretos del pasado.', 65.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960173/libro31_qbckhh.jpg'),
('El Asesinato de Roger Ackroyd', 'Agatha Christie', 8, 'Novela de Agatha Christie donde el detective Hércules Poirot investiga el asesinato de Roger Ackroyd en un pueblo inglés con un sorprendente giro final.', 50.00, 15, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960174/libro32_nimk61.jpg'),
('La Casa de los Espíritus', 'Isabel Allende', 9, 'Historia de varias generaciones de la familia Trueba en Chile, donde se mezclan amor, política, lucha de clases y elementos de realismo mágico.', 70.00, 7, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960174/libro33_fzxdj8.jpg'),
('La Chica del Tren', 'Paula Hawkins', 10, 'Rachel observa diariamente vidas ajenas desde el tren hasta que presencia un hecho extraño que la involucra en una investigación llena de giros psicológicos.', 60.00, 8, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960176/libro35_i62fim.jpg'),
('Los 7 Hábitos de la Gente Altamente Efectiva', 'Stephen R. Covey', 11, 'Guía de 7 hábitos para mejorar la productividad, el liderazgo y la efectividad personal y profesional.', 65.00, 6, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960176/libro36_k5bkal.jpg'),
('La Estrategia del Océano Azul', 'W. Chan Kim y Renée Mauborgne', 11, 'Propone crear mercados sin competencia (“océanos azules”) para innovar y crecer.', 75.00, 8, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960177/libro37_rghgj8.webp'),
('Los Juegos del Hambre', 'Suzanne Collins', 12, 'En un futuro distópico, jóvenes compiten en un evento mortal televisado.', 80.00, 5, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960178/libro38_g5inax.jpg'),
('Bajo la misma estrella', 'John Green', 12, 'Dos jóvenes con cáncer viven amor y amistad mientras enfrentan la enfermedad.', 85.00, 6, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960179/libro39_btaff4.jpg'),
('El corredor del laberinto', 'James Dashner', 12, 'Un joven sin memoria debe sobrevivir y escapar de un laberinto mortal.', 70.00, 9, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960179/libro40_lxmb5a.jpg'),
('Watchmen', 'Alan Moore', 13, 'Vigilantes retirados enfrentan una conspiración en un mundo oscuro y realista.', 50.00, 10, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960180/libro41_fejmal.webp'),
('One Piece', 'Eiichiro Oda', 13, 'Piratas buscan el legendario tesoro “One Piece” en una gran aventura.', 45.00, 12, 'https://res.cloudinary.com/dx4kkwqzs/image/upload/q_auto/f_auto/v1776960181/libro42_cjzytn.jpg');

-- Insert Roles
INSERT INTO role_details (role_name) VALUES ('ADMIN'), ('CUSTOMER');

-- Insert System Users
INSERT INTO user_details (name, email, password, enabled) VALUES
('Carlos Rojas', 'carlos@storelink.com', '$2a$10$slsBrN9Q1UPTmLPTqna99eHRFfhjM78WIDwgn.BSSUJDTFCGjl6dq', TRUE), 
('Lucía Mendoza', 'lucia@storelink.com', '$2a$10$G4AlaS/KiuCcKPmW1Ef96eUN7FDPCWpdLMmhCiPVS6OynP3FtlSUi', TRUE);

-- Assign Roles (Carlos = ADMIN, Lucía = CUSTOMER)
INSERT INTO user_info_roles_details (id, role_id) VALUES (1,1), (2,2);

-- Insert initial promotions 
-- Programación (10% active)
INSERT INTO category_promotions (category_id, start_date, end_date, discount_percentage, is_active)
VALUES (1, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 10.0, TRUE);

-- Ficción (15% active)
INSERT INTO category_promotions (category_id, start_date, end_date, discount_percentage, is_active)
VALUES (2, '2026-02-01 00:00:00', '2026-12-31 23:59:59', 15.0, TRUE);

-- Ciencia ficción (no active promotion)
INSERT INTO category_promotions (category_id, start_date, end_date, discount_percentage, is_active)
VALUES (3, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 5.0, FALSE);

-- Desarrollo personal (20% active)
INSERT INTO category_promotions (category_id, start_date, end_date, discount_percentage, is_active)
VALUES (4, '2026-03-01 00:00:00', '2026-12-31 23:59:59', 20.0, TRUE);