require('dotenv').config();

const cron = require("node-cron");
const axios = require('axios').default;
const moment = require("moment");

var numberOfDay = moment().diff(moment().startOf('year'), 'days', false) + 1;

const bodyPageToPatch = {
  "properties": {
    "title": {
      "id": "title",
      "type": "title",
      "title": [{
        "type": "text",
        "text": {
          "content": `Hoje é dia: ${numberOfDay}->(${moment().format("DD/MM/YYYY HH:mm")})`,
          "link": null
        }
      }]
    }
  }
}

const options = {
  headers: {
    'Notion-Version': '2022-02-22',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NOTION_KEY}` 
  }
}

async function patchTitleNotionPage(pageId, body, options) {
  let url = 'https://api.notion.com/v1/pages/'+ pageId
  try {
    const response = await axios.patch(url,body,options);
    console.log(`Atualizacao de data enviada para o notion ${bodyPageToPatch.properties.title.title.at(0).text.content} response ${response.status}`);
  } catch (error) {
    console.error("Aconteceu um erro durante a atualizacao diaria do processo.");
    console.error(error);
  }
}

console.log("Cron Iniciado!")
console.log(process.env.CRON_PATCH_PAGE);

cron.schedule(process.env.CRON_PATCH_PAGE, () => {
  console.log("Executando a tarefa a cada 1 minuto");
  patchTitleNotionPage(process.env.PAGE_ID_FROM_UPDATE, bodyPageToPatch, options);
});