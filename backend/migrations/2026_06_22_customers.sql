ALTER TABLE customers
    ADD COLUMN id_number VARCHAR(10) NULL AFTER name,
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
    ADD UNIQUE KEY unique_customer_id_number (id_number);

ALTER TABLE purchases
    ADD COLUMN customer_id INT NULL AFTER user_id,
    ADD KEY idx_purchases_customer_id (customer_id),
    ADD CONSTRAINT fk_purchases_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON UPDATE CASCADE ON DELETE SET NULL;

INSERT INTO customers (name, id_number, email, phone, address) VALUES
('Andrea Carolina Zambrano Mena', '2201456783', 'andrea.zambrano@example.com', '0991842637', 'Av. Alejandro Labaka y Rio Coca, barrio Central, El Coca'),
('Luis Fernando Grefa Alvarado', '2202389413', 'luis.grefa@example.com', '0985274163', 'Calle Napo y Quito, barrio 30 de Abril, El Coca'),
('Maria Jose Shiguango Cerda', '2203527060', 'maria.shiguango@example.com', '0963184752', 'Av. 9 de Octubre y Eugenio Espejo, barrio Union Imbaburena, El Coca'),
('Carlos Andres Villacis Paredes', '2204673152', 'carlos.villacis@example.com', '0976421835', 'Calle Amazonas y Vicente Rocafuerte, barrio Paraiso Amazonico, El Coca'),
('Daniela Estefania Tanguila Gualinga', '2205718246', 'daniela.tanguila@example.com', '0957362148', 'Av. Camilo de Torrano y Rio Payamino, barrio Flor de Oriente, El Coca'),
('Jorge Eduardo Vargas Moreira', '2206842391', 'jorge.vargas@example.com', '0996257314', 'Calle Cuenca y Guayaquil, barrio Los Rosales, El Coca'),
('Paola Fernanda Aguinda Mamallacta', '2207931466', 'paola.aguinda@example.com', '0981735624', 'Av. Padre Miguel Gamboa y Rio Tiputini, barrio Con Hogar, El Coca');
