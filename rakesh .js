const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://mandarakesh:185d1a0151@cluster0.vp1lyuc.mongodb.net/bookstore?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define a schema and model for the movies
const movieSchema = new mongoose.Schema({
    name: String,
    img: String,
    summary: String
});

const Movie = mongoose.model('Movie', movieSchema);

// Create
app.post('/movies', async (req, res) => {
    try {
        const movie = new Movie({
            name: req.body.name,
            img: req.body.img,
            summary: req.body.summary
        });
        console.log(movie)
        await movie.save();
        res.status(201).send(movie); // Send the entire movie object in response
        console.log(movie)
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.send(movies);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read one
app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send();
        }
        res.send(movie);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update
app.put('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) {
            return res.status(404).send();
        }
        res.send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete
app.delete('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.query.id);
        if (!movie) {
            return res.status(404).send();
        }
        res.send(movie);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
