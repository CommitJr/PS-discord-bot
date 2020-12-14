import { CategoryChannel, Client, Guild, GuildChannel, Role } from 'discord.js';
import messages from './utils/messages';
import IDs from './utils/IDs';
import roles from './utils/roles';
import usages from './utils';
import utils from './utils';

const client = new Client();

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
    if(message.content[0] === usages.callBot){
      let botMessage = null;

      if(message.channel.id === IDs.commandChannelID){
        const splitMessageTemp = message.content.split(usages.splitTerm);
        const splitMessage = splitMessageTemp.map(value => value.trim());
    
        if(splitMessage.length > 3) return message.reply("Wrong arguments");
      
        const guild = client.guilds.cache.get(IDs.guildID);
        const command = splitMessage[0].slice(1);
    
        switch (command) {
          case (usages.commandKeys.helpCommand):
            message.author.send(messages.helpMessage);
            break;
    
          case (usages.commandKeys.createCommand):
            const groupName = splitMessage[1];
    
            if(!groupName) {
              botMessage = await message.reply("Say the name of your squad!");
              break;
            }
    
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
    
            botMessage = await message.reply("Squad created! Check your PV to get the ID and call your squad to enter with join Command!");
    
            break;
    
          case (usages.commandKeys.joinCommand):
            const roleID = splitMessage[1];
    
            const role = await guild.roles.fetch(roleID);
    
            message.member.roles.add(role);
            botMessage = await message.reply(`Congratulations, you are in **${role.name}** now!`);
    
            break;
    
          case(usages.commandKeys.changeCommand):
            const roleOldName = splitMessage[1];
            const roleNewName = splitMessage[2];

            const category:CategoryChannel = guild.channels.cache.reduce((total, value) => {
              if (total != null) return total;
              if (value.name === roleOldName && value.type === "category") return value;
              return null;
            }, null);

            const changedRoleID = category.permissionOverwrites.reduce((total, value) => {
              return value.id;
            }, null);

            const roleChanged = await guild.roles.fetch(changedRoleID);

            roleChanged.edit({
              name: roleNewName
            });

            category.edit({
              name: roleNewName
            });

            break;

          default:
            botMessage = await message.reply(messages.invalidCommandMessage);
            break;
        }
      }
      else {
        botMessage = await message.reply(messages.incorrectServerMessage);
      }

      const delay = utils.deleteDelay;

      message.delete({
        timeout: delay
      });

      botMessage ? botMessage.delete({
        timeout: delay
      }):'';
    }
  }catch(err) {
    console.log(err);
    message.reply(messages.errorMessage);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('NzYxNjE3MTc0Nzg3Nzg0NzEz.X3dNRA.SqTPhvGoOrO9SfgeDY2MkmxgHws');
