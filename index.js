const { Client, IntentsBitField, messageLink } = require('discord.js');
const { token, serverIP, serverPort } = require('./config.json');
const mcp = require('minecraft-protocol');
const impuestos = 1.76; //21 IVA + 9 Servicio digital + 45 Impuesto Pais
const impuestosExtras = impuestos+ 0.21; //Bienes personales 21
const channelId = "750481919137022102"; // #jf

const client = new Client({
     intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent], 
});

client.once('ready', () => {
	console.log('Ready!'); 
});

client.on('ready', () => {
    console.log('Bot is ready as : ', client.user.tag);
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) {
        return;
    }
    // TODO: pasar a commands y commandsBuilder para no tener cadena de ifs
    if (msg.content.startsWith('!pais ')){
        var priceStringHolder = msg.content.split(' ');
        var price = parseFloat(priceStringHolder[1]);
        msg.reply('Se aplican los siguientes impuestos: \n**IVA 21% **: $'+ (price*(0.21)).toFixed(2) 
                    +' \n**Servicios digitales 9% **: $'+ (price*(0.09)).toFixed(2) 
                    +'\n**Impuesto Pais 45% **: $'+ (price*(0.45)).toFixed(2) 
                    +' \nPrecio final es $'+ (price*impuestos).toFixed(2) 
                    + " \n\nRecorda que si gastas mas de 300 USD por mes se te aplica \n**Bienes personales 21% **: $"+ (price*0.21).toFixed(2) 
                    +" \nen ese caso el total es $" + (price*impuestosExtras).toFixed(2) 
                    +" pesos. \n\n_Si no pagas ganancias podes pedir la devolucion del impuesto PAIS por al pagina de la AFIP._");
    } else if (msg.content.startsWith("!server")) {
        mcp.ping({ host: serverIP, port: serverPort }, (err, results) => {
            if (err) {
              msg.reply('El servidor esta actualemente cerrado.')
            } else {
              msg.reply('El servidor de Minecraft esta online, acordate que la IP es ' + serverIP+":"+serverPort
                        +' \njugadores conectados '+ results.players.online+'.');
            }
          });
    } else if (msg.content.startsWith("!help")) {
        msg.reply('**!pais (monto)** para calcular los impuestos que se le aplican a una compra en peso al exterior, tanto Steam , AirBNB ,TiendaMia, etc'+
                    '\n**!server** para conocer el estado actual del servidor de minecraft, de tardarse asumir que esta cerrado.')
    }
  }
);

client.login(token);