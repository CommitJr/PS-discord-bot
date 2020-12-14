import usages from '..';

function createExplain(key:Array<string>, explain:string):string {

  let returnableString = key.reduce((accumulator, value, index) => {
    accumulator += (index===0) ? '':" " + usages.splitTerm + " ";

    return `${accumulator}${value}`;
  }, `➼ ${usages.callBot}*`);

  returnableString += `* : ${explain};`;

  return returnableString;
}

export default{
  helpMessage:
    "Para utilizar os comandos do bot Pull Jr. você deve enviá-los " +
    "necessariamente no canal **command**. Os comandos disponíveis são:" +

    "\n\n" +

    createExplain([usages.commandKeys.helpCommand], "para solicitar essa " + 
    "mensagem de ajuda") + "\n" +

    createExplain([usages.commandKeys.createCommand, "<SQUAD_NAME>"], 
    "cria um canal de texto e voz " +
    "para seu squad utilizar durante o processo seletivo. O Comando e o nome " +
    "passado em seguida devem, necessariamente, estar separados por vírgula. " +
    "Quando utilizar esse comando um ID será gerado e enviado diretamente " +
    "no seu chat privado (esse ID será útil no comando seguinte)") + "\n" +

    createExplain([usages.commandKeys.joinCommand, "<SQUAD_ID>"], 
    "você vai utilizar esse comando para entrar no squad previamente criado. " +
    "Até mesmo o criador do time deverá utilizá-lo") + "\n" +

    createExplain([usages.commandKeys.changeCommand, "<SQUAD_OLD_NAME>", 
    "<SQUAD_NEW_NAME>"], "caso queira mudar o nome do squad você deve " + 
    "utilizar esse comando") +

    "\n\n" +

    "O bot foi criado, também, com o intuito de avaliar a comunicação do " +
    "time para organizarem sua equipe e ajudar uns aos outros. Então as " +
    "mensagens enviadas para o bot e respondidas por ele rapidamente serão " +
    "apagadas para que outros grupos não se beneficiem do seu esforço :wink:",

  incorrectServerMessage: "Send commands only on **command** text channel!",

  errorMessage: "Ocorreu um erro inesperado, procure algum veterano para " + 
  "resolver sentimos muito :c",

  invalidCommandMessage: "That is not a valid command!",
}