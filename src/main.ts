'use strict';

import * as peer from "peer-dial";
import * as express from 'express';
import opn = require('opn');
import * as http from 'http';
import * as cp from "child_process";

var PORT = 3000;
var MANUFACTURER = "Fraunhofer FOKUS";
var MODEL_NAME = "DIAL Demo Server";

const expApp = express();
const httpServer = http.createServer(expApp);

class YoutubeImpl implements peer.App {
    name: string = "YouTube";
    state: string = "stopped";
    allowStop: boolean = true;
    pid: string;
    launch(launchData: string): void {
        opn("http://www.youtube.com/tv?" + launchData);
    }
}

class NetflixImpl implements peer.App {
    name: string = "Netflix";
    state: string = "stopped";
    allowStop: boolean = true;
    pid: string;
    launch(launchData: string): void {
        //../../../src/platform/qt/netflix
        const netflixApp = "netflix://";
        opn(netflixApp+launchData);
        console.log('The launch data was: ' + launchData);

        // opn("https://www.netflix.com/watch/80004167?trackId=14170286&tctx=1%2C0%2C4f45da75-9e0e-4626-b2de-f22f302000a8-59489809");
    }
}

class InternetImpl implements peer.App {
    name: string = "Internet";
    state: string = "stopped";
    allowStop: boolean = true;
    pid: string;

    private cp : cp.ChildProcess;
    private promise : any;

    launch(launchData: string): void {
        if(this.cp){
            this.cp.kill();
        }
        this.promise = opn(launchData);
        this.promise.then((e : cp.ChildProcess) => {
            this.cp = e;
        });
    }
}

class SteamImpl implements peer.App {
    name: string = "Game";
    state: string = "stopped";
    allowStop: boolean = true;
    pid: string;

    launch(launchData: string): void {
        //Open steam game here.
        opn(launchData);
    }
}

const app = new YoutubeImpl();
const netflix = new NetflixImpl();
const internet = new InternetImpl();

class DelegateImpl implements peer.Delegate {
    getApp(appName: string): peer.App {
        if(appName === app.name){
            return app;
        } else if (appName === netflix.name){
            return netflix;
        } else if (appName === internet.name){
            return internet;
        }
        return app; //Use youtube by default. I hate npes.
    }
    launchApp(appName: string, launchData: string, callback: (data: string) => void): void {
        console.log("Got request to launch", appName, " with launch data: ", launchData);
        var pid = null;
        if(appName === app.name){
            if (expApp) {
                app.pid = "run";
                app.state = "starting";
                app.launch(launchData);
                app.state = "running";
            }
            callback(app.pid);
        }
        if(appName === netflix.name){
            if (expApp) {
                netflix.pid = "run";
                netflix.state = "starting";
                netflix.launch(launchData);
                netflix.state = "running";
            }
            callback(netflix.pid);
        }
        if(appName === internet.name){
            if (expApp) {
                internet.pid = "run";
                internet.state = "starting";
                internet.launch(launchData);
                internet.state = "running";
            }
            callback(internet.pid);
        }
    }
    stopApp(appName: string, pid: string, callback: (data: boolean) => void): void {
        console.log("Got request to stop", appName, " with pid: ", pid);
        if (app && app.pid == pid) {
            app.pid = "";
            app.state = "stopped";
            callback(true);
        }
        else {
            callback(false);
        }
    }
}

const server = new peer.Server({
    expressApp: expApp,
    prefix: '/dial',
    port: PORT,
    corsAllowOrigins: '*',
    manufacturer: MANUFACTURER,
    modelName: MODEL_NAME,
    delegate: new DelegateImpl()
});

httpServer.listen(PORT, () => {
    server.start();
    console.log('Dial Server is running on port ' + PORT);
});