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
    puppeteer: {
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
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
  let clientes = [];

  client.on("message_create", async (msg) => {


    
    console.log(clientes);
    if (!msg.fromMe) {
      // verificar se já existe cadastro deste numero no array
      const clienteExistente = clientes.find(
        (cliente) =>
          cliente.numero === msg.from && cliente.atendimentoManual === false
      );
      // se nao existir cadastrar
      if (!clienteExistente) {
        const novoCliente = {
          numero: msg.from,
          nome: "",
          estado: 0,
          ultimaMsg: msg.body,
          atendimentoManual: false,
        };
        clientes.push(novoCliente);
        console.log(`Novo cliente adicionado: ${novoCliente}`);
        client.sendMessage(msg.from, "Olá! Qual o seu nome?");
      } else {
        // se o cliente ainda nao tiver nome cadastrado cadastrar agora
        if (
          clienteExistente.nome === "" &&
          clienteExistente.estado === 0 &&
          clienteExistente.atendimentoManual === false &&
          msg.body !== clienteExistente.ultimaMsg
        ) {
          clienteExistente.nome = msg.body;
          clienteExistente.estado = 1;
          client.sendMessage(
            msg.from,
            `Olá, ${clienteExistente.nome}! Como posso ajudá-lo?`
          );
        } else if (
          clienteExistente.nome === "" &&
          clienteExistente.estado === 0 &&
          clienteExistente.atendimentoManual === false &&
          msg.body === clienteExistente.ultimaMsg
        ) {
          client.sendMessage(msg.from, "por favor digite seu nome?");
        }
      }
    }
    // mensagem inicial minha
    else {
      console.log("MINHA MSG");
    }
  });
  client.initialize();
};
