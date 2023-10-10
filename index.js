const { Client, IntentsBitField, messageLink } = require('discord.js');
const { token, serverIP, serverPort } = require('./config.json');
const mcp = require('minecraft-protocol');
const impuestos = 2.00; //30 Pais + 45 Impuesto Ganancias + unificacion
//const impuestosExtras = impuestos+ 0.21; //Bienes personales 21
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
        msg.reply('Precio final es $'+ (price*impuestos).toFixed(2) 
                    +' pesos. \n'
		    +'\nSi vivis en una provincia la que aplica el impuesto a sellos sobre las tarjetas de credito entonces se te suma el importe del mismo 1,2%,'+
        '\nen este caso es de $'+ (price*(0.012)).toFixed(2)
		    +"\n\n_Si no pagas ganancias podes pedir la devolucion de la percepcion a las ganancias por al pagina de la AFIP._");
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
