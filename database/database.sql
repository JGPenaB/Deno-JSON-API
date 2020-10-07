SET datestyle = dmy;

DROP TABLE IF EXISTS Usuarios CASCADE;
CREATE TABLE Usuarios(
    ID serial PRIMARY KEY,
    Email varchar(128) UNIQUE NOT NULL,
    Contrasena varchar(128) NOT NULL,
    Nombre varchar(128) NOT NULL
);

DROP TABLE IF EXISTS Perfil;
CREATE TABLE Perfil(
    ID serial PRIMARY KEY,
    ID_Usuario integer NOT NULL,
    Nombres varchar(128),
    Apellidos varchar(128),
    Fecha_Nacimiento date,
    FOREIGN KEY(ID_Usuario) REFERENCES Usuarios(ID) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Cuentas CASCADE;
CREATE TABLE Cuentas(
    ID serial PRIMARY KEY,
    ID_Usuario integer NOT NULL,
    Tipo varchar(64) NOT NULL,
    Saldo real NOT NULL,
    FOREIGN KEY(ID_Usuario) REFERENCES Usuarios(ID) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Transacciones;
CREATE TABLE Transacciones(
    ID serial PRIMARY KEY,
    ID_Cuenta integer NOT NULL,
    Concepto varchar(256) NOT NULL,
    Monto real NOT NULL,
    Ingreso boolean NOT NULL,
    FOREIGN KEY(ID_Cuenta) REFERENCES Cuentas(ID) ON DELETE CASCADE
);