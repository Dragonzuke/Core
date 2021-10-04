module.exports = class BaseSlashCommand {
  constructor(name, description, type, args) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.options = args;
  }
}