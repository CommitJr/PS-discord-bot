import IDs, { roles } from "../IDs";
const ReactionRole = require('reaction-role');

export default function () {
  const system = new ReactionRole('NzYxNjE3MTc0Nzg3Nzg0NzEz.X3dNRA.SqTPhvGoOrO9SfgeDY2MkmxgHws');
  
  const option1 = system.createOption("🐬", undefined, undefined, [ roles.commitosRoleID ], undefined);
  const option2 = system.createOption("🐟", undefined, undefined, [ roles.commitinhosRoleID ], undefined);
   
  const LIMIT = 1000;
   
  system.createMessage(IDs.roleMessageID, IDs.welcomeChannelID, LIMIT, undefined, option1, option2);
   
  system.init();
}
