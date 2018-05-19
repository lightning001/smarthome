CREATE TABLE VERSION_USERS(
id int,
email varchar(50),
password varchar(100),
street varchar(30),
distric varchar(20),
city varchar(20),
postcode int,
phonenumber varchar(15),
homephone varchar(15),
dob date,
type varchar(6),
status bit,
startdateregister datetime,
name varchar(100),
img varchar(255)
);

CREATE TABLE VERSION_DEVICE(
id int primary key,
name varchar(50),
img varchar(255),
description text,
price float,
/* on/off hay sensor*/
type int
);

CREATE TABLE VERSION_ROOM(
id int,
id_user int,
room varchar(50),
img varchar(255)
);

CREATE TABLE VERSION_DEVICE_IN_ROOM(
id int,
id_device int,
id_room int,
device_name varchar(50)
);

CREATE TABLE VERSION_MODE(
id int,
mode_name varchar(100),
id_user int,
status int,
starttime datetime,
stoptime datetime
);

CREATE TABLE VERSION_MODE_DETAIL(
id_mode int,
id_device int
);

CREATE TABLE VERSION_INFORMATION(
id int,
id_user int,
id_device int,
time datetime,
valuesensor float
);

CREATE TABLE VERSION(
id int,
changes int,
change_time datetime default now()
);