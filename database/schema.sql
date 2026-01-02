-- GIGMATE COMPLETE DATABASE SCHEMA
-- Generated for MySQL/InnoDB

-- 1. CORE USER MANAGEMENT
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(50) UNIQUE NOT NULL COMMENT 'Firebase UID',
    `phone_number` VARCHAR(15) UNIQUE NOT NULL,
    `country_code` VARCHAR(5) DEFAULT '+91',
    `email` VARCHAR(255) UNIQUE,
    `full_name` VARCHAR(100),
    `profile_picture_url` VARCHAR(500),
    `date_of_birth` DATE,
    `gender` ENUM('male', 'female', 'other') DEFAULT 'other',
    `preferred_language` ENUM('en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa') DEFAULT 'en',
    `vehicle_type` ENUM('bike', 'scooter', 'car', 'cycle', 'walk', 'other') DEFAULT 'bike',
    `vehicle_number` VARCHAR(20),
    `vehicle_brand` VARCHAR(50),
    `vehicle_model` VARCHAR(50),
    `vehicle_year` YEAR,
    `driving_license_number` VARCHAR(50),
    `aadhaar_number` VARCHAR(12),
    `pan_number` VARCHAR(10),
    `city` VARCHAR(50),
    `state` VARCHAR(50),
    `pincode` VARCHAR(10),
    `address` TEXT,
    `latitude` DECIMAL(10, 8),
    `longitude` DECIMAL(11, 8),
    `is_verified` BOOLEAN DEFAULT FALSE,
    `verification_status` ENUM('pending', 'verified', 'rejected', 'under_review') DEFAULT 'pending',
    `account_status` ENUM('active', 'suspended', 'deactivated', 'pending_kyc') DEFAULT 'pending_kyc',
    `referral_code` VARCHAR(20) UNIQUE,
    `referred_by` BIGINT UNSIGNED,
    `total_referrals` INT DEFAULT 0,
    `gig_score` DECIMAL(5,2) DEFAULT 50.00 COMMENT 'Credit score for gig workers',
    `total_earnings` DECIMAL(12,2) DEFAULT 0.00,
    `total_expenses` DECIMAL(12,2) DEFAULT 0.00,
    `net_savings` DECIMAL(12,2) DEFAULT 0.00,
    `average_daily_earnings` DECIMAL(10,2) DEFAULT 0.00,
    `average_weekly_hours` DECIMAL(4,1) DEFAULT 0.0,
    `premium_member` BOOLEAN DEFAULT FALSE,
    `premium_expiry_date` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `last_active_at` DATETIME,
    PRIMARY KEY (`id`),
    INDEX `idx_phone` (`phone_number`),
    INDEX `idx_city` (`city`),
    INDEX `idx_status` (`account_status`),
    INDEX `idx_gig_score` (`gig_score`),
    INDEX `idx_premium` (`premium_member`, `premium_expiry_date`),
    FOREIGN KEY (`referred_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. GIG PLATFORMS & WORK PROFILES
CREATE TABLE `gig_platforms` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `platform_name` VARCHAR(50) NOT NULL,
    `platform_type` ENUM('food_delivery', 'ride_hailing', 'courier', 'freelance', 'home_services', 'retail', 'other') NOT NULL,
    `logo_url` VARCHAR(500),
    `website_url` VARCHAR(500),
    `api_documentation_url` VARCHAR(500),
    `auth_type` ENUM('oauth', 'api_key', 'screen_scraping', 'manual') NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `commission_rate` DECIMAL(5,2) COMMENT 'Platform commission %',
    `min_payout_amount` DECIMAL(10,2),
    `payout_frequency` ENUM('daily', 'weekly', 'bi_weekly', 'monthly'),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_platform_name` (`platform_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_platform_profiles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `platform_id` INT UNSIGNED NOT NULL,
    `platform_user_id` VARCHAR(100) COMMENT 'User ID on the platform',
    `platform_username` VARCHAR(100),
    `platform_email` VARCHAR(255),
    `platform_phone` VARCHAR(15),
    `api_key` VARCHAR(500) COMMENT 'Encrypted API key',
    `refresh_token` VARCHAR(500) COMMENT 'Encrypted refresh token',
    `access_token` VARCHAR(500) COMMENT 'Encrypted access token',
    `token_expiry` DATETIME,
    `is_connected` BOOLEAN DEFAULT FALSE,
    `connection_method` ENUM('api', 'screen_scrape', 'manual', 'sms_parsing') NOT NULL,
    `last_sync_at` DATETIME,
    `sync_status` ENUM('success', 'failed', 'pending', 'in_progress') DEFAULT 'pending',
    `sync_error_message` TEXT,
    `total_earnings_from_platform` DECIMAL(12,2) DEFAULT 0.00,
    `total_trips_completed` INT DEFAULT 0,
    `platform_rating` DECIMAL(3,2) DEFAULT 0.00,
    `is_primary_platform` BOOLEAN DEFAULT FALSE,
    `working_hours_per_week` INT DEFAULT 0,
    `average_daily_trips` INT DEFAULT 0,
    `preferred_working_hours` JSON COMMENT '{"morning": true, "afternoon": true, "evening": true, "night": true}',
    `preferred_zones` JSON COMMENT 'Array of preferred area IDs',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_platform` (`user_id`, `platform_id`),
    INDEX `idx_platform_user` (`platform_id`, `platform_user_id`),
    INDEX `idx_sync_status` (`sync_status`, `last_sync_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`platform_id`) REFERENCES `gig_platforms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. EARNINGS & TRANSACTIONS
CREATE TABLE `earning_categories` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(50) NOT NULL,
    `category_type` ENUM('delivery', 'ride', 'service', 'incentive', 'bonus', 'tip', 'other') NOT NULL,
    `icon_name` VARCHAR(50),
    `color_code` VARCHAR(7) DEFAULT '#3498db',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `earnings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `platform_profile_id` BIGINT UNSIGNED,
    `earning_category_id` INT UNSIGNED NOT NULL,
    `transaction_id` VARCHAR(100) UNIQUE COMMENT 'Platform transaction ID',
    `trip_id` VARCHAR(100) COMMENT 'Trip/Order ID from platform',
    `amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(3) DEFAULT 'INR',
    `base_fare` DECIMAL(10,2),
    `distance_fare` DECIMAL(10,2),
    `time_fare` DECIMAL(10,2),
    `incentive` DECIMAL(10,2) DEFAULT 0.00,
    `tip` DECIMAL(10,2) DEFAULT 0.00,
    `promotion_bonus` DECIMAL(10,2) DEFAULT 0.00,
    `platform_commission` DECIMAL(10,2) DEFAULT 0.00,
    `tax_deducted` DECIMAL(10,2) DEFAULT 0.00,
    `net_amount` DECIMAL(10,2) GENERATED ALWAYS AS (`amount` - `platform_commission` - `tax_deducted`) STORED,
    `distance_km` DECIMAL(5,2),
    `duration_minutes` INT,
    `start_location` VARCHAR(255),
    `end_location` VARCHAR(255),
    `start_latitude` DECIMAL(10, 8),
    `start_longitude` DECIMAL(11, 8),
    `end_latitude` DECIMAL(10, 8),
    `end_longitude` DECIMAL(11, 8),
    `customer_rating` DECIMAL(3,2),
    `notes` TEXT,
    `payment_method` ENUM('cash', 'online', 'wallet', 'card', 'upi') DEFAULT 'online',
    `payment_status` ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    `transaction_date` DATETIME NOT NULL,
    `credited_date` DATETIME COMMENT 'When money actually hit account',
    `sync_method` ENUM('api', 'screen_scrape', 'manual', 'sms', 'email') NOT NULL,
    `is_verified` BOOLEAN DEFAULT FALSE,
    `verification_source` VARCHAR(50),
    `receipt_image_url` VARCHAR(500),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_date` (`user_id`, `transaction_date`),
    INDEX `idx_platform_transaction` (`platform_profile_id`, `transaction_date`),
    INDEX `idx_payment_status` (`payment_status`),
    INDEX `idx_trip_id` (`trip_id`),
    INDEX `idx_transaction_id` (`transaction_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`platform_profile_id`) REFERENCES `user_platform_profiles`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`earning_category_id`) REFERENCES `earning_categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `daily_earnings_summary` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `summary_date` DATE NOT NULL,
    `total_earnings` DECIMAL(12,2) DEFAULT 0.00,
    `total_trips` INT DEFAULT 0,
    `total_distance_km` DECIMAL(8,2) DEFAULT 0.00,
    `total_duration_minutes` INT DEFAULT 0,
    `total_incentives` DECIMAL(10,2) DEFAULT 0.00,
    `total_tips` DECIMAL(10,2) DEFAULT 0.00,
    `average_rating` DECIMAL(3,2) DEFAULT 0.00,
    `peak_hour_earnings` DECIMAL(10,2) DEFAULT 0.00,
    `off_peak_earnings` DECIMAL(10,2) DEFAULT 0.00,
    `best_performing_hour` TINYINT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_date` (`user_id`, `summary_date`),
    INDEX `idx_date_summary` (`summary_date`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. EXPENSE MANAGEMENT
CREATE TABLE `expense_categories` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(50) NOT NULL,
    `category_type` ENUM('fuel', 'maintenance', 'food', 'mobile', 'insurance', 'loan_emi', 'rent', 'other') NOT NULL,
    `icon_name` VARCHAR(50),
    `color_code` VARCHAR(7),
    `is_tax_deductible` BOOLEAN DEFAULT FALSE,
    `tax_deduction_percent` DECIMAL(5,2) DEFAULT 0.00,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `expenses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `expense_category_id` INT UNSIGNED NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(3) DEFAULT 'INR',
    `description` VARCHAR(255),
    `vendor_name` VARCHAR(100),
    `location` VARCHAR(255),
    `latitude` DECIMAL(10, 8),
    `longitude` DECIMAL(11, 8),
    `payment_method` ENUM('cash', 'upi', 'card', 'wallet', 'credit') DEFAULT 'cash',
    `recurring` BOOLEAN DEFAULT FALSE,
    `recurring_frequency` ENUM('daily', 'weekly', 'monthly', 'yearly'),
    `next_due_date` DATE,
    `receipt_image_url` VARCHAR(500),
    `ocr_extracted_data` JSON COMMENT 'Data extracted from receipt via OCR',
    `is_verified` BOOLEAN DEFAULT FALSE,
    `expense_date` DATE NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_date` (`user_id`, `expense_date`),
    INDEX `idx_category` (`expense_category_id`),
    INDEX `idx_recurring` (`recurring`, `next_due_date`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `monthly_expense_summary` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `year_month` CHAR(7) NOT NULL COMMENT 'Format: YYYY-MM',
    `total_expenses` DECIMAL(12,2) DEFAULT 0.00,
    `fuel_expenses` DECIMAL(10,2) DEFAULT 0.00,
    `maintenance_expenses` DECIMAL(10,2) DEFAULT 0.00,
    `food_expenses` DECIMAL(10,2) DEFAULT 0.00,
    `mobile_expenses` DECIMAL(10,2) DEFAULT 0.00,
    `insurance_expenses` DECIMAL(10,2) DEFAULT 0.00,
    `loan_emi_expenses` DECIMAL(10,2) DEFAULT 0.00,
    `other_expenses` DECIMAL(10,2) DEFAULT 0.00,
    `average_daily_expense` DECIMAL(10,2) DEFAULT 0.00,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_month` (`user_id`, `year_month`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. DEMAND PREDICTION & ZONE MANAGEMENT
CREATE TABLE `cities` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `city_name` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `country` VARCHAR(50) DEFAULT 'India',
    `latitude` DECIMAL(10, 8),
    `longitude` DECIMAL(11, 8),
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_city_state` (`city_name`, `state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `zones` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `city_id` INT UNSIGNED NOT NULL,
    `zone_name` VARCHAR(100) NOT NULL,
    `zone_type` ENUM('commercial', 'residential', 'mixed', 'industrial', 'entertainment') DEFAULT 'mixed',
    `polygon_coordinates` JSON COMMENT 'GeoJSON polygon for zone boundaries',
    `center_latitude` DECIMAL(10, 8),
    `center_longitude` DECIMAL(11, 8),
    `radius_km` DECIMAL(5,2),
    `is_high_demand_area` BOOLEAN DEFAULT FALSE,
    `average_order_value` DECIMAL(10,2),
    `peak_hours` JSON COMMENT '{"morning": ["07:00", "10:00"], "lunch": ["12:00", "14:00"], ...}',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_city_zone` (`city_id`, `zone_name`),
    SPATIAL INDEX `idx_zone_location` (`center_latitude`, `center_longitude`),
    FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `demand_predictions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `zone_id` BIGINT UNSIGNED NOT NULL,
    `platform_id` INT UNSIGNED NOT NULL,
    `prediction_for` DATETIME NOT NULL COMMENT 'Time for which prediction is made',
    `prediction_generated_at` DATETIME NOT NULL,
    `demand_score` DECIMAL(5,2) NOT NULL COMMENT '0-100 score',
    `demand_level` ENUM('very_low', 'low', 'medium', 'high', 'very_high') NOT NULL,
    `estimated_orders_per_hour` INT,
    `estimated_earnings_per_hour` DECIMAL(10,2),
    `surge_multiplier` DECIMAL(3,2) DEFAULT 1.00,
    `weather_condition` VARCHAR(50),
    `temperature_celsius` DECIMAL(4,1),
    `is_holiday` BOOLEAN DEFAULT FALSE,
    `event_nearby` BOOLEAN DEFAULT FALSE,
    `traffic_level` ENUM('low', 'medium', 'high', 'very_high') DEFAULT 'medium',
    `confidence_score` DECIMAL(5,2) COMMENT 'Model confidence 0-100',
    `prediction_features` JSON COMMENT 'Features used for prediction',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_zone_platform_time` (`zone_id`, `platform_id`, `prediction_for`),
    INDEX `idx_prediction_time` (`prediction_for`),
    INDEX `idx_demand_score` (`demand_score`),
    FOREIGN KEY (`zone_id`) REFERENCES `zones`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`platform_id`) REFERENCES `gig_platforms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `historical_demand_data` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `zone_id` BIGINT UNSIGNED NOT NULL,
    `platform_id` INT UNSIGNED NOT NULL,
    `recorded_at` DATETIME NOT NULL,
    `actual_demand_score` DECIMAL(5,2),
    `orders_count` INT DEFAULT 0,
    `average_wait_time_minutes` INT,
    `surge_multiplier` DECIMAL(3,2) DEFAULT 1.00,
    `weather_condition` VARCHAR(50),
    `temperature_celsius` DECIMAL(4,1),
    `day_of_week` TINYINT COMMENT '0=Sunday, 1=Monday, ...',
    `hour_of_day` TINYINT COMMENT '0-23',
    `is_holiday` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_zone_time` (`zone_id`, `recorded_at`),
    INDEX `idx_platform_time` (`platform_id`, `recorded_at`),
    FOREIGN KEY (`zone_id`) REFERENCES `zones`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`platform_id`) REFERENCES `gig_platforms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. FINANCIAL PRODUCTS (LOANS, INSURANCE, SAVINGS)
CREATE TABLE `financial_partners` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `partner_name` VARCHAR(100) NOT NULL,
    `partner_type` ENUM('nbfc', 'bank', 'insurance', 'fintech', 'mutual_fund') NOT NULL,
    `logo_url` VARCHAR(500),
    `website_url` VARCHAR(500),
    `api_endpoint` VARCHAR(500),
    `api_key` VARCHAR(500),
    `api_secret` VARCHAR(500),
    `is_active` BOOLEAN DEFAULT TRUE,
    `commission_rate` DECIMAL(5,2),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `loan_products` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `partner_id` INT UNSIGNED NOT NULL,
    `product_name` VARCHAR(100) NOT NULL,
    `product_type` ENUM('emergency', 'vehicle', 'education', 'medical', 'personal') NOT NULL,
    `min_amount` DECIMAL(12,2) NOT NULL,
    `max_amount` DECIMAL(12,2) NOT NULL,
    `min_tenure_months` INT NOT NULL,
    `max_tenure_months` INT NOT NULL,
    `interest_rate_min` DECIMAL(5,2) NOT NULL,
    `interest_rate_max` DECIMAL(5,2) NOT NULL,
    `processing_fee_percent` DECIMAL(5,2) DEFAULT 0.00,
    `min_gig_score` DECIMAL(5,2) DEFAULT 0.00,
    `min_monthly_income` DECIMAL(10,2),
    `min_work_experience_months` INT,
    `documents_required` JSON COMMENT 'List of required documents',
    `features` JSON COMMENT 'Product features',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`partner_id`) REFERENCES `financial_partners`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_loans` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `loan_product_id` INT UNSIGNED NOT NULL,
    `loan_application_id` VARCHAR(50) UNIQUE COMMENT 'Partner loan application ID',
    `loan_amount` DECIMAL(12,2) NOT NULL,
    `approved_amount` DECIMAL(12,2),
    `interest_rate` DECIMAL(5,2),
    `tenure_months` INT NOT NULL,
    `processing_fee` DECIMAL(10,2),
    `disbursement_date` DATE,
    `emi_amount` DECIMAL(10,2),
    `total_payable` DECIMAL(12,2) GENERATED ALWAYS AS (`loan_amount` + (`loan_amount` * `interest_rate` * `tenure_months` / 1200)) STORED,
    `loan_purpose` VARCHAR(255),
    `status` ENUM('draft', 'applied', 'under_review', 'approved', 'rejected', 'disbursed', 'active', 'closed', 'defaulted') DEFAULT 'draft',
    `rejection_reason` TEXT,
    `next_emi_date` DATE,
    `emi_day` TINYINT COMMENT 'Day of month for EMI',
    `total_emis_paid` INT DEFAULT 0,
    `total_emis_due` INT DEFAULT 0,
    `amount_paid` DECIMAL(12,2) DEFAULT 0.00,
    `amount_due` DECIMAL(12,2) GENERATED ALWAYS AS (`total_payable` - `amount_paid`) STORED,
    `last_payment_date` DATE,
    `credit_score_impact` JSON COMMENT 'Impact on gig score',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_loan_status` (`user_id`, `status`),
    INDEX `idx_application` (`loan_application_id`),
    INDEX `idx_next_emi` (`next_emi_date`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`loan_product_id`) REFERENCES `loan_products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `loan_emis` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_loan_id` BIGINT UNSIGNED NOT NULL,
    `emi_number` INT NOT NULL,
    `due_date` DATE NOT NULL,
    `emi_amount` DECIMAL(10,2) NOT NULL,
    `principal_amount` DECIMAL(10,2),
    `interest_amount` DECIMAL(10,2),
    `status` ENUM('pending', 'paid', 'overdue', 'waived', 'partially_paid') DEFAULT 'pending',
    `payment_date` DATE,
    `payment_method` VARCHAR(50),
    `transaction_id` VARCHAR(100),
    `late_fee` DECIMAL(10,2) DEFAULT 0.00,
    `paid_amount` DECIMAL(10,2) DEFAULT 0.00,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_loan_emi` (`user_loan_id`, `emi_number`),
    INDEX `idx_due_date` (`due_date`, `status`),
    FOREIGN KEY (`user_loan_id`) REFERENCES `user_loans`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `savings_goals` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `goal_name` VARCHAR(100) NOT NULL,
    `goal_type` ENUM('emergency', 'vehicle', 'education', 'home', 'vacation', 'other') NOT NULL,
    `target_amount` DECIMAL(12,2) NOT NULL,
    `current_amount` DECIMAL(12,2) DEFAULT 0.00,
    `target_date` DATE,
    `auto_save_enabled` BOOLEAN DEFAULT FALSE,
    `auto_save_amount` DECIMAL(10,2),
    `auto_save_frequency` ENUM('daily', 'weekly', 'monthly', 'per_earning') DEFAULT 'monthly',
    `auto_save_percent` DECIMAL(5,2) COMMENT 'Percentage of each earning to save',
    `status` ENUM('active', 'paused', 'completed', 'cancelled') DEFAULT 'active',
    `completion_percent` DECIMAL(5,2) GENERATED ALWAYS AS ((`current_amount` / `target_amount`) * 100) STORED,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_goals` (`user_id`, `status`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `savings_transactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `savings_goal_id` BIGINT UNSIGNED,
    `transaction_type` ENUM('deposit', 'withdrawal', 'interest', 'bonus') NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `balance_before` DECIMAL(12,2),
    `balance_after` DECIMAL(12,2),
    `description` VARCHAR(255),
    `reference_id` VARCHAR(100) COMMENT 'External transaction ID',
    `transaction_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_transactions` (`user_id`, `transaction_date`),
    INDEX `idx_goal_transactions` (`savings_goal_id`, `transaction_date`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`savings_goal_id`) REFERENCES `savings_goals`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TAX CALCULATION & COMPLIANCE
CREATE TABLE `tax_slabs` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `financial_year` VARCHAR(9) NOT NULL COMMENT 'Format: 2024-2025',
    `regime` ENUM('old', 'new') NOT NULL,
    `min_income` DECIMAL(12,2) NOT NULL,
    `max_income` DECIMAL(12,2) COMMENT 'NULL for last slab',
    `tax_percent` DECIMAL(5,2) NOT NULL,
    `cess_percent` DECIMAL(5,2) DEFAULT 0.00,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_year_regime_slab` (`financial_year`, `regime`, `min_income`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tax_deductions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `deduction_name` VARCHAR(100) NOT NULL,
    `section_code` VARCHAR(20) COMMENT 'Income Tax Act section',
    `deduction_type` ENUM('80C', '80D', '80E', '80G', 'other') NOT NULL,
    `max_amount` DECIMAL(12,2),
    `description` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_tax_profiles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `financial_year` VARCHAR(9) NOT NULL,
    `regime` ENUM('old', 'new') DEFAULT 'new',
    `total_income` DECIMAL(12,2) DEFAULT 0.00,
    `total_deductions` DECIMAL(12,2) DEFAULT 0.00,
    `taxable_income` DECIMAL(12,2) DEFAULT 0.00,
    `tax_liability` DECIMAL(12,2) DEFAULT 0.00,
    `tax_deducted_at_source` DECIMAL(12,2) DEFAULT 0.00,
    `tax_paid_advance` DECIMAL(12,2) DEFAULT 0.00,
    `tax_paid_self_assessment` DECIMAL(12,2) DEFAULT 0.00,
    `tax_refund` DECIMAL(12,2) DEFAULT 0.00,
    `tax_payable` DECIMAL(12,2) DEFAULT 0.00,
    `calculation_details` JSON COMMENT 'Detailed breakdown',
    `itr_filed` BOOLEAN DEFAULT FALSE,
    `itr_filing_date` DATE,
    `acknowledgement_number` VARCHAR(50),
    `status` ENUM('draft', 'calculated', 'filed', 'verified', 'paid') DEFAULT 'draft',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_year` (`user_id`, `financial_year`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_tax_deductions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_tax_profile_id` BIGINT UNSIGNED NOT NULL,
    `deduction_id` INT UNSIGNED NOT NULL,
    `amount_claimed` DECIMAL(12,2) NOT NULL,
    `proof_url` VARCHAR(500),
    `verified` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_profile_deduction` (`user_tax_profile_id`, `deduction_id`),
    FOREIGN KEY (`user_tax_profile_id`) REFERENCES `user_tax_profiles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`deduction_id`) REFERENCES `tax_deductions`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. LEARNING & UPSKILLING
CREATE TABLE `courses` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_title` VARCHAR(200) NOT NULL,
    `course_subtitle` VARCHAR(500),
    `description` TEXT,
    `instructor_name` VARCHAR(100),
    `instructor_bio` TEXT,
    `category` ENUM('language', 'driving', 'digital_literacy', 'financial_literacy', 'customer_service', 'safety', 'entrepreneurship') NOT NULL,
    `level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    `duration_hours` INT,
    `video_url` VARCHAR(500),
    `thumbnail_url` VARCHAR(500),
    `price` DECIMAL(10,2) DEFAULT 0.00,
    `discount_percent` DECIMAL(5,2) DEFAULT 0.00,
    `final_price` DECIMAL(10,2) GENERATED ALWAYS AS (`price` * (1 - `discount_percent` / 100)) STORED,
    `language` VARCHAR(50) DEFAULT 'Hindi',
    `subtitles_available` BOOLEAN DEFAULT TRUE,
    `quiz_count` INT DEFAULT 0,
    `average_rating` DECIMAL(3,2) DEFAULT 0.00,
    `total_enrollments` INT DEFAULT 0,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course_modules` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_id` INT UNSIGNED NOT NULL,
    `module_title` VARCHAR(200) NOT NULL,
    `module_order` INT NOT NULL,
    `duration_minutes` INT,
    `video_url` VARCHAR(500),
    `content_text` TEXT,
    `quiz_questions` JSON COMMENT 'Array of quiz questions',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_course_modules` (`course_id`, `module_order`),
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_course_enrollments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `course_id` INT UNSIGNED NOT NULL,
    `enrollment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `completion_date` DATETIME,
    `progress_percent` DECIMAL(5,2) DEFAULT 0.00,
    `current_module_id` INT UNSIGNED,
    `status` ENUM('enrolled', 'in_progress', 'completed', 'dropped') DEFAULT 'enrolled',
    `certificate_url` VARCHAR(500),
    `rating_given` TINYINT COMMENT '1-5 stars',
    `review_text` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_course` (`user_id`, `course_id`),
    INDEX `idx_course_status` (`course_id`, `status`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`current_module_id`) REFERENCES `course_modules`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_learning_progress` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `enrollment_id` BIGINT UNSIGNED NOT NULL,
    `module_id` INT UNSIGNED NOT NULL,
    `started_at` DATETIME,
    `completed_at` DATETIME,
    `time_spent_minutes` INT DEFAULT 0,
    `quiz_score` DECIMAL(5,2),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_enrollment_module` (`enrollment_id`, `module_id`),
    FOREIGN KEY (`enrollment_id`) REFERENCES `user_course_enrollments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`module_id`) REFERENCES `course_modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. NOTIFICATIONS & COMMUNICATIONS
CREATE TABLE `notification_templates` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `template_name` VARCHAR(100) NOT NULL,
    `template_type` ENUM('sms', 'push', 'email', 'in_app') NOT NULL,
    `subject` VARCHAR(200),
    `message_text` TEXT NOT NULL,
    `message_hindi` TEXT,
    `variables` JSON COMMENT 'List of variables like {name}, {amount}',
    `category` ENUM('demand_alert', 'payment', 'reminder', 'promotion', 'system', 'educational') NOT NULL,
    `priority` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `template_id` INT UNSIGNED,
    `notification_type` ENUM('sms', 'push', 'email', 'in_app') NOT NULL,
    `title` VARCHAR(200),
    `message` TEXT NOT NULL,
    `data` JSON COMMENT 'Additional data for deep linking',
    `category` ENUM('demand_alert', 'payment', 'reminder', 'promotion', 'system', 'educational') NOT NULL,
    `priority` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    `status` ENUM('pending', 'sent', 'delivered', 'failed', 'read') DEFAULT 'pending',
    `read_at` DATETIME,
    `sent_at` DATETIME,
    `failure_reason` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_notifications` (`user_id`, `created_at`),
    INDEX `idx_status_type` (`status`, `notification_type`),
    INDEX `idx_category` (`category`, `created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`template_id`) REFERENCES `notification_templates`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_notification_preferences` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `category` ENUM('demand_alert', 'payment', 'reminder', 'promotion', 'system', 'educational') NOT NULL,
    `sms_enabled` BOOLEAN DEFAULT TRUE,
    `push_enabled` BOOLEAN DEFAULT TRUE,
    `email_enabled` BOOLEAN DEFAULT FALSE,
    `in_app_enabled` BOOLEAN DEFAULT TRUE,
    `quiet_hours_start` TIME DEFAULT '22:00:00',
    `quiet_hours_end` TIME DEFAULT '06:00:00',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_category` (`user_id`, `category`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. AUDIT LOGGING & ANALYTICS
CREATE TABLE `audit_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED COMMENT 'NULL for system actions',
    `action_type` VARCHAR(100) NOT NULL,
    `table_name` VARCHAR(100),
    `record_id` VARCHAR(100),
    `old_values` JSON,
    `new_values` JSON,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `device_id` VARCHAR(100),
    `location` VARCHAR(255),
    `success` BOOLEAN DEFAULT TRUE,
    `error_message` TEXT,
    `execution_time_ms` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_actions` (`user_id`, `created_at`),
    INDEX `idx_action_type` (`action_type`, `created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_activity_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `activity_type` VARCHAR(100) NOT NULL,
    `screen_name` VARCHAR(100),
    `action` VARCHAR(100),
    `data` JSON,
    `session_id` VARCHAR(100),
    `device_info` JSON,
    `battery_level` TINYINT,
    `network_type` VARCHAR(20),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_activity` (`user_id`, `created_at`),
    INDEX `idx_activity_type` (`activity_type`, `created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `app_analytics` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `metric_date` DATE NOT NULL,
    `metric_name` VARCHAR(100) NOT NULL,
    `metric_value` DECIMAL(15,2) DEFAULT 0.00,
    `dimension1` VARCHAR(100),
    `dimension2` VARCHAR(100),
    `dimension3` VARCHAR(100),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_metric_date_name` (`metric_date`, `metric_name`, `dimension1`, `dimension2`, `dimension3`),
    INDEX `idx_metric_date` (`metric_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. SUBSCRIPTION & PAYMENTS
CREATE TABLE `subscription_plans` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_name` VARCHAR(100) NOT NULL,
    `plan_code` VARCHAR(50) UNIQUE NOT NULL,
    `description` TEXT,
    `price_monthly` DECIMAL(10,2) NOT NULL,
    `price_yearly` DECIMAL(10,2),
    `discount_percent` DECIMAL(5,2) DEFAULT 0.00,
    `features` JSON COMMENT 'List of features included',
    `max_platforms` INT DEFAULT 3,
    `advanced_analytics` BOOLEAN DEFAULT FALSE,
    `priority_support` BOOLEAN DEFAULT FALSE,
    `loan_eligibility_boost` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Percentage boost to loan eligibility',
    `insurance_discount` DECIMAL(5,2) DEFAULT 0.00,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_subscriptions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `plan_id` INT UNSIGNED NOT NULL,
    `subscription_id` VARCHAR(100) UNIQUE COMMENT 'Payment gateway subscription ID',
    `status` ENUM('active', 'pending', 'cancelled', 'expired', 'past_due') DEFAULT 'pending',
    `current_period_start` DATE,
    `current_period_end` DATE,
    `cancel_at_period_end` BOOLEAN DEFAULT FALSE,
    `cancelled_at` DATETIME,
    `trial_ends_at` DATETIME,
    `payment_method` VARCHAR(50),
    `auto_renew` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_subscription` (`user_id`, `status`),
    INDEX `idx_expiry` (`current_period_end`, `status`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `subscription_payments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_subscription_id` BIGINT UNSIGNED NOT NULL,
    `payment_id` VARCHAR(100) UNIQUE COMMENT 'Payment gateway transaction ID',
    `amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(3) DEFAULT 'INR',
    `payment_method` VARCHAR(50),
    `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    `failure_reason` TEXT,
    `invoice_url` VARCHAR(500),
    `billing_period_start` DATE,
    `billing_period_end` DATE,
    `paid_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_subscription_payments` (`user_subscription_id`, `created_at`),
    INDEX `idx_payment_status` (`status`, `created_at`),
    FOREIGN KEY (`user_subscription_id`) REFERENCES `user_subscriptions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. REFERRAL SYSTEM
CREATE TABLE `referral_campaigns` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `campaign_name` VARCHAR(100) NOT NULL,
    `referrer_reward` DECIMAL(10,2) NOT NULL,
    `referee_reward` DECIMAL(10,2) NOT NULL,
    `reward_type` ENUM('cash', 'credit', 'subscription_days', 'feature_access') DEFAULT 'cash',
    `min_conditions` JSON COMMENT 'Minimum conditions for reward',
    `max_referrals_per_user` INT,
    `total_budget` DECIMAL(12,2),
    `used_budget` DECIMAL(12,2) DEFAULT 0.00,
    `start_date` DATE NOT NULL,
    `end_date` DATE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `referrals` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `referrer_id` BIGINT UNSIGNED NOT NULL,
    `referee_id` BIGINT UNSIGNED NOT NULL,
    `campaign_id` INT UNSIGNED NOT NULL,
    `referral_code` VARCHAR(20),
    `referee_signup_date` DATETIME,
    `referee_first_earning_date` DATETIME,
    `referrer_reward_status` ENUM('pending', 'eligible', 'credited', 'expired') DEFAULT 'pending',
    `referee_reward_status` ENUM('pending', 'eligible', 'credited', 'expired') DEFAULT 'pending',
    `referrer_reward_amount` DECIMAL(10,2),
    `referee_reward_amount` DECIMAL(10,2),
    `referrer_reward_paid_at` DATETIME,
    `referee_reward_paid_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_referee_campaign` (`referee_id`, `campaign_id`),
    INDEX `idx_referrer_campaign` (`referrer_id`, `campaign_id`),
    INDEX `idx_referral_code` (`referral_code`),
    FOREIGN KEY (`referrer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`referee_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`campaign_id`) REFERENCES `referral_campaigns`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
