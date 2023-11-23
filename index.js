const { Client, IntentsBitField, messageLink } = require('discord.js');
const { token, serverIP, serverPort } = require('./config.json');
const mcp = require('minecraft-protocol');
const impuestos = 1 + 1.55; //30 Pais + 100 Impuesto Ganancias + unificacion
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
                    '\n**!server** para conocer el estado actual del servidor de minecraft, de tardarse asumir que esta cerrado.'+
	'\n**!dolar (monto)** para conocer la ultima cotizacion del dolar oficial actual y calcular el monto a pesos que pagarias de realizar una compra con ese monto')
    } else if (msg.content.startsWith("!dolar ")) {
	const parFechaPrecio = await get_cotizacion_dolar()
    	const cotizacion = parFechaPrecio[1];
	const fechaCotizacion = parFechaPrecio[0];
        var priceStringHolder = msg.content.split(' ');
        var priceInUSD = parseFloat(priceStringHolder[1]);

	msg.reply(`Ultima cotizacion del dia ${fechaCotizacion} de $${cotizacion} , segun **BNA**\n`+
	'\n**Conversion** : USD $'+priceInUSD+' = $'+(priceInUSD*cotizacion).toFixed(2)+
	'\nSi se paga algun servicio que figure con este monto al resumen de su tarjeta puede '+
	'llegar el monto $'+(priceInUSD*cotizacion).toFixed(2)*impuestos+
	'\n\n_No se tiene en cuenta impuestos provinciales_');

    }
  }
);

const axios = require('axios');

async function get_cotizacion_dolar() {
  try {
    // Hardcoded the start date until we know how to get the latest update date
    const url = 'https://apis.datos.gob.ar/series/api/series/?ids=168.1_T_CAMBIOR_D_0_0_26&start_date=2022-07&limit=5000';
    const response = await axios.get(url);
    const data = response.data;
    return data.data[data.data.length - 1];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

client.login(token);
