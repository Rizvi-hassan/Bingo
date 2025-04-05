<h1>Bingo-Multiplayer</h1>
<p>This is an online multiplayer bingo which can be played with friends.<br>
https://bingo-multiplayer.netlify.app/
</p>
<br>

<h2>Technologies used</h2>
<ul>
  <li>Vite+React - to develope frontend</li>
  <li>Node - backend</li>
  <li>Express - routing</li>
  <li>Socket.io - game status</li>
</ul>
<br>

<h2>Folder Structure</h2>
```
└── 📁backend
    └── 📁controller
        └── authController.js
    └── 📁lib
        └── socket.js
    └── 📁models
        └── dbConnection.js
        └── userModel.js
    └── 📁routes
        └── authRouter.js
    └── 📁utils
        └── googleConfig.js
    └── app.js
```
```
└── 📁frontend
    └── 📁public
    └── 📁src
        └── App.css
        └── App.jsx
        └── 📁assets
            └── 📁images
                └── Bingo.png
                └── cross.png
                └── Google.png
                └── 📁numbers
                └── user-unknown.png
            └── react.svg
        └── 📁Components
            └── 📁Api
                └── api.js
            └── 📁Finish
                └── Finish.css
                └── Finish.jsx
            └── 📁Hero
                └── Hero.css
                └── Hero.jsx
            └── 📁Host
                └── Host.css
                └── Host.jsx
                └── Lobby.jsx
            └── 📁Join
                └── join.css
                └── Join.jsx
            └── 📁Login
                └── login.css
                └── Login.jsx
            └── 📁Me
                └── Me.css
                └── Me.jsx
            └── 📁NotFound
                └── NotFound.jsx
            └── 📁Play
                └── CheckBingo.mjs
                └── 📁Grids
                    └── Grid_4.jsx
                    └── Grid_5.jsx
                    └── Grid_6.jsx
                └── Number.jsx
                └── Play.css
                └── Play.jsx
                └── Player.jsx
        └── 📁Contexts
            └── UserContext.jsx
            └── UserState.jsx
        └── main.jsx
    └── index.html
    └── package-lock.json
```
