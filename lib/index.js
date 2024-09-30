var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/langchain/mould.js
var require_mould = __commonJS({
  "src/langchain/mould.js"(exports2, module2) {
    var { ChatOpenAI } = require("@langchain/openai");
    var { ChatAnthropic } = require("@langchain/anthropic");
    var { ChatVertexAI } = require("@langchain/google-vertexai");
    function getchatai(platform, moduleName, key, url, temperature) {
      if (platform == "custom") {
        const chatai = new ChatOpenAI({
          moduleName,
          //实际上是Gemini pro
          temperature,
          openAIApiKey: key,
          configuration: {
            basePath: url
          }
        });
        return chatai;
      } else if (platform == "openai") {
        const chatai = new ChatOpenAI({
          moduleName,
          temperature,
          openAIApiKey: key
        });
        return chatai;
      } else if (platform == "anthropic") {
        const chatai = new ChatAnthropic({
          moduleName,
          temperature,
          openAIApiKey: key
        });
        return chatai;
      } else if (platform == "google") {
        const chatai = new ChatVertexAI({
          moduleName,
          temperature,
          openAIApiKey: key
        });
        return chatai;
      }
    }
    __name(getchatai, "getchatai");
    module2.exports = getchatai;
  }
});

// src/langchain/loader.js
var require_loader = __commonJS({
  "src/langchain/loader.js"(exports2, module2) {
    var { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
    var { JSONLoader, JSONLinesLoader } = require("langchain/document_loaders/fs/json");
    var { TextLoader } = require("langchain/document_loaders/fs/text");
    var { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
    async function loaderdir() {
      try {
        const loader = new DirectoryLoader(
          "external/chatsun/src/langchain/prompt/knowledge",
          //读取路径写死" 
          //正常用"langchain/prompt/knowledge"，但koishi需用external/chatsun/src/langchain/prompt/knowledge",//读取路径写死
          {
            ".json": /* @__PURE__ */ __name((path) => new JSONLoader(path, "/texts"), ".json"),
            ".jsonl": /* @__PURE__ */ __name((path) => new JSONLinesLoader(path, "/html"), ".jsonl"),
            ".txt": /* @__PURE__ */ __name((path) => new TextLoader(path), ".txt")
            // ".csv": (path) => new CSVLoader(path, "text"),//不知道为啥用不了
          }
        );
        const docs = await loader.load();
        console.log(docs[0].pageContent);
        console.log("读取文件成功");
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 500,
          chunkOverlap: 50
        });
        const out = await splitter.splitDocuments(docs);
        return out;
      } catch (error) {
        console.log("文档加载分割失败");
        console.log(error);
      }
    }
    __name(loaderdir, "loaderdir");
    module2.exports = loaderdir;
  }
});

// src/langchain/emb.js
var require_emb = __commonJS({
  "src/langchain/emb.js"(exports2, module2) {
    var { OpenAIEmbeddings } = require("@langchain/openai");
    var { MemoryVectorStore } = require("langchain/vectorstores/memory");
    var loader = require_loader();
    function embtransform(url, key, moduleName, platform, batchSize) {
      console.log(url);
      if (platform == "custom") {
        const emb = new OpenAIEmbeddings({
          modelName: moduleName,
          openAIApiKey: key,
          batchSize
        });
        emb.clientConfig.baseURL = url;
        return emb;
      } else if (platform == "openai") {
        return new OpenAIEmbeddings({
          moduleName,
          openAIApiKey: key,
          batchSize
        });
      }
    }
    __name(embtransform, "embtransform");
    async function getemb2(url, key, moduleName, platform, batchSize, k) {
      try {
        const embedding = embtransform(url, key, moduleName, platform, batchSize);
        console.log("向量化方法创建成功");
        const docs = await loader();
        console.log("文档已经成功加载");
        console.log("正在进行向量化，请耐心等候.....中途不要进行其他操作");
        const vectorstore = await MemoryVectorStore.fromDocuments(
          docs,
          embedding
        );
        console.log("文档已成功向量化");
        const retriever = vectorstore.asRetriever({
          k,
          searchType: "similarity"
        });
        return retriever;
      } catch (error) {
        console.log("文档向量化错误");
        console.log(error);
      }
    }
    __name(getemb2, "getemb");
    module2.exports = getemb2;
  }
});

