const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const _ = request("lodash")

// // 定义入口url
// const homeUrl = "https://www.baidu.com";
// // 定义set存储已经访问过的路径，避免重复访问
// const set = new Set([homeUrl]);
function grab(url) {
  // 校验url规范性
  if (!url) return;
  // 去空格
  url = url.trim();
  // 自动补全url路径
  if (url.endsWith("/")) {
    url += "index.html";
  }
  const chunks = [];
  // url可能存在一些符号或者中文，可以通过encodeURI编码
  request(encodeURI(url))
    .on("error", (e) => {
      // 打印错误信息
      console.log(e);
    })
    .on("data", (chunk) => {
      // 接收响应内容
      chunks.push(chunk);
    })
    .on("end", () => {
      // 将相应内容转换成文本
      const html = Buffer.concat(chunks).toString();
      // 没有获取到内容
      if (!html) return;
      // 解析url
      let { host, origin, pathname } = new URL(url);
      pathname = decodeURI(pathname);
      // 通过cheerio解析html
      const $ = cheerio.load(html);
      // 将路径作为目录
      // const dir = path.dirname(pathname);
      // 创建目录
      // mkdirp.sync(path.join(__dirname, dir));
      // 往文件写入内容
      // fs.writeFile(path.join(__dirname, pathname), html, "utf-8", (err) => {
      //   // 打印错误信息
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }
      //   console.log(`[${url}]保存成功`);
      // });
      // 获取到页面中所有a元素
      const aTags = $("a");
      _.forEach(aTags, (aTag) => {
        // 获取到a标签中的路径
        const href = $(aTag).attr("href");
        console.log(href)
      })
      // Array.from(aTags).forEach((aTag) => {
      //   // 获取到a标签中的路径
      //   const href = $(aTag).attr("href");
      //   // 此处可以校验href的合法或者控制爬去的网站范围，比如必须都是某个域名下的
      //   // 排除空标签
      //   if (!href) return;
      //   // 排除锚点连接
      //   if (href.startsWith("#")) return;
      //   if (href.startsWith("mailto:")) return;
      //   // 如果不想要保存图片可以过滤掉
      //   // if (/\.(jpg|jpeg|png|gif|bit)$/.test(href)) return;
      //   // href必须是入口url域名
      //   let reg = new RegExp(`^https?:\/\/${host}`);
      //   if (/^https?:\/\//.test(href) && !reg.test(href)) return;
      //   // 可以根据情况增加更多逻辑
      //   let newUrl = "";
      //   if (/^https?:\/\//.test(href)) {
      //     // 处理绝对路径
      //     newUrl = href;
      //   } else {
      //     // 处理相对路径
      //     newUrl = origin + path.join(dir, href);
      //   }
      //   // 判断是否访问过
      //   if (set.has(newUrl)) return;
      //   if (newUrl.endsWith("/") && set.has(newUrl + "index.html")) return;
      //   if (newUrl.endsWith("/")) newUrl += "index.html";
      //   set.add(newUrl);
      //   grab(newUrl);
      // });
    });
}
// // 开始抓取
// grab(homeUrl);

export default grab