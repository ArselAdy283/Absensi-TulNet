CREATE TABLE `attendance` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`session_id` int NOT NULL,
	`photo` varchar(255) NOT NULL,
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`address` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`time` time NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nisn` varchar(20) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_nisn_unique` UNIQUE(`nisn`)
);
--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE no action ON UPDATE no action;