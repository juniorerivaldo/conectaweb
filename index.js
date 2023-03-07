const { Client, Buttons, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

var clientes = [];

//criar nosso client para rodar local
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("deu tudo certo! estamos conectados...");
});

client.on("message", (msg) => {
  console.log(`nova mensagem: ${msg.body} from: ${msg.from}`);

  //VERIFICAR SE A PESSOA TEM UMA CONTA ABERTA
  const encontrado = clientes.find((element) => element.numero == msg.from);
  console.log(encontrado);

  if (msg.body === "Atendimento") {
    if (!encontrado) {
      var cliente = {
        numero: msg.from,
        nome: msg.sender.pushname || msg.sender.verifiedName,
        momento: 0,
        destino: 0,
      };
      clientes.push(cliente);
      client.sendMessage(
        msg.from,
        `Olá, ${cliente.nome} Obrigado por entrar em contato com Fagner Ribeiro.`
      );
    } else {
      let button = new Buttons(
        "O que deseja fazer neste atendimento?",
        [
          { body: "MegaHair" },
          { body: "Manutenção" },
          { body: "Vender Cabelo" },
          { body: "Finalizar Atendimento" },
        ],
        `Atendimento em andamento.. ${
          msg.sender.pushname || msg.sender.verifiedName
        } 🏛`
      );
      client.sendMessage(msg.from, button);
    }
  } else {
    // Caso não seja a opção Atendimento, verificamos se o cliente existe
    if (encontrado) {
      if (msg.body === "Finalizar Atendimento") {
        //BUSCO O INDÍCE A SER REMOVIDO
        let index = clientes.findIndex(
          (cliente) => cliente.numero === msg.from
        );
        //REMOVER O ELEMENTO DO ARRAY
        clientes.splice(index, 1);
        client.sendMessage(
          msg.from,
          `Obrigado pelo contato, estamos a disposição..`
        );
      } else if (
        msg.body === "MegaHair" ||
        msg.body === "Manutenção" ||
        msg.body === "Vender Cabelo"
      ) {
        encontrado.momento = 1;
        client.sendMessage(
          msg.from,
          `💸 ${encontrado.nome} Opção ${msg.body} texto aqui...`
        );
      }
    } else {
      // Caso não exista, só disponibilizamos a opção Atendimento
      let button = new Buttons(
        "O que deseja fazer agora?",
        [{ body: "Atendimento" }],
        `Olá, ${
          msg.sender.pushname || msg.sender.verifiedName
        } Seja bem vindo(a) ao Salão Havan..`
      );
      client.sendMessage(msg.from, button);
    }
  }
});

client.initialize();
