"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToElasticsearch = saveToElasticsearch;
const elasticsearch_1 = require("@elastic/elasticsearch");
const esClient = new elasticsearch_1.Client({ node: "http://localhost:9200" });
function saveToElasticsearch(email) {
    return __awaiter(this, void 0, void 0, function* () {
        yield esClient.index({
            index: "emails",
            document: {
                subject: email.subject,
                body: email.body,
                category: email.category,
                timestamp: new Date(),
            },
        });
        console.log(`Email stored in Elasticsearch: ${email.subject}`);
    });
}
