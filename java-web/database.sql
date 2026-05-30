-- ============================================================
--  DATABASE: bindata
--  Generated from JPA entities (Spring Boot 3 / Hibernate)
--  Target: MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS bindata
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bindata;

-- ============================================================
-- 1. brand
-- ============================================================
CREATE TABLE brand (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. category  (self-referencing hierarchy)
-- ============================================================
CREATE TABLE category (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    name      VARCHAR(255),
    parent_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES category (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 3. roles
-- ============================================================
CREATE TABLE roles (
    id          INT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50),
    description VARCHAR(255),
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. user
-- ============================================================
CREATE TABLE `user` (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    user_name    VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    full_name    VARCHAR(255),
    phone_number VARCHAR(255),
    email        VARCHAR(255),
    gender       VARCHAR(20),
    status       VARCHAR(20)  DEFAULT 'ACTIVE',
    created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. user_roles  (ManyToMany join table)
-- ============================================================
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id INT    NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES `user` (id),
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 6. address
-- ============================================================
CREATE TABLE address (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    recipient    VARCHAR(255),
    phone        VARCHAR(255),
    ward         VARCHAR(255),
    city         VARCHAR(255),
    line1        VARCHAR(255),
    line2        VARCHAR(255),
    district     VARCHAR(255),
    address_type VARCHAR(20),
    is_default   TINYINT(1)   DEFAULT 0,
    userid       BIGINT,
    created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_address_user FOREIGN KEY (userid) REFERENCES `user` (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 7. product
-- ============================================================
CREATE TABLE product (
    id             BIGINT         NOT NULL AUTO_INCREMENT,
    name           VARCHAR(255),
    price          DECIMAL(10, 2),
    color          VARCHAR(255),
    storage        VARCHAR(255),
    description    TEXT,
    is_active      TINYINT(1)     DEFAULT 1,
    warranty_period INT,
    category_id    BIGINT,
    brand_id       BIGINT,
    created_at     DATETIME       DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category (id),
    CONSTRAINT fk_product_brand    FOREIGN KEY (brand_id)    REFERENCES brand (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 8. product_image
-- ============================================================
CREATE TABLE product_image (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    product_id BIGINT,
    image_url  VARCHAR(500),
    is_primary TINYINT(1)   DEFAULT 0,
    sort_order INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_pimage_product FOREIGN KEY (product_id) REFERENCES product (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 9. product_specs
-- ============================================================
CREATE TABLE product_specs (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    product_id BIGINT,
    name       VARCHAR(255),
    value      VARCHAR(500),
    PRIMARY KEY (id),
    CONSTRAINT fk_pspecs_product FOREIGN KEY (product_id) REFERENCES product (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 10. inventory
-- ============================================================
CREATE TABLE inventory (
    id           BIGINT   NOT NULL AUTO_INCREMENT,
    product_id   BIGINT   UNIQUE,
    quantity     BIGINT,
    safety_stock INT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES product (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 11. cart
-- ============================================================
CREATE TABLE cart (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       UNIQUE,
    status     VARCHAR(50),
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES `user` (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 12. cart_item
-- ============================================================
CREATE TABLE cart_item (
    id                   BIGINT         NOT NULL AUTO_INCREMENT,
    cart_id              BIGINT,
    product_id           BIGINT,
    quantity             BIGINT,
    selected             TINYINT(1)     DEFAULT 0,
    unit_price_snapshot  DECIMAL(10, 2),
    created_at           DATETIME       DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cartitem_cart    FOREIGN KEY (cart_id)    REFERENCES cart (id),
    CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) REFERENCES product (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 13. orders
-- ============================================================
CREATE TABLE orders (
    id            BIGINT         NOT NULL AUTO_INCREMENT,
    code          VARCHAR(255)   NOT NULL UNIQUE,
    note          VARCHAR(500),
    user_id       BIGINT,
    full_name     VARCHAR(255),
    phone_number  VARCHAR(255),
    ship_line1    VARCHAR(255),
    ship_line2    VARCHAR(255),
    ship_city     VARCHAR(255),
    ship_district VARCHAR(255),
    ship_ward     VARCHAR(255),
    order_date    DATETIME       DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(50),
    total_price   DECIMAL(10, 2),
    PRIMARY KEY (id),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES `user` (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 14. order_item
-- ============================================================
CREATE TABLE order_item (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    order_id         BIGINT,
    product_id       BIGINT,
    price            DECIMAL(10, 2),
    quantity         BIGINT,
    imei             VARCHAR(255),
    warranty_end_date DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_orderitem_order   FOREIGN KEY (order_id)   REFERENCES orders (id),
    CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES product (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 15. vouchers
-- ============================================================
CREATE TABLE vouchers (
    id              BIGINT         NOT NULL AUTO_INCREMENT,
    code            VARCHAR(255)   UNIQUE,
    discount_amount DECIMAL(19, 2),
    quantity        INT,
    expiration_date DATETIME,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 16. review
-- ============================================================
CREATE TABLE review (
    id          BIGINT     NOT NULL AUTO_INCREMENT,
    product_id  BIGINT,
    rating      BIGINT,
    content     TEXT,
    is_approved TINYINT(1) DEFAULT 0,
    created_at  DATETIME   DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES product (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INITIAL DATA
-- ============================================================

-- Roles
INSERT INTO roles (name, description) VALUES
    ('OWNER', 'System owner with full access'),
    ('ADMIN', 'Administrator with management access');

-- Default admin user
-- Password: admin123  (BCrypt hash — replace with actual hash from app)
INSERT INTO `user` (user_name, password, full_name, email, status) VALUES
    ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrator', 'admin@example.com', 'ACTIVE');

-- Assign OWNER role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM `user` u, roles r
WHERE u.user_name = 'admin' AND r.name = 'OWNER';
