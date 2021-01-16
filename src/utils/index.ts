export default {
  splitTerm: "|",
  callBot: ">",
  commandKeys: {
    changeCommand: "change",
    createCommand: "create",
    joinCommand: "join",
    helpCommand: "help",
  },
  admCommandKeys: {
    deleteCommand: "delete",
  },
  deleteDelay: parseInt(process.env.DELETE_DELAY||"2", 10) * 1000
}