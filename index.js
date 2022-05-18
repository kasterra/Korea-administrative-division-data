const fs = require("fs");
const { parse } = require("csv-parse");

let obj = {};

fs.createReadStream("./address.csv")
  .pipe(parse())
  .on("data", (row) => {
    const groups =
      /(?<do>[^도]*도 )?((?<si>[^시]*시) )(?<gu>(.[^구]*구|.[^군]*군|.[^동]*동|.[^군]*군))/.exec(
        String(row)
      )?.groups;
    if (!groups) return;
    if (!groups.do) {
      if (!obj[groups.si]) obj[groups.si] = [];
      if (typeof obj[groups.si] === "object")
        if (!obj[groups.si].includes(groups.gu)) obj[groups.si].push(groups.gu);
    } else {
      if (!obj[groups.do]) obj[groups.do] = {};
      if (typeof obj[groups.do] === "object") {
        if (!obj[groups.do][groups.si]) {
          obj[groups.do][groups.si] = [];
        }
        if (!obj[groups.do][groups.si].includes(groups.gu))
          obj[groups.do][groups.si].push(groups.gu);
      }
    }
  })
  .on("end", () =>
    fs.writeFile("outputJson.json", JSON.stringify(obj), "utf-8", (err) =>
      console.log(err)
    )
  );
