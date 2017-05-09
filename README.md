# MEAN-NG Version 1 (messaging app)
This project expands on my [MEAN-NG Phase 0](https://github.com/nukegold/mean-ng-phase0) scaffold.

Find the full story on how this project came together [here](https://medium.com/@nukegold/a-mean-full-stack-machine-part-3-499bf8f70c63).

A simple MEAN messaging client and server using Angular CLI as a base.
Key features include: 
* Node.JS
* Angular (version 4.1 at the time of this writing)
* Webpack (behind the scenes when using Angular CLI — more on that later)
* ExpressJS
* MongoDB and mongoose
* Environment variables using .env file and the dotenv package
* 3rd party UI elements — bootstrap and font-awesome
* User authentication. Includes full username/password, and Facebook login; a remember me feature; and a password recovery cycle
* Real time messaging using socket.io

## Development server

Run `npm serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. 

