CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` integer NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `avatar` varchar(255),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `roles` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM ('super_admin', 'admin', 'guest')
);

CREATE TABLE `contacts` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255),
  `message` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- POR EL DEFAULT DE date_end RESERVATIONS
SET GLOBAL sql_mode = 'NO_ENGINE_SUBSTITUTION';
SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION';

CREATE TABLE `reservations` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `reservation_number` integer NOT NULL,
  `car_id` integer NOT NULL,
  `date_start` TIMESTAMP NOT NULL,
  `date_end` TIMESTAMP NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255),
  `observation` varchar(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `cars` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `main_features_id` integer NOT NULL,
  `other_features` JSON NULL,
  `vehicle_type_id` integer NOT NULL,
  `updated_by` integer NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `main_features` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `persons` integer NOT NULL,
  `doors` integer NOT NULL,
  `luggage` integer NOT NULL,
  `air_conditioning` bool NOT NULL,
  `gearbox` ENUM ('automatic', 'manual') NOT NULL,
  `updated_by` integer NOT NULL
);


CREATE TABLE `vehicles_type` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM ('particular', 'corporativo', 'todos') NOT NULL
);

ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `main_features` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `cars` ADD FOREIGN KEY (`main_features_id`) REFERENCES `main_features` (`id`);

ALTER TABLE `cars` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `reservations` ADD FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`);

ALTER TABLE `cars` ADD FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicles_type` (`id`);


-- ROLES
insert into roles (type) VALUE ('super_admin');
insert into roles (type) VALUE ('admin');
insert into roles (type) VALUE ('guest');

-- VEHICLE TYPES
INSERT into vehicles_type (type) VALUES ('particular');
INSERT into vehicles_type (type) VALUES ('corporativo');


-- USER
insert into users (username, password, role_id, email, first_name, last_name, avatar) VALUES ('admin', 'admin', 1, 'admin@example.com', 'Alan', 'Bersia', '');


-- MAIN FEATURES
insert into main_features (persons, doors, luggage, air_conditioning, gearbox, updated_by) VALUES (5, 5, 3, true, 'manual', 1);


-- CREO CAR
insert into cars (name, image, price_per_day, main_features_id, vehicle_type_id, updated_by) VALUES ('POLO TRACK', 'ejemplo', 3000.00, 1, 1, 1);


-- CREO RESERVATION
insert into reservations (reservation_number, car_id, date_start, date_end, total_price, `name`, email, phone, observation) VALUES (1, 1, '2024-06-08 10:30:00', '2024-07-08 10:30:00', 100000, 'Usuario', 'usuario@ejemplo.com', '3462510002', 'Lo necesito urgente');

-- FUNCIONES
CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerAutoConCaracteristicas`(
    IN p_ID INT
)
BEGIN
    IF p_ID IS NULL THEN
        SELECT a.*, b.*, c.*, d.*
		FROM cars a
        INNER JOIN main_features b ON a.main_features_id = b.id
        INNER JOIN vehicles_type c on a.vehicle_type_id = c.id
        INNER JOIN users d on a.updated_by = d.id;
    ELSE
	 	SELECT a.*, b.*, c.*, d.*
		FROM cars a
        INNER JOIN main_features b ON a.main_features_id = b.id
        INNER JOIN vehicles_type c on a.vehicle_type_id = c.id
        INNER JOIN users d on a.updated_by = d.id
        WHERE a.id = p_ID;
    END IF;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerReservasConAuto`(
    IN p_ID INT
)
BEGIN
    IF p_ID IS NULL THEN
        SELECT a.*,
        b.id as car_id,
        b.name as car_name,
        b.image as car_image,
        b.price_per_day as car_price_per_day,
        b.main_features_id as car_main_features_id,        
		c.type as car_type
		FROM reservations a
        INNER JOIN cars b ON a.car_id = b.id
        INNER JOIN vehicles_type c on b.vehicle_type_id = c.id;
    ELSE
    	SELECT a.*,
        b.id as car_id,
        b.name as car_name,
        b.image as car_image,
        b.price_per_day as car_price_per_day,
        b.main_features_id as car_main_features_id,        
		c.type as car_type
		FROM reservations a
        INNER JOIN cars b ON a.car_id = b.id
        INNER JOIN vehicles_type c on b.vehicle_type_id = c.id
        WHERE a.id = p_ID;
    END IF;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerUsuariosConRol`(
    IN p_ID INT
)
BEGIN
    IF p_ID IS NULL THEN
        SELECT a.*, b.type
        FROM users a
        INNER JOIN roles b ON a.role_id = b.id;
    ELSE
        SELECT a.*, b.type
        FROM users a
        INNER JOIN roles b ON a.role_id = b.id
        WHERE a.id = p_ID;
    END IF;
END;

CALL ObtenerUsuariosConRol(null);
CALL ObtenerReservasConAuto(null);
CALL ObtenerAutoConCaracteristicas(null);
