import { Client, Guild, Role } from 'discord.js';
import messages from './messages';
import IDs from './IDs';
import roles from './roles';

const client = new Client();

const callBot = "!";

roles();

client.on('ready', async () => {
  console.log(`Logged in as - ${client.user.tag}!`);
});

async function createSquadChannel(role:Role, guild:Guild) {

  const category = await guild.channels.create(role.name, {
    type: "category",
    permissionOverwrites: [
      {
        id: role,
        allow: [
          "CONNECT",
          "VIEW_CHANNEL"
        ]
      }
    ]
  });

  guild.channels.create('text', {
    type: "text",
    parent: category
  });

  guild.channels.create('Voice', {
    type: "voice",
    parent: category
  })
}

client.on('message', async (message) => {
  try{
    if(message.content[0] === callBot){
      let botMessage = null;

      if(message.channel.id === IDs.commandChannelID){
        const splitMessageTemp = message.content.split(",");
        const splitMessage = splitMessageTemp.map(value => value.trim());
    
        if(splitMessage.length > 2) return message.reply("Too many arguments bro");
      
        const guild = client.guilds.cache.get(IDs.guildID);
        const command = splitMessage[0].slice(1);
    
        switch (command) {
          case ('help'):
            message.author.send(messages.helpMessage);
            break;
    
          case ('create'):
            const groupName = splitMessage[1];
    
            if(!groupName) return botMessage = message.reply("Say the name of your squad!");
    
            const roleCreated = await guild.roles.create({
              data: {
                name: groupName,
                color: Math.floor((Math.random()* 0xFFFFFF)).toString(16),
                hoist: true
              }
            });
    
            message.author
              .send(`The ID of your Squad **${roleCreated.name}** is **${roleCreated.id}**`);

            await createSquadChannel(roleCreated, message.guild);
    
            botMessage = message.reply("Squad created! Check your PV to get the ID and call your squad to enter with join Command!");
    
            break;
    
          case ('join'):
            const roleID = splitMessage[1];
    
            const role = await guild.roles.fetch(roleID);
    
            message.member.roles.add(role);
            botMessage = message.reply(`Congratulations, you are in **${role.name}** now!`);
            message.delete();
    
            break;
    
          default:
            botMessage = message.reply("That is not a valid command!");
            break;
        }
      }
      else {
        botMessage = await message.reply("Send commands only on **command** text channel!!");
      }

      const delay = 5 * 1000;

      message.delete({
        timeout: delay
      });

      botMessage ? botMessage.delete({
        timeout: delay
      }):'';
    }
  }catch(err) {
    console.log(err);
    message.reply("Ocorreu um erro inesperado, procure algum veterano para resolver sentimos muito :c");
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('NzYxNjE3MTc0Nzg3Nzg0NzEz.X3dNRA.SqTPhvGoOrO9SfgeDY2MkmxgHws');
