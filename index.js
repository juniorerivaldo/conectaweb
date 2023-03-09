const qrcode = require("qrcode-terminal");
const { Client, Buttons, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.on("loading_screen", (percent, message) => {
  console.log(":: CARREGANDO WHATSAPP ", percent, "% ::");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log(":: WHATSAPP AUTENTICADO COM SUCESSO ::");
});

client.on("auth_failure", (msg) => {
  console.log("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log(":: TUDO PRONTO BOT RODANDO :) ::");
});
// variaveis de controle
let cliente = {};
let clientes = [];
let msgs = [];
let atendendo = false;
let primeiraMensagem = "";
let cadastrado = 0;

client.on("message", async (msg) => {
  let chat = await msg.getChat();
  if (chat.isGroup) {
    console.log(":: MENSAGEM DE GRUPO NÃO RESPONDER ::");
    return;
  } else {
    if (!primeiraMensagem) {
      primeiraMensagem = msg.body;
      msgs.push(primeiraMensagem);
      //console.log("Primeira mensagem salva:", primeiraMensagem);
    } else if (msg.body === primeiraMensagem) {
      // console.log("As duas mensagens são iguais.");
    } else {
      // console.log("As duas mensagens são diferentes.");
      if (cadastrado == 0) {
        cliente = { nome: msg.body, estado: 1, numero: msg.from };
        clientes.push(cliente);
      }

      cadastrado = 1;
    }
    if (!atendendo) {
      if (
        msg.body != "Mega Hair" &&
        msg.body != "Compra de Cabelo" &&
        msg.body != "Marcar horário" &&
        msg.body != "Vender meu Cabelo" &&
        msg.body != "Outros serviços"
      ) {
        client.sendMessage(
          msg.from,
          "Oiee! Muito prazer! Vou ajudar você por aqui!😉"
        );
        client.sendMessage(
          msg.from,
          "Antes de dar continuidade ao seu atendimento, pode me dizer seu nome? 😊"
        );
        atendendo = true;
      }
    }
    if (atendendo && cliente.nome != undefined && cliente.estado === 1) {
      var opcoes = [];

      opcoes = [
        { body: "Mega Hair" },
        { body: "Compra de Cabelo" },
        { body: "Marcar horário" },
      ];

      opcoes2 = [{ body: "Vender meu Cabelo" }, { body: "Outros serviços" }];

      let button1 = new Buttons(
        "Escolha a opção que deseja atendimento:",
        opcoes,
        `\nObrigado, ${cliente.nome}, agora eu sei o seu nome! É um prazer poder te ajudar.\n`
      );
      let button2 = new Buttons("\nVocê também pode escolher:", opcoes2);

      client.sendMessage(msg.from, button1);
      client.sendMessage(msg.from, button2);

      for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].numero === msg.from) {
          clientes[i].estado = 2;
          break;
        }
      }
      clientes = [...clientes];
    }
    if (atendendo && cliente.numero == msg.from && cliente.estado === 2) {
      if (msg.body == "Mega Hair") {
        client.sendMessage(
          msg.from,
          "Bem vinda ao melhor método de alongamento do Brasil.😍\nHoje nosso método consiste em te dar: \n✅segurança, ✅conforto e ✅discrição.\nO método Fagner Ribeiro consiste em 5 passos:\n1º seleção do cabelo,\n2ºpreparação,\n3º aplicação,\n4ºcuidado diário e\n5º retirada do megahair.\nNossos cabelos são 100% naturais🍀,\no que faz total diferença para o seu megahair."
        );
      }
      if (msg.body == "Compra de Cabelo") {
        client.sendMessage(msg.from, `AQUI VAI O TEXTO SOBRE COMPRA DE CABELO`);
      }
      if (msg.body == "Marcar horário") {
        client.sendMessage(msg.from, `AQUI VAI O TEXTO SOBRE MARCAR HORARIO`);
      }
      if (msg.body == "Vender meu Cabelo") {
        client.sendMessage(
          msg.from,
          `AQUI VAI O TEXTO SOBRE VENDER MEU CABELO`
        );
      }
      if (msg.body == "Outros serviços") {
        client.sendMessage(msg.from, `AQUI VAI O TEXTO SOBRE OUTROS SERVICOS`);
      }
    }
  }
});

client.initialize();
