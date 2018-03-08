// This script will extract the ip of the machine and then save it in a file

let spawn = require('child_process').spawn;
let cmd = spawn('ipconfig');
let fs = require('fs');

const ipconfigPromise = new Promise((resolve, reject) => {
    let chunk = '';
    cmd.stdout.on('data', data => {
        // data is stored in chunks progressively
        chunk += data.toString('utf8');
    });

    cmd.stdout.on('end', () => {
        return resolve(chunk);
    });
});

const getIp = ipconfigPromise.then((resolvedData) => {
    segmentedStringArr = resolvedData.split('\n');

    // releventIndex stores the index of the array from which provide relevent information about the ip address can be found
    let releventIndex = null;
    // ip address text will hold the entire text which has not only the ip address
    let ipAddressText = null;

    for (let i = 0; i < segmentedStringArr.length; ++i) {
            // each string element in the array's spaces gets replaced by '', \s+ indicates spaces
            segmentedStringArr[i] = segmentedStringArr[i].replace(/\s+/g, '');
            if (segmentedStringArr[i].includes('WirelessLANadapterWi-Fi')) {
                releventIndex = i;
            }

            if (releventIndex && segmentedStringArr[i].includes('IPv4Address')) {
                ipAddressText = segmentedStringArr[i]
            }
    }

    releventIndex = ipAddressText.indexOf(':')

    ipAddress = ipAddressText.slice(releventIndex + 1, ipAddressText.length);

    return ipAddress;
});


const main = () => {
    getIp.then((ip) => {
        pathToFile = '../constants/hostIp.js';
        lineToSave = 'export const ip = ' + '\'' + ip + '\'';
        fs.writeFile(pathToFile, lineToSave, err => {
            if (err) {
                cosnole.log(err);
            }

            console.log('System\'s ip obtained and saved!')
        });
    });
}


if (!module.parent) {
    main();
}
