import cheerio from "cheerio";
import axios from "axios";
import express from "express";
import cors from "cors";

type DataPayload = {
  floorPrice: string;
  change24h: string;
  marketCap: string;
  vol24h: string;
  owners: string;
  owners24h: string;
  totalAssets: string;
};

const fetchNFTData = async () => {
  const url = `https://www.coingecko.com/en/nft`;
  const html = await axios.get(url).then((res) => res.data);

  const $ = cheerio.load(html);

  const result: Record<string, DataPayload> = {};

  for (let i = 1; i < 100; i++) {
    const wrapper = $(
      `body > div.container > div.gecko-table-container > div.coingecko-table > div > div > table > tbody  > tr:nth-child(${i})`
    );

    const dataList = wrapper
      .text()
      .split("\n")
      .filter((t) => t != "");

    const name = dataList[1];

    result[name] = {
      floorPrice: dataList[2],
      change24h: dataList[3],
      marketCap: dataList[4],
      vol24h: dataList[5],
      owners: dataList[6],
      owners24h: dataList[7],
      totalAssets: dataList[8],
    };
  }

  return result;
};

const app = express();
const PORT = 4200;
app.use(cors());

app.get("/", async (req: express.Request, res: express.Response) => {
  const result = await fetchNFTData();
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
