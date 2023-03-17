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
    puppeteer: { headless: false ,args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu'] },
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
  let clientes = [];

  client.on("message", async (msg) => {
    let chat = await msg.getChat();
    if (chat.isGroup) {
      console.log(":: MENSAGEM DE GRUPO NÃO RESPONDER ::");
      return;
    }

    let cliente = clientes.find((c) => c.numero === msg.from);

    if (!cliente) {
      cliente = { nome: "", estado: 0, numero: msg.from, ultimaMsg: msg.body };
      clientes.push(cliente);
    }

    if (cliente.estado === 0) {
      client.sendMessage(
        msg.from,
        "Seja bem vinda! \nPara iniciar seu atendimento, qual o seu nome? 😊"
      );
      cliente.estado = 1;
    } else if (cliente.estado === 1) {
      if (cliente.nome == "" && msg.body != cliente.ultimaMsg) {
        cliente.nome = msg.body;
        var opcoes = [];

        opcoes = [
          { body: "Mega Hair" },
          { body: "Compra de Cabelo" },
          { body: "Marcar horário" },
        ];

        opcoes2 = [
          { body: "Vender meu Cabelo" },
          { body: "Outros serviços" },
          { body: "Encerrar atendimento" },
        ];

        let button1 = new Buttons(
          "Escolha a opção que deseja atendimento:",
          opcoes,
          `Olá, ${cliente.nome}! É um prazer poder te ajudar.`
        );
        let button2 = new Buttons("\nVocê também pode escolher:", opcoes2);

        client.sendMessage(msg.from, button1);
        setTimeout(function () {
          client.sendMessage(msg.from, button2);
        }, 1000);
      } else if (cliente.nome == "" && msg.body === cliente.ultimaMsg) {
        client.sendMessage(msg.from, "Por favor digite seu nome");
      } else {
        if (msg.body == "Mega Hair") {
          client.sendMessage(
            msg.from,
            "Bem vinda ao melhor método de alongamento do Brasil!💆‍♀️ \nHoje nosso método te oferece: \n✅ Segurança,\n✅ Conforto e\n✅ Discrição.\nO método Fagner Ribeiro consiste em 5 passos:\n1º seleção do cabelo,\n2º preparação,\n3º aplicação,\n4º cuidado diário e\n5º retirada do megahair. \nNossos cabelos são 100% naturais, o que faz total diferença para o seu megahair."
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
        if (msg.body == "Encerrar atendimento") {
          // novo bloco
          const index = clientes.findIndex((c) => c.numero === msg.from);
          clientes.splice(index, 1);
          client.sendMessage(msg.from, "Atendimento encerrado. Obrigado!");
        }

        cliente.estado = 1;
      }
    }
  });
};