// src/langchain/message.js
var require_message = __commonJS({
  "src/langchain/message.js"(exports2, module2) {
    var { HumanMessage, SystemMessage, AIMessage, trimMessages } = require("@langchain/core/messages");
    var { StringOutputParser } = require("@langchain/core/output_parsers");
    var parser = new StringOutputParser();
    var messages = [];
    function makemessages(message) {
      if (message.type == "SystemMessage") {
        messages.push(new SystemMessage(`${message.content}`));
        return messages;
      } else if (message.type == "HumanMessage") {
        messages.push(new HumanMessage(`${message.content}`));
        return messages;
      } else if (message.type == "AIMessage") {
        messages.push(new AIMessage(`${message.content}`));
        return messages;
      }
    }
    __name(makemessages, "makemessages");
    async function resparse2(res) {
      const data = await parser.parse(res);
      return data;
    }
    __name(resparse2, "resparse");
    module2.exports = {
      messagehistory: makemessages,
      resparse: resparse2
    };
  }
});

// src/langchain/characterloader.js
var require_characterloader = __commonJS({
  "src/langchain/characterloader.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    function characterloader2(Path, fileName) {
      const folderPath = Path;
      relNmae = fileName + ".txt";
      try {
        const filePath = path.join(folderPath, relNmae);
        const content = fs.readFileSync(filePath, "utf-8");
        return content;
      } catch (error) {
        console.error(`读取文件 ${fileName} 时发生错误:`, error);
        throw error;
      }
    }
    __name(characterloader2, "characterloader");
    module2.exports = characterloader2;
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var import_koishi = require("koishi");
var getmould = require_mould();
var getemb = require_emb();
var { messagehistory, resparse } = require_message();
var characterloader = require_characterloader();
var name = "chatsun";
var Config = import_koishi.Schema.object({
  character: import_koishi.Schema.string().role("").description("角色人设文件名称"),
  presets: import_koishi.Schema.string().role("").description("预设文件名称，都不需要带后缀名"),
  llmurl: import_koishi.Schema.string().role("").description("模型api地址"),
  llmkey: import_koishi.Schema.string().role("").description("apikey"),
  llmmoduleName: import_koishi.Schema.string().role("").description("模型名称").default("gemini-1.5-pro-exp-0827"),
  llmplatform: import_koishi.Schema.union(["openai", "anthropic", "google", "custom"]).role("").description("模型所属平台,中转站请选择custom"),
  temperature: import_koishi.Schema.number().role("slider").min(0).max(1).step(0.01).default(0.7).description("温度"),
  embenable: import_koishi.Schema.boolean().description("是否启用嵌入模型"),
  emburl: import_koishi.Schema.string().role("").description("嵌入模型api地址"),
  embkey: import_koishi.Schema.string().role("").description("嵌入模型apikey"),
  embmoduleName: import_koishi.Schema.string().role("").description("嵌入模型模型名称,嘛，一般用默认值就好了，因为别的嵌入模型我可能没做").default("text-embedding-3-large"),
  embplatform: import_koishi.Schema.union(["openai", "custom"]).role("").description("嵌入模型模型所属平台,中转站请选择custom"),
  batchSize: import_koishi.Schema.number().role("").min(0).max(2048).step(1).default(256).description("分档分割的时候的大小,一般选择256或者512左右"),
  selectSize: import_koishi.Schema.number().role("").min(0).max(100).step(1).default(5).description("每次在向量数据库内调出的相关内容条数。")
});
async function apply(ctx, config) {
  const emb = await getemb(config.emburl, config.embkey, config.embmoduleName, config.embplatform, config.batchSize, config.selectSize);
  const ai = getmould(config.llmplatform, config.llmmoduleName, config.llmkey, config.llmurl, config.temperature);
  const character = characterloader("./external/chatsun/src/langchain/prompt/character", config.character);
  const presets = characterloader("./external/chatsun/src/langchain/prompt/presets", config.presets);
  ctx.on("message", async (session) => {
    const systemprompt = presets + character;
    const systemmessage = {
      type: "SystemMessage",
      content: systemprompt
    };
    messagehistory(systemmessage);
    let embdata = "";
    let embmessage = "";
    if (config.embenable) {
      embdata = await emb.invoke(session.content);
      embmessage = "以下内容为相关提示，提示不一定正确，进行分辨后使用：" + embdata;
    }
    const humanmessage = {
      type: "HumanMessage",
      content: session.content + embmessage
    };
    const allmessage = messagehistory(humanmessage);
    const res = await ai.invoke(allmessage);
    const clearres = res.content;
    console.log("解析后相应" + clearres);
    const aimessage = {
      type: "AIMessage",
      content: clearres
    };
    messagehistory(aimessage);
    session.send(clearres);
  });
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  name
});
