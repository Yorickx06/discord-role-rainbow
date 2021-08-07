const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const size = config.colors;
const rainbow = new Array(size);

for (var i = 0; i < size; i++) {
    var red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
    var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
    var green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

    rainbow[i] = '#' + red + green + blue;
}

function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / size * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
}

let place = 0;
const servers = config.servers;

function changeColor() {
    for (let index = 0; index < servers.length; ++index) {
        let server = client.guilds.cache.get(servers[index]);
        if (!server) {
            if (config.logging) {
                console.log(`[Pomme] Le server ${servers[index]} a pas etais trouver. Passer.`);
            }
            continue;
        }

        let role = server.roles.cache.find(r => r.name === config.roleName);
        if (!role) {
            if (config.logging) {
                console.log(`[Pomme] le role ${config.roleName} a pas etais trouver dans le serveur ${servers[index]}. Passer.`);
            }
            continue;
        }

        role.setColor(rainbow[place]).catch(console.error);

        if (config.logging) {
            console.log(`[Pomme] Changed change la couleur en ${rainbow[place]} dans le serveur: ${servers[index]}`);
        }
    }

    if (place == (size - 1)) {
        place = 0;
    } else {
        place++;
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
    if (config.speed < 60000) {
        console.log("La speed minimum est de 60000 si vous la mettaos en dessous vous risquez le ban du bot");
        process.exit(1);
    }
    setInterval(changeColor, config.speed);
    changeColor();
});


client.login(process.env.TOKEN);
