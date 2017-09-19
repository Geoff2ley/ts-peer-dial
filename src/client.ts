
import * as dial from "peer-dial";

const dialClient = new dial.Client();

dialClient.on('ready', () => {

});

dialClient.on('found', (device, ssdpHeaders) => {
    dialClient.getDialDevice(device, (dialDevice, err) => {
        if (dialDevice) {
            dialDevice.getAppInfo('Internet', (appInfo, err) => {
                if (appInfo) {
                    dialDevice.launchApp('Internet', 'https://github.com/andrewwutw/build-djgpp/issues/7', 'text/plain', (launchRes, err) => {
                        if (launchRes) {
                            console.log('woeifjoiwefjowejf');
                        }
                        if (err) {
                            console.log('shit is fucked');
                        }
                    });
                    setTimeout(() => {
                        dialDevice.launchApp('Internet', 'https://www.npmjs.com/package/sleep', 'text/plain', (launchRes, err) => {
                            if (launchRes) {
                                console.log('woeifjoiwefjowejf');
                            }
                            if (err) {
                                console.log('shit is fucked');
                            }
                        });
                    }, 3000);
                }
            });

        }
    });
});

dialClient.start();