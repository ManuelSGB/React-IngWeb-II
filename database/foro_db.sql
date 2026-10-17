-- Crear la base de datos (opcional)
CREATE DATABASE IF NOT EXISTS `foro_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `foro_db`;

-- --------------------------------------------------------
-- Estructura de la tabla `users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL, -- Recomendado guardar contraseñas encriptadas
  `rol` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Estructura de la tabla `foro`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `foro` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL, -- Clave foránea que relaciona la publicación con el usuario
  `categoria` ENUM('HOGAR', 'ENERGIA SOLAR', 'EQUIPAMIENTO', 'RETOS') NOT NULL,
  `titulo` VARCHAR(150) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_foro_users_idx` (`user_id`),
  CONSTRAINT `fk_foro_users` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Inserción de usuario administrador por defecto
-- --------------------------------------------------------

INSERT INTO `users` (`nombre`, `apellido`, `correo`, `contrasena`, `rol`, `estado`) 
VALUES ('Admin', 'Sistema', 'admin@gmail.com', '$2b$10$hBfYljZg80UBvH0p.mUrlO1wL0F9RVuZduxXaqoqmFW4EW1rA309m', 'admin', 'activo');