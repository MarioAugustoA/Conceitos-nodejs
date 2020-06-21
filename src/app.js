const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());



function validateProjectId(request,response,next){
  const { id } = request.params;

  if(!isUuid(id)){
      return response.status(400).json({error:'Invalid Project ID.'});
  }
  return next();
}

app.use('/projects/:id', validateProjectId);


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const   { title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
    
  };
    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;
  const {likes} = request.body

  if (likes) {
    return response.json({
      likes:0
    })
  }

  const repositoriesIndex = repositories.findIndex(repository => repository.id ===id) ;

  if(repositoriesIndex < 0){
    return response.status(400).json({error: 'Repository not found.'})
 }

 const repository = {
   id,
   title,
   url,
   techs,
 };

 repositories[repositoriesIndex] = repository

 return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id ===id);

  if(repositoriesIndex < 0){
    return response.status(400).json({error: 'Repository not found.'})
 }

 repositories.splice(repositoriesIndex, 1);

 return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const {likes} = request.body; 
  
  const  repository = repositories.find(repository => repository.id ===id);

  if(!repository){
    return response.status(400).send();
  }

  repository.likes +=1;

  

  return response.json(repository);

  
});

module.exports = app;
