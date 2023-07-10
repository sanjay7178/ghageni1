## GhaGeni
GhaGeni facilitates seamless communication through interactive conversations.
Users can effortlessly communicate with GhaGeni, enhancing their ability to express ideas and gather insights.

## Installation  
for debian based servers
replace your service.json file in start.sh 
```
bash start.sh 
```
or
```
./start.sh 
```
## Process Flow

Primarily, Web Assembly is utilized, which has been compiled and written using Flutter. The Palm2 model, integrated with a chat bison model, serves as the endpoint for access via Langchain. Langchain also backs the chat storage, saving it in an Upstash Redis key-value datastore.

For extending chat capabilities and ensuring persistence of chat memory, we utilized a buffer memory through Langchain. The chat history is then stored using a Flutter session manager.

We have implemented Express middleware, enabling users to access their chat panel seamlessly anywhere through the WASM interface. In this setup, TypeScript is used for backend operations, while Flutter is applied for frontend tasks.

## Architecture
![Architecture](https://raw.githubusercontent.com/sanjay7178/ghageni1/main/images/Architecture.png)

## Interface 

## API Docs
we used swaagger with express api server for api testing and documentation 
![apidocs](https://raw.githubusercontent.com/sanjay7178/ghageni1/main/images/Screenshot_20230710_161138.png)