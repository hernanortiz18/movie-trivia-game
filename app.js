const express = require("express");
const db = require("./db");

const app = express();
const port = 3000;

app.use(express.json());

let respuesta;

app.get("/trivia/pregunta", (req, res) => {
  let movieQuery = `SELECT * 
  FROM  movies
  ORDER BY RANDOM() 
  LIMIT 1`;

  db.get(movieQuery, [], (err, movie) => {
    if (err) {
      res.status(400).send(err.message);
      return;
    }
    let actorQuery = `
    SELECT first_name,last_name
    FROM (
    SELECT first_name, last_name
    FROM actors
    WHERE id IN (
      SELECT actor_id
      FROM roles
      WHERE movie_id = ?
    )
    UNION
    SELECT first_name, last_name
    FROM actors
    WHERE id NOT IN (
      SELECT actor_id
      FROM roles
      WHERE movie_id = ?
    )
  )
  ORDER BY RANDOM()
  LIMIT 4`;
    db.all(actorQuery, [movie.id, movie.id], (err, actors) => {
      if (err) {
        res.status(400).send(err.message);
        return;
      }
      res.status(200).send({
        pregunta: `¿Cuál de los siguientes actores actuó en ${movie.name}?`,
        opciones: actors,
        respuesta: actors[0],
      });
    });
  });
});

app.post("/trivia/respuesta", (req, res) => {
  let respuestaUsuario = req.body.respuesta;
  if (respuestaUsuario === respuesta) res.send("CORRECTO");
  else res.send("TU RESPUESTA FUE INCORRECTA");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
