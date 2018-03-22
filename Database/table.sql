CREATE TABLE USERS(
id int primary key,
email varchar(50) unique,
password varchar(100) not null
);

CREATE TABLE USER_INFORMATION(
id int,
street varchar(30),
distric varchar(20),
city varchar(20),
postcode int,
phonenumber varchar(15),
homephone varchar(15),
dob date,
/* thường: chỉ có chức năng thường, giới hạn
vip: có thêm một số chức năng nâng cao
*/
type varchar(6) check (type in ( 'VIP', 'Normal')),
status bit,
startdateregister datetime default now(),
name varchar(100),
img varchar(255),
constraint fk_user_information foreign key (id) references users.id
);

CREATE TABLE DEVICE(
id int primary key,
name varchar(50),
img varchar(255),
description text,
price float,
/* on/off hay sensor*/
type int
);

CREATE TABLE ROOM(
id int primary key auto_increment,
id_user int,
room varchar(50),
img varchar(255),
constraint fk_device_user_id_user foreign key (id_user) references users(id)
);

CREATE TABLE DEVICE_IN_ROOM(
id int primary key,
id_device int,
id_room int,
device_name varchar(50),
status int,
constraint fk_device_inroom_user_id foreign key (id_device) references device(id),
constraint fk_device_inroom_user_id_user foreign key (id_room) references room(id)

);

CREATE TABLE MODE(
id int primary key,
mode_name varchar(100),
id_user int,
status int,
starttime datetime,
stoptime datetime,
constraint fk_mode_id_user foreign key (id_user) references users(id)
);

CREATE TABLE MODE_DETAIL(
id_mode int,
id_device int,
constraint pk_mode_detail primary key (id_mode, id_device),
constraint fk_mode_detail_id_device foreign key (id_device) references device_in_room(id),
constraint fk_mode_detail_id_mode foreign key (id_mode) references mode(id)
);

CREATE TABLE INFORMATION(
id int,
id_user int,
id_device int,
time datetime,
valuesensor float,
constraint pk_information primary key (id, id_user, id_device),
constraint fk_mode_information_id_user foreign key (id_user) references users(id),
constraint fk_mode_information_id_device foreign key (id_device) references device(id)
)