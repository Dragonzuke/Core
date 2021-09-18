const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'utils', []);
  }

  run(client, message, args) {
    return message.reply("This command is not enabled yet.")
  }
}