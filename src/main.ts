'use strict';

import * as peer from "peer-dial";
import * as express from 'express';

class AppImpl implements peer.App {
    name: string;
    state: string;
    allowStop: boolean;
    pid: string;
    launch(launchData: string): void {
    }
}
const app = new AppImpl();

class DelegateImpl implements peer.Delegate {
    getApp(appName: string): peer.App {
        return app;
    }
    launchApp(appName: string, launchData: string, callback: (data: string) => void): void {
    }
    stopApp(appName: string, pid: string, callback: (data: boolean) => void): void {
    }
}

const server = new peer.Server({
    expressApp: express(),
    prefix: '/dial',
    port: 3000,
    corsAllowOrigins: '*',
    manufacturer: 'testing',
    modelName: 'testing',
    delegate: new DelegateImpl()
});