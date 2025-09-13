import express from "express";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import handleMessage, { assignRole } from "./messages";
import handleReaction, { removeRole } from "./reactions";
import { getPseudoState } from "./pseudoState";

const port = 5049;

const moduleRegistration = {
  id: "example",
  uuid: uuidv4(),
  url: `http://localhost:${port}`,
  emoji: "👍",
  wake_word: "example",
  title: "Example App",
  description: "This module manages a list of roles",
  event_types: [
    "m.room.message",
    "m.reaction"
  ]
}

function generateRegistrationFile() {
  fs.writeFileSync(`./${moduleRegistration.id}.json`, JSON.stringify(moduleRegistration));
}

async function start() {

  const app = express();
  app.use(express.json());
  app.use("/", express.static("web/dist/index.html"));

  app.get("/", async (req, res) => {
    const htmlPath = path.resolve(__dirname, "../../web/dist/index.html")

    fs.readdir("/", (e, res) => {
      console.log(res)
    })

    console.log(htmlPath)

    res.sendFile(htmlPath);
  })

  app.post("/", async (req, res) => {
    const { event, botUserId } = req.body;

    console.log(event)
    let response = {};

    if (event.type === "m.room.message")
      response = await handleMessage(event, botUserId);

    if (event.type === "m.reaction")
      response = await handleReaction(event, botUserId);

    console.log(response)

    res.send({ success: true, response });
  });

  app.get("/api/state", async (req, res) => {
    const { roomId } = req.query;

    const state = await getPseudoState(roomId as string);

    res.send(state || { assignedRoles: [] });
  })

  app.post("/api/role", async (req, res) => {
    const { roomId } = req.query;
    const { personName, roleName } = req.body;

    await assignRole(personName, roomId as string, roleName);

    res.send({ success: true })
  })

  app.delete("/api/role", async (req, res) => {
    const { roomId, roleId } = req.query;

    await removeRole(roomId as string, roleId as string);

    res.send({ success: true });
  })

  app.listen(port);
};

generateRegistrationFile();
start();
