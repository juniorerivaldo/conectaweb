const qrcode = require("qrcode-terminal");
const { Client, Buttons, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: false },
});

client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});
let clientes = [];

client.on("message", async (msg) => {
  console.log("MESSAGE RECEIVED", msg);
  let chat = await msg.getChat();
  if (chat.isGroup) {
    console.log("MENSAGEM DE GRUPO NÃO RESPONDER");
    return;
  } else {
    //VERIFICAR SE A PESSOA TEM UMA CONTA ABERTA
    let cliente = clientes.find((element) => element.numero == msg.from);
    // iniciando opções antes do atendimento
    var opcoes = [];
    if (cliente && cliente.estado === "logado") {
      opcoes = [
        { body: "💻 ACESSAR MINHA CONTA 💻" },
        { body: "🧨 ENCERRAR CONTA 🧨" },
      ];
    } else {
      if (msg.body == "🚀 ABRIR CONTA 🚀" && !cliente) {
        cliente = {
          numero: msg.from,
          nome: msg._data.notifyName,
          estado: "novo",
        };
        clientes.push(cliente);
        opcoes = [{ body: "💻 ACESSAR MINHA CONTA 💻" }];
        client.sendMessage(
          msg.from,
          `💸 Parabéns, ${cliente.nome} Sua conta foi criada com sucesso.`
        );
      } else {
        opcoes = [{ body: "🚀 ABRIR CONTA 🚀" }];
      }
    }

    if (
      msg.body == "💻 ACESSAR MINHA CONTA 💻" &&
      cliente &&
      cliente.estado !== "logado"
    ) {
      cliente.estado = "logado";
      client.sendMessage(
        msg.from,
        ` Certo ${cliente.nome} ACESSANDO SUA CONTA....`
      );
    }

    if (
      msg.body == "🧨 ENCERRAR CONTA 🧨" &&
      cliente &&
      cliente.estado !== "logado"
    ) {
      clientes = clientes.filter((element) => element.numero !== msg.from);
      client.sendMessage(
        msg.from,
        `Certo ${cliente.nome} ENCERRANDO SUA CONTA....`
      );
    }
    let button = new Buttons(
      "O que deseja fazer agora?",
      opcoes,
      cliente && cliente.estado === "logado"
        ? ""
        : `🏛 Olá, ${msg._data.notifyName} Seja bem vindo(a) ao Ficticious Bank 🏛 apenas para fins didáticos`
    );

    client.sendMessage(msg.from, button);
  }
  // final do codigo de atendimento
});
