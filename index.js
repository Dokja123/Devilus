const { default: makeWASocket, useSingleFileAuthState } = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");

// Charger la configuration
const config = require("./config.json");

// Charger l'état de la session
const { state, saveState } = useSingleFileAuthState(config.sessionFile);

// Fonction principale
const startBot = () => {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // Affiche le QR Code pour scanner
  });

  // Sauvegarder l'état de la session
  sock.ev.on("creds.update", saveState);

  // Gérer les messages entrants
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type === "notify") {
      const message = messages[0];
      if (!message.message) return;

      const sender = message.key.remoteJid;
      const text = message.message.conversation || message.message.extendedTextMessage?.text || "";

      console.log(`Message reçu de ${sender}: ${text}`);

      // Vérifier le préfixe
      if (text.startsWith(config.prefix)) {
        const command = text.slice(config.prefix.length).trim().split(" ")[0].toLowerCase();

        // Commandes simples
        if (command === "ping") {
          await sock.sendMessage(sender, { text: "Pong!" });
        } else if (command === "help") {
          await sock.sendMessage(sender, {
            text: "Voici les commandes disponibles :\n- !ping : Vérifiez si le bot est en ligne\n- !help : Affiche cette aide",
          });
        } else {
          await sock.sendMessage(sender, { text: "Commande non reconnue. Tapez !help pour voir les options." });
        }
      }
    }
  });

  // Gérer les déconnexions
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connexion fermée. Reconnexion :", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("Bot connecté avec succès !");
    }
  });
};

startBot();