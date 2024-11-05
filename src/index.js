// Importación de módulos
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

// Puerto de conexión
const PORT = process.env.PORT || 4000;

// Cargar los datos de los libros
const libros = require('../data/ebooks.json');

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Ruta API global - muestra todos los datos de los libros
app.get("/api", (req, res) => {
    res.json(libros);
});

// Ruta para filtrar libros por apellido del autor
app.get("/api/apellido/:autor_apellido", (req, res) => {
    const apellido = req.params.autor_apellido.toLowerCase();
    const autoresFiltrados = libros.filter(libro => libro.autor_apellido.toLowerCase() === apellido);
    if (autoresFiltrados.length === 0) {
        return res.status(404).send("Autor no encontrado");
    }
    res.json(autoresFiltrados);
});

// Ruta para filtrar por nombre y apellido del autor
app.get("/api/nombre_apellido/:nombre/:apellido", (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
    const apellido = req.params.apellido.toLowerCase();
    const autor = libros.find(libro => libro.autor_nombre.toLowerCase() === nombre && libro.autor_apellido.toLowerCase() === apellido);
    if (!autor) {
        return res.status(404).send("Autor no encontrado");
    }
    res.json(autor);
});

// Ruta para filtrar por nombre y primeras letras del apellido
app.get("/api/nombre/:nombre", (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
    const apellidoInicio = req.query.apellido;
    const autoresFiltrados = libros.filter(libro => libro.autor_nombre.toLowerCase() === nombre && libro.autor_apellido.toLowerCase().startsWith(apellidoInicio.toLowerCase()));
    if (autoresFiltrados.length === 0) {
        return res.status(404).send("Autor no encontrado");
    }
    res.json(autoresFiltrados);
});

// Ruta para filtrar libros por año de edición
app.get("/api/edicion/:year", (req, res) => {
    const year = parseInt(req.params.year);
    const librosFiltrados = libros.flatMap(libro => libro.obras.filter(obra => obra.edicion === year));
    if (librosFiltrados.length === 0) {
        return res.status(404).send("No hay libros editados en este año");
    }
    res.json(librosFiltrados);
});

// Ruta 404
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "../public", "404.html")));

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

