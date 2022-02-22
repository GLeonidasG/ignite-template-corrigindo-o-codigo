const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksIfRepositoryExists(request, response, next) {
  const { id } = request.params;
  const index = repositories.findIndex(repos => repos.id === id);
  if (index === -1) return response.status(404).json({ error: "Repository not found" });
  request.index = index;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checksIfRepositoryExists, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = request.index
  const updatedRepository = request.body;

  updatedRepository.id = id;
  updatedRepository.likes = repositories[repositoryIndex].likes;

  repositories[repositoryIndex] = updatedRepository;
  return response.json(updatedRepository);
});

app.delete("/repositories/:id", checksIfRepositoryExists, (request, response) => {
  const {index} = request
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksIfRepositoryExists, (request, response) => {
  const repositoryIndex = request.index
  const likes = ++repositories[repositoryIndex].likes;
  return response.json({ likes });
});

module.exports = app;
