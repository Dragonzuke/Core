// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
const BaseEvent = require('../utils/structures/BaseEvent');
const users = require('../database/Users');

module.exports = class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super('guildMemberUpdate');
  }
  
  async run(client, oldMember, newMember) {

    if(oldMember.roles.cache.size > newMember.roles.cache.size) {
      oldMember.roles.cache.forEach(async role => {
        if(!newMember.roles.cache.some(r => r.id === role.id)) {
          let userData = await users.findOne({where: {user_id: newMember.id, role_id: role.id}});
          if(userData) userData.destroy();
        }
      })
    }

    if(oldMember.roles.cache.size < newMember.roles.cache.size) {
      newMember.roles.cache.forEach(async role => {
        if(!oldMember.roles.cache.some(r => r.id === role.id)) {
          let userData = await users.findOne({where: {user_id: newMember.id, role_id: role.id}});
          if(userData) return;
          
          else if(role.id === "886724467185815563") {
            return users.create({
              user_id: newMember.id,
              role_id: role.id,
              acknowledgements: '<:devbadge:884974830556946473> Developer',
              global_level: 50
            });
          }
          else if(role.id === "886723985197371422") {
            return users.create({
              user_id: newMember.id,
              role_id: role.id,
              acknowledgements: '<:employee:884557462567550977> Core Staff',
              global_level: 0
            });
          }
        }
      })
    }

  }
}