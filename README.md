SETUP INSTRUCTION
- Run npm install (After downloading project to install all dependencies)

USAGE INSTRUCTION
- Run npm start (To start development server)
- Run npm test (To run test suite)
- Run docker-compose up -d (To start a dockerized container)
- Run docker-compose down (To stop a dockerized container)

# Route one req data
- username: "" 
- password: ""

# Route two req data (Include authorization token in headers section e.g Authorization:Bearer xxxxx)
- baz: ""
- foo: ""

# Route three req data (Include authorization token in headers section e.g Authorization:Bearer xxxxx)
- url:""

# Find docker compose file content below 
version: '3.8'
services:
  server:
    build: ugwusamson/hacker-server
    ports:
      - "8000:8000"
    volumes:
      - downloads:/app/downloads
      - thumbnail:/app/thumbnail
      - ./server:/app
      - ./app/node_modules
    env_file:
      - ./server/config/dev.env
volumes:
  downloads:
  thumbnail: