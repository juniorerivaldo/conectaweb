const qrcode = require("qrcode-terminal");
const { Client, Buttons, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");

const email = "fagnerribero@gmail.com";
let userAuth = {};
console.log(":: INICIANDO SISTEMA ::");

axios
  .post("https://cafecomcodigo.com.br/find_cliente.php", {
    email,
  })
  .then((response) => {
    console.log(":: AUTENTICANDO SEU ACESSO NO SERVIDOR ::");
    userAuth = response.data;
    if (userAuth.status == "ativo") {
      console.log(`:: ACESSO LIBERADO PARA: ${userAuth.name} ::`);
      botStart();
    } else {
      console.log(
        `:: ERRO AO INICIAR SISTEMA PARA : ${userAuth.name} ENTRE EM CONTATO COM ADM ::`
      );
    }
  })
  .catch((error) => {
    console.log(error);
  });

botStart = function () {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });

  client.initialize();

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
            "Olá! Seja bem vinda! \nPara iniciar seu atendimento, qual o seu nome? 😊"
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
          `\nObrigado, ${cliente.nome}! É um prazer poder te ajudar.`
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
            "Bem vinda ao melhor método de alongamento do Brasil!💆‍♀️ \nHoje nosso método te oferece: \n✅segurança, ✅conforto e ✅discrição.\nO método Fagner Ribeiro consiste em 5 passos:\n1º seleção do cabelo,\n2º preparação,\n3º aplicação,\n4º cuidado diário e\n5º retirada do megahair. \nNossos cabelos são 100% naturais, o que faz total diferença para o seu megahair."
          );
        }
        if (msg.body == "Compra de Cabelo") {
          client.sendMessage(
            msg.from,
            "Encontre o cabelo ideal aqui! \nTrabalhamos somente com cabelos naturais, do Sul do Brasil 🌎 \n✅ Tipos de fios: finos e médios; \n✅ Tipos de cabelos: lisos, ondulados e cacheados; \n✅ Tamanho dos cabelos: curtos, médios e longos."
          );
        }
        if (msg.body == "Marcar horário") {
          client.sendMessage(
            msg.from,
            "Em breve passarei os horários disponíveis."
          );
        }
        if (msg.body == "Vender meu Cabelo") {
          client.sendMessage(
            msg.from,
            "Por favor me informe as características do seu cabelo, como tipo do fio, tipo do cabelo e tamanho."
          );
        }
        if (msg.body == "Outros serviços") {
          client.sendMessage(
            msg.from,
            "Contamos com uma equipe incrível para te atender, abaixo alguns dos nossos serviços: \n✅ Alisamento; \n✅ Hidratação; \n✅ Mechas; \n✅ Corte."
          );
        }
      }
    }
  });
};
