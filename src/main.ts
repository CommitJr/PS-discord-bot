import dotenv from 'dotenv';

dotenv.config();

import { CategoryChannel, Client, Guild, Role, TextChannel } from 'discord.js';
import messages from './utils/messages';
import IDs from './utils/IDs';
import roles from './utils/roles';
import usages from './utils';
import utils from './utils';

const client = new Client();

roles();

client.on('ready', async () => {
  const commandChannel = client.channels.cache.get(IDs.commandChannelID) as TextChannel;

  await commandChannel.bulkDelete(100);

  commandChannel.send("I'm ready for use");

  console.log(`Logged in as - ${client.user ? client.user.tag:""}!`);
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

      const splitMessageTemp = message.content.split(usages.splitTerm);
      const splitMessage = splitMessageTemp.map(value => value.trim());
    
      const guild = client.guilds.cache.get(IDs.guildID) as Guild;
      const command = splitMessage[0].slice(1);

      if(message.channel.id === IDs.commandChannelID){    
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

            await createSquadChannel(roleCreated, message.guild as Guild);
    
            botMessage = await message.reply("Squad created! Check your PV to get the ID and call your squad to enter with join Command!");
    
            break;
    
          case (usages.commandKeys.joinCommand):
            const roleID = splitMessage[1];
    
            const role = (await guild.roles.fetch(roleID)) as Role;
    
            message.member ? message.member.roles.add(role):null;
            botMessage = await message.reply(`Congratulations, you are in **${role.name}** now!`);
    
            break;
    
          case(usages.commandKeys.changeCommand):
            const roleOldName = splitMessage[1];
            const roleNewName = splitMessage[2];

            const category = guild.channels.cache.reduce<CategoryChannel|null>((total, value) => {
              if (total != null) return total;
              if (value.name === roleOldName && value.type === "category") return value as CategoryChannel;
              return null;
            }, null) as CategoryChannel;

            const changedRoleID = category.permissionOverwrites.reduce<string>((total, value) => {
              return value.id;
            }, "");

            const roleChanged = (await guild.roles.fetch(changedRoleID)) as Role;

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
      else if(message.channel.id === IDs.admChannelID){
        switch(command) {
          case (usages.admCommandKeys.deleteCommand):
            const squadName = splitMessage[1];

            const squadCategory = guild.channels.cache.reduce<CategoryChannel|null>((acc, value) => {
              if (acc) return acc;
              if (value.name === squadName) return value as CategoryChannel;
              return null;
            }, null) as CategoryChannel;

            const roleForDeleteID = squadCategory.permissionOverwrites.reduce<string>((acc, value) => {
              return value.id;
            }, "");

            const roleForDelete = guild.roles.cache.get(roleForDeleteID) as Role;
            
            roleForDelete.delete();

            guild.channels.cache.map((value) => {
              if(value.parentID === squadCategory.id) value.delete();
            });

            squadCategory.delete();

            botMessage = await message.reply(messages.deletedSquadMessage);

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

      message.delete();

      botMessage ? botMessage.delete({
        timeout: delay
      }):'';
    }
    else if(message.channel.id === IDs.commandChannelID &&
      message.channel.messages.cache.array().length > 1 &&
      !message.author.bot) message.delete();
  }catch(err) {
    console.log(err);
    message.reply(messages.errorMessage);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
