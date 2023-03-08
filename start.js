const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { handleSIGINT: false },
});

// This now works, and waits until the client is destroyed before exiting.
process.on("SIGINT", async () => {
  console.log("(SIGINT) Shutting down...");
  await this.client.destroy();
  console.log("client destroyed");
  process.exit(0);
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true })
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.initialize();
