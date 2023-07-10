const express = require('express');
const { ChatGoogleVertexAI } = require("langchain/chat_models/googlevertexai");
const { PromptTemplate } = require('langchain/prompts');
const { LLMChain } = require('langchain/chains');
require('isomorphic-fetch');
const { BufferMemory } = require('langchain/memory');
const { UpstashRedisChatMessageHistory } = require('langchain/stores/message/upstash_redis');
const { ConversationChain } = require('langchain/chains');
// const { swaggerJSON, swaggerHTML } = require('./tempelate.ts');
const { Redis } = require('@upstash/redis/cloudflare');
const { MotorheadMemory } = require('langchain/memory');

const app = express();

const redis = new Redis({
  url: 'https://equal-ram-41293.upstash.io',
  token: 'AaFNACQgZGE1ZDk4OWYtNzY1My00ZGFiLWFkYmUtODY1NDA3NDE2OGMwNWIzYWMwY2U1OGQ1NDA5N2IyZTlhZjU2NzllMWViMmM=',
});
// Middleware to parse request bodies
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Swagger endpoint
app.get('/swagger', async (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(swaggerHTML);
});

app.get('/swagger.json', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send(swaggerJSON);
});

// API endpoint
app.post('/api', async (req, res) => {
  try {
    // Parse the JSON payload from the request
    const requestBody = req.body;

    // Validate the required input
    if (!requestBody.product) {
      return res.status(400).send("Missing 'product' parameter");
    }


    const model = new ChatGoogleVertexAI({
      temperature: 0.7,
    });
    
    const prompt = PromptTemplate.fromTemplate('Answer this prompt properly: {product}');
    const chainA = new LLMChain({ llm: model, prompt });

    // Call the LLMChain with the provided input
    const resA = await chainA.call({ product: requestBody.product });

    // Return the response as JSON
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ resA }));
  } catch (error) {
    // Handle any errors that occur
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

// API2 endpoint
app.post('/api2', async (req, res) => {
  try {
    // Parse the JSON payload from the request
    const requestBody = req.body;

    // redis total keys check 
    // Validate the required input
    if (!requestBody.product) {
      return res.status(400).send("Missing 'product' parameter");
      console.log(requestBody.product);
    }
    if (!requestBody.sessionId) {
      return res.status(400).send("Missing 'sessionId' parameter");
      console.log(requestBody.sessionId);
    }
    
    const  keylenght = await redis.llen(requestBody.sessionId) ;
    console.log(keylenght)
    const memory = new BufferMemory({
      chatHistory: new UpstashRedisChatMessageHistory({
        sessionId: requestBody.sessionId,
        config: {
          url: 'https://equal-ram-41293.upstash.io',
          token: 'AaFNACQgZGE1ZDk4OWYtNzY1My00ZGFiLWFkYmUtODY1NDA3NDE2OGMwNWIzYWMwY2U1OGQ1NDA5N2IyZTlhZjU2NzllMWViMmM=',
        },
      }),
    });



const model = new ChatGoogleVertexAI({
  temperature: 0.7,
});

    let prompt ;
    // if (keylenght === 0) {
    //   prompt =`generate only three questions related to it in order : ${requestBody.product}`;
    // }else{
    //   prompt = `Answer this : ${requestBody.product}`;
    // }
    prompt =`strictly generate three questions related to it in order with quoestion mark: ${requestBody.product}`;
    
    // else if( keylenght === 4) {
    //   prompt =`Answer this : ${requestBody.product}`;
    // }else if (keylenght === 6){
    //   prompt = `generate only one questions related to it in order : ${requestBody.product}`; 
    // }else{
    //   prompt = PromptTemplate.fromTemplate('Answer this : {product}');
    // }

    const chain = new ConversationChain({ llm: model, memory });

    // Call the LLMChain with the provided input
    const resA = await chain.call({input : prompt});

    console.log(resA);
    var json = resA;
    var responseArray = json.response.split('\n').filter(function(line) {
      return (line.trim() !== '' || line.trim().toString().includes("?")) || !line.trim().toString().includes("?");
    });

    console.log(resA.length);

    // Return the response as JSON
    // if (keylenght === 0) {
    //   var json = resA;
    //   var responseArray = json.response.split('\n').filter(function(line) {
    //     return line.trim() !== '';
    //   });
    // }else{
    //   var responseArray = resA.response;
    // }
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ responseArray }));
  } catch (error) {
    // Handle any errors that occur
    console.log(error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

// API3 endpoint
app.post('/api3', async (req, res) => {
  try {
    // Parse the JSON payload from the request
    const requestBody = req.body;

    // redis total keys check 
    // Validate the required input
    if (!requestBody.product) {
      return res.status(400).send("Missing 'product' parameter");
      console.log(requestBody.product);
    }
    if (!requestBody.sessionId) {
      return res.status(400).send("Missing 'sessionId' parameter");
      console.log(requestBody.sessionId);
    }
    
    const  keylenght = await redis.llen(requestBody.sessionId) ;
    console.log(keylenght)
    const memory = new BufferMemory({
      chatHistory: new UpstashRedisChatMessageHistory({
        sessionId: requestBody.sessionId,
        config: {
          url: 'https://equal-ram-41293.upstash.io',
          token: 'AaFNACQgZGE1ZDk4OWYtNzY1My00ZGFiLWFkYmUtODY1NDA3NDE2OGMwNWIzYWMwY2U1OGQ1NDA5N2IyZTlhZjU2NzllMWViMmM=',
        },
      }),
    });

    const model = new ChatGoogleVertexAI({
      temperature: 0.7,
    });
    
    let prompt ;
    prompt = prompt = `Answer this and suggest some more ideas : ${requestBody.product}`;

    const chain = new ConversationChain({ llm: model, memory });

    // Call the LLMChain with the provided input
    const resA = await chain.call({ input: prompt });

    // Return the response as JSON
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ resA }));
  } catch (error) {
    // Handle any errors that occur
    console.log(error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});


//upstash  redis endpoint
app.post('/redis', async (req, res) => {
  try {
    const requestBody = req.body;
    if (!requestBody.sessionId) {
      return res.status(400).send("Missing 'sessionId' parameter");
      console.log(requestBody.sessionId);
    }
    if (!requestBody.query) {
      return res.status(400).send("Missing 'query' parameter");
      console.log(requestBody.query);
    }
    if (requestBody.query === "content"){
      const resA = await  redis.lrange(requestBody.sessionId,0,-1);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ resA }));
    }else if (requestBody.query === "delete"){
      const resA = await  redis.del(requestBody.sessionId);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ resA }));
    }else if (requestBody.query === "keylenght"){
      // const resA = (await redis.lrange( requestBody.sessionId,0,-1)).length;
      const resA =  await redis.llen(requestBody.sessionId);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ resA }));
    }
  } catch (error) {
    // Handle any errors that occur
    console.log(error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
}
);
// 404 Not Found
app.use((req, res) => {
  res.status(404).send('Not found');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



// Swagger UI HTML
let swaggerHTML = `
<!DOCTYPE html>
<html>
  <head>
    <title>Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
      SwaggerUIBundle({
        url: "/swagger.json",
        dom_id: "#swagger-ui",
      });
    </script>
  </body>
</html>
`;
// Swagger JSON
let swaggerJSON = `
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Express Middleware API"
  },
  "paths": {
    "/api": {
      "post": {
        "summary": "Process request",
        "consumes": ["application/json"],
        "parameters": [
          {
            "name": "product",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "product": {
                  "type": "string"
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "type": "object",
              "properties": {
                "resA": {
                  "type": "string"
                }
              }
            }
          },
          "400": {
            "description": "Bad request"
          },
          "405": {
            "description": "Method not allowed"
          },
          "500": {
            "description": "Internal server error"
          }
        }
      }
    },
    "/api2": {
      "post": {
        "summary": "for 1st,2nd & 3rd quoestions gives relevant three quoestions,for other quoestions answers relevant with conversational buffermemory",
        "consumes": ["application/json"],
        "parameters": [
          {
            "name": "product",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "product": {
                  "type": "string"
                },
                "sessionId": {
                  "type": "string"
                }
              },
              "example": {
                "product": "example_product",
                "sessionId": "example_sessionId"
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "type": "object",
              "properties": {
                "resA": {
                  "type": "string"
                }
              }
            }
          },
          "400": {
            "description": "Bad request"
          },
          "405": {
            "description": "Method not allowed"
          },
          "500": {
            "description": "Internal server error"
          }
        }
      }
    },
    "/api3": {
      "post": {
        "summary": "answers relevant with conversational buffermemory",
        "consumes": ["application/json"],
        "parameters": [
          {
            "name": "product",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "product": {
                  "type": "string"
                },
                "sessionId": {
                  "type": "string"
                }
              },
              "example": {
                "product": "example_product",
                "sessionId": "example_sessionId"
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "type": "object",
              "properties": {
                "resA":  {
                  "response": "your response comes here!!!! string output"
                }
              }
            }
          },
          "400": {
            "description": "Bad request"
          },
          "405": {
            "description": "Method not allowed"
          },
          "500": {
            "description": "Internal server error"
          }
        }
      }
    },
    "/redis": {
      "post": {
        "summary": "query :delete , content , keylenght ",
        "consumes": ["application/json"],
        "parameters": [
          {
            "name": "sessionId",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string"
                },
                "sessionId": {
                  "type": "string"
                }
              },
              "example": {
                "query": "put ur query here",
                "sessionId": "sessionId here"
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "type": "object",
              "properties": {
                "resA": {
                  "type": "string"
                }
              }
            }
          },
          "400": {
            "description": "Bad request"
          },
          "405": {
            "description": "Method not allowed"
          },
          "500": {
            "description": "Internal server error"
          }
        }
      }
    }
  }
}
`;
