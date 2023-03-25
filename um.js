const qrcode = require("qrcode-terminal");
const { Client, Location, LocalAuth } = require("whatsapp-web.js");
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
  let mytimestamp = Math.floor(Date.now() / 1000);

  client.on("loading_screen", (percent) => {
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

  client.on(
    "message_create",
    async (msg) => {
      setTimeout(async function () {
        if (msg.timestamp + 5000 > mytimestamp) {
          if (!msg.fromMe) {
            let chat = await msg.getChat();
            if (chat.isGroup) {
              console.log(":: MENSAGEM DE GRUPO NÃO RESPONDER ::");
              return;
            }
            // verificar se já existe cadastro deste numero no array
            const clienteExistente = clientes.find(
              (cliente) => cliente.numero === msg.from
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

              client.sendMessage(
                msg.from,
                "Seja bem vinda! \nPara iniciar seu atendimento, qual o seu nome? 😊"
              );
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
                var opcoes = [];

                opcoes =
                  "1️⃣ - Mega Hair\n2️⃣ - Compra de Cabelo\n3️⃣ - Marcar horário\n";
                opcoes2 =
                  "4️⃣ - Vender meu Cabelo\n5️⃣ - Outros serviços\n*️⃣ - Localização do Salão\n#️⃣ - Encerrar atendimento";

                let button1 = "Escolha a opção que deseja atendimento:";
                let button2 = "\nVocê também pode escolher:";

                client.sendMessage(msg.from, button1);
                client.sendMessage(msg.from, opcoes);
                setTimeout(function () {
                  client.sendMessage(msg.from, button2);
                  client.sendMessage(msg.from, opcoes2);
                }, Math.floor(Math.random() * (2700 - 1450 + 1)) + 1450);
                clienteExistente.estado = 2;
              } else if (
                clienteExistente.nome === "" &&
                clienteExistente.estado === 0 &&
                clienteExistente.atendimentoManual === false &&
                msg.body === clienteExistente.ultimaMsg
              ) {
                client.sendMessage(msg.from, "Por favor digite seu nome");
              }
              if (
                clienteExistente.estado === 2 &&
                clienteExistente.atendimentoManual === false
              ) {
                switch (msg.body) {
                  case "1":
                    {
                      setTimeout(function () {
                        client.sendMessage(
                          msg.from,
                          "Bem vinda ao melhor método de alongamento do Brasil!💆‍♀️ \nHoje nosso método te oferece: \n✅ Segurança,\n✅ Conforto e\n✅ Discrição.\nO método Fagner Ribeiro consiste em 5 passos:\n1º seleção do cabelo,\n2º preparação,\n3º aplicação,\n4º cuidado diário e\n5º retirada do megahair. \nNossos cabelos são 100% naturais, o que faz total diferença para o seu megahair."
                        );
                      }, Math.floor(Math.random() * (2700 - 1450 + 1)) + 1450);
                    }
                    break;
                  case "2":
                    {
                      setTimeout(function () {
                        client.sendMessage(
                          msg.from,
                          "Encontre o cabelo ideal aqui! \nTrabalhamos somente com cabelos naturais, do Sul do Brasil 🌎 \n✅ Tipos de fios: finos e médios; \n✅ Tipos de cabelos: lisos, ondulados e cacheados; \n✅ Tamanho dos cabelos: curtos, médios e longos."
                        );
                      }, Math.floor(Math.random() * (2700 - 1450 + 1)) + 1450);
                    }
                    break;
                  case "3":
                    {
                      setTimeout(function () {
                        client.sendMessage(
                          msg.from,
                          "Em breve passarei os horários disponíveis."
                        );
                      }, Math.floor(Math.random() * (2700 - 1450 + 1)) + 1450);
                    }
                    break;
                  case "4":
                    {
                      setTimeout(function () {
                        client.sendMessage(
                          msg.from,
                          "Por favor me informe as características do seu cabelo, como tipo do fio, tipo do cabelo e tamanho."
                        );
                      }, Math.floor(Math.random() * (2700 - 1450 + 1)) + 1450);
                    }
                    break;
                  case "5":
                    {
                      setTimeout(function () {
                        client.sendMessage(
                          msg.from,
                          "Contamos com uma equipe incrível para te atender, abaixo alguns dos nossos serviços: \n✅ Alisamento; \n✅ Hidratação; \n✅ Mechas; \n✅ Corte."
                        );
                      }, Math.floor(Math.random() * (2700 - 1450 + 1)) + 1450);
                    }
                    break;
                }
                if (msg.body == "*") {
                  let location = `https://maps.google.com/maps?q=${-26.3084304},${-48.8402246}&z=17&hl=en`;
                  client.sendMessage(msg.from, location);
                }

                if (msg.body == "#") {
                  clienteExistente.estado = 3;
                  let opcoesFinais =
                    "6️⃣ - Muito satisfeita\n7️⃣ - Satisfeita\n8️⃣ - Insatisfeita\n9️⃣ - Muito insatisfeita\n";
                  let textoFinal =
                    "Gostaríamos de saber sua opinião sobre o atendimento recebido. \nPor favor, clique em uma das opções abaixo para avaliar nossa equipe. \nSua opinião é muito importante para nós.";

                  client.sendMessage(msg.from, textoFinal);
                  setTimeout(function () {
                    client.sendMessage(msg.from, opcoesFinais);
                  }, Math.floor(Math.random() * (2700 - 1450 + 1)) + 1450);
                }
                console.log(clienteExistente.estado);
                if (clienteExistente.estado === 3) {
                  console.log("cheguei aqui");

                  if (msg.body == "6") {
                    client.sendMessage(
                      msg.from,
                      "Atendimento encerrado. Obrigado!"
                    );
                    // const index = clientes.findIndex(
                    //   (c) => c.numero === msg.from
                    // );
                    // clientes.splice(index, 1);
                  }
                  if (msg.body == "7") {
                    client.sendMessage(
                      msg.from,
                      "Atendimento encerrado. Obrigado!"
                    );
                    const index = clientes.findIndex(
                      (c) => c.numero === msg.from
                    );
                    clientes.splice(index, 1);
                  }
                  if (msg.body == "8") {
                    client.sendMessage(
                      msg.from,
                      "Atendimento encerrado. Obrigado!"
                    );
                    const index = clientes.findIndex(
                      (c) => c.numero === msg.from
                    );
                    clientes.splice(index, 1);
                  }
                  if (msg.body == "9") {
                    client.sendMessage(
                      msg.from,
                      "Atendimento encerrado. Obrigado!"
                    );
                    const index = clientes.findIndex(
                      (c) => c.numero === msg.from
                    );
                    clientes.splice(index, 1);
                  }
                }
              }
            }
          }
          // mensagem inicial minha
          else {
            console.log("MINHA MSG");
            const clienteExistente = clientes.find(
              (cliente) => cliente.numero === msg.to
            );
            if (!clienteExistente) {
              console.log("CLIENTE QUE ESTOU ENVIANDO MSG NOVO");
              const novoCliente = {
                numero: msg.to,
                nome: "",
                estado: 0,
                ultimaMsg: "",
                atendimentoManual: true,
              };
              clientes.push(novoCliente);
            }
          }
        } else {
          console.log("MSG ANTIGA NAO RESPONDER");
        }
      });
    },
    Math.floor(Math.random() * (2700 - 1450 + 1)) + 1450
  );
  client.initialize();
};
