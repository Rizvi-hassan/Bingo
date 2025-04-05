# Bingo-Multiplayer

This is an online multiplayer bingo which can be played with friends.  
Try out by clicking [here](https://bingo-multiplayer.netlify.app/)


## Technologies used
- Vite+React - to develop frontend
- Node - backend
- Express - routing
- Socket.io - game status

<br>

## Folder Structure

### Backend
```
backend/
├── controller/
│   └── authController.js           #handles authentication
├── lib/
│   └── socket.js                   #handles socket related io
├── models/
│   ├── dbConnection.js             #build connection to database
│   └── userModel.js                #MongoDb Model to store user credentials
├── routes/
│   └── authRouter.js               #handles authentication routes
├── utils/
│   └── googleConfig.js             #establishes google oauth client
└── app.js                          #main file
```

### Frontend
```
frontend/
├── public/
├── src/
│   ├── App.css                     
│   ├── App.jsx                      #handles frontend routes
│   ├── assets/                      #contains images and svg files
│   │   ├── images/
│   │   │   ├── Bingo.png
│   │   │   ├── cross.png
│   │   │   ├── Google.png
│   │   │   ├── numbers/
│   │   │   └── user-unknown.png
│   │   └── react.svg
│   ├── Components/                  
│   │   ├── Api/
│   │   │   └── api.js               #handles google oauth api
│   │   ├── Finish/
│   │   │   ├── Finish.css
│   │   │   └── Finish.jsx           #shows match result 
│   │   ├── Hero/
│   │   │   ├── Hero.css
│   │   │   └── Hero.jsx             #langing page
│   │   ├── Host/
│   │   │   ├── Host.css
│   │   │   ├── Host.jsx             #lobby for the host
│   │   │   └── Lobby.jsx            #lobby for joined players
│   │   ├── Join/
│   │   │   ├── join.css
│   │   │   └── Join.jsx             #join page
│   │   ├── Login/
│   │   │   ├── login.css
│   │   │   └── Login.jsx
│   │   ├── Me/
│   │   │   ├── Me.css
│   │   │   └── Me.jsx               #shows user info - logout
│   │   ├── NotFound/
│   │   │   └── NotFound.jsx         #404 not found page
│   │   └── Play/
│   │       ├── CheckBingo.mjs       #checks if a row, col or diagonal is complete
│   │       ├── Grids/               #to display grids of 3 different sizes
│   │       │   ├── Grid_4.jsx  
│   │       │   ├── Grid_5.jsx
│   │       │   └── Grid_6.jsx
│   │       ├── Number.jsx           #to display number-images in the banner
│   │       ├── Play.css
│   │       ├── Play.jsx             #contains grid, players, number banner where players play
│   │       └── Player.jsx           #circular player icon with changing border
│   ├── Contexts/                    #to handle global variables
│   │   ├── UserContext.jsx
│   │   └── UserState.jsx
│   └── main.jsx
├── index.html
```

<br>

## Google Authenticatiton flow
![Google auth flow diagram](./frontend/src/assets/google%20auth%20flow.svg)

<br>


## Google Authenticatiton flow
![Lobby flow diagram](./frontend/src/assets/lobby%20control%20flow.svg)
