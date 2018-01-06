const request = require("request-promise-native");
const cheerio = require("cheerio");

module.exports = class Scraper {
    static extractText($) {
        // return $.clone().children().remove().end().text();
        return $.text().trim();
    }

    constructor(url, descriptor) {
        this._url = url;
        this._descriptor = descriptor;
    }

    async execute() {
        const data = await request({
            url: this._url,
            method: "GET"
        });

        this.$ = cheerio.load(data);
        return this.executeStep(this.$.root(), this._descriptor);
    }

    async executeStep($, context, preventContextSwitch) {
        const result = {};

        if (context["$"] && !preventContextSwitch) {
            $ = $.find(context["$"]);
        }

        for (const key of Object.keys(context).filter(e => e.indexOf("$") !== 0)) {
            const element = context[key];

            if (typeof element === "string") {
                result[key] = Scraper.extractText($.find(element));
            }
            else if (element instanceof Array) {
                if (element.length === 1 && typeof element[0] === "object") {
                    const nested = element[0];

                    if (!nested["$"]) {
                        throw new Error("Missing array element context id");
                    }

                    $.find(nested["$"]).each(async (i, e) => {
                        if (!result[key]) {
                            result[key] = [];
                        }

                        result[key].push(await this.executeStep(this.$(e), nested, true));
                    });
                }
                else {
                    result[key] = element.reduce((acc, e) => {
                        if (e.indexOf("!") === 0) {
                            return e;
                        }
                        else {
                            return this.executeStep($.find(e));
                        }
                    }, "");
                }
            }
            else {
                result[key] = this.executeStep($, element);
            }
        }

        return result;
    }
};