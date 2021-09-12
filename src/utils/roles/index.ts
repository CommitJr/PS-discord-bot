import IDs, { roles } from "../IDs";
const ReactionRole = require('reaction-role');

export default function (botId:string|undefined) {
  const system = new ReactionRole(botId);
  
  const option1 = system.createOption("🦚", undefined, undefined, [ roles.commitosRoleID ], undefined);
  const option2 = system.createOption("🦜", undefined, undefined, [ roles.commitinhosRoleID ], undefined);
   
  const LIMIT = 1000;
   
  system.createMessage(IDs.roleMessageID, IDs.welcomeChannelID, LIMIT, undefined, option1, option2);
   
  system.init();
}
