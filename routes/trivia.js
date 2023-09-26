const express = require("express");
const db = require("../db");
const routerTrivia = express.Router();

routerTrivia.use(express.json());

// acá guardamos globalmente la respuesta
let respuesta;

function aleatorio(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

routerTrivia.get("/pregunta", (req, res) => {
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
      respuesta = actors[0];
      let newActorsArr = aleatorio(actors);
      res.status(200).send({
        pregunta: `¿Cuál de los siguientes actores actuó en ${movie.name}?`,
        opciones: newActorsArr,
      });
    });
  });
});

routerTrivia.post("/respuesta", (req, res) => {
  let respuestaUsuarioFormateado = `${req.body.first_name} ${req.body.last_name}`;
  let respuestaCorrectaFormateado = `${respuesta.first_name} ${respuesta.last_name}`;

  if (respuestaUsuarioFormateado === respuestaCorrectaFormateado)
    res.send("CORRECTO");
  else
    res.send(
      "TU RESPUESTA FUE INCORRECTA, LA RESPUESTA CORRECTA ES " +
        respuestaCorrectaFormateado
    );
});

module.exports = routerTrivia;
