create database if not exists admin_platform;
use admin_platform;

create table if not exists tbl_customer(
	id int auto_increment primary key,
	name varchar(150) not null,
	contact_person varchar(150) not null,
	prefix varchar(20),
	dept varchar(50),
	title varchar(50),
	phone varchar(20) not null,
	email varchar(255) not null,
	website varchar(255)
);

create table if not exists tbl_address(
	id int auto_increment primary key,
	unit varchar(255) not null,
	surburb varchar(255) not null,
	city varchar(255) not null,
	state varchar(255) not null,
	country varchar(255) not null,
	postal_code int(10) not null
);

create table if not exists tbl_customer_address(
	id int,
	address_id int,
	customer_id int,
	constraint fk_address foreign key (address_id) references tbl_address(id),
	constraint fk_customer foreign key (customer_id) references tbl_customer(id)
);

create table if not exists tbl_product(
	id int auto_increment primary key,
	prod_name varchar(255) not null,
	price int not null
);

create table if not exists tbl_transaction(
	id int primary key,
	prod_id int,
	customer_id int,
	installed_address_id int,
	constraint fk_product_trans foreign key (prod_id) references tbl_product(id),
	constraint fk_customer_trans foreign key (customer_id) references tbl_customer(id),
	constraint fk_address_trans foreign key (installed_address_id) references tbl_address(id)
);

create table if not exists tbl_service_manager(
	id int primary key,
	transaction_id int,
	service_date datetime not null,
	period_type varchar(20),
	constraint fk_transaction foreign key (transaction_id) references tbl_transaction(id)
);