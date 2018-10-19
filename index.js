var sleep = require('system-sleep');

for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
        console.log(i + j)
        sleep(1000)
    }
}
