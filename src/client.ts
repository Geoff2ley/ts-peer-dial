
import * as dial from "peer-dial";

const dialClient = new dial.Client();

dialClient.on('ready', () => {

});

dialClient.on('found', (device, ssdpHeaders) => {
    dialClient.getDialDevice(device, (dialDevice, err) => {
        if(dialDevice){
            dialDevice.getAppInfo('YouTube', (appInfo, err) => {
                if(appInfo){
                    dialDevice.launchApp('Netflix', '', 'text/plain', (launchRes, err) => {
                        if(launchRes){
                            console.log('woeifjoiwefjowejf');
                        }
                        if(err){
                            console.log('shit is fucked');
                        }
                    });
                    // dialDevice.launchApp('YouTube', 'v=YE7VzlLtp-4', 'text/plain', (launchRes, err) => {
                    //     if(launchRes){
                    //         console.log('Launched correctly.')
                    //     }
                    // });
                }
            });

        }
    });
});

dialClient.start();