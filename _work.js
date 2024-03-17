let mytoken= 'auto'; // 快速订阅访问入口, 留空则不启动快速订阅
let BotToken ='YOUR_TELEGRAM_BOT_TOKEN';
let ChatID ='YOUR_TELEGRAM_CHAT_ID'; 

async function sendMessage(type, ip, add_data = "") {
    if (BotToken !== '' && ChatID !== ''){
        let msg = "";
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
        if (response.status == 200) {
            const ipInfo = await response.json();
            msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
        } else {
            msg = `${type}\nIP: ${ip}\n<tg-spoiler>${add_data}`;
        }

        let url = "https://api.telegram.org/bot"+ BotToken +"/sendMessage?chat_id=" + ChatID + "&parse_mode=HTML&text=" + encodeURIComponent(msg);
        return fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
            }
        });
    }
}

async function getAddressesapi() {
    if (!addressesapi || addressesapi.length === 0) {
        return [];
    }
    
    let newAddressesapi = [];
    
    for (const apiUrl of addressesapi) {
        try {
            const response = await fetch(apiUrl);
        
            if (!response.ok) {
                console.error('获取地址时出错:', response.status, response.statusText);
                continue;
            }
        
            const text = await response.text();
            let lines;
            if (text.includes('\r\n')){
                lines = text.split('\r\n');
            } else {
                lines = text.split('\n');
            }
            const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(#.*)?$/;
        
            const apiAddresses = lines.map(line => {
                const match = line.match(regex);
                return match ? match[0] : null;
            }).filter(Boolean);
        
            newAddressesapi = newAddressesapi.concat(apiAddresses);
        } catch (error) {
            console.error('获取地址时出错:', error);
            continue;
        }
    }
    
    return newAddressesapi;
}

async function getAddressescsv() {
    if (!addressescsv || addressescsv.length === 0) {
        return [];
    }
    
    let newAddressescsv = [];
    
    for (const csvUrl of addressescsv) {
        try {
            const response = await fetch(csvUrl);
        
            if (!response.ok) {
                console.error('获取CSV地址时出错:', response.status, response.statusText);
                continue;
            }
        
            const text = await response.text();// 使用正确的字符编码解析文本内容
            let lines;
            if (text.includes('\r\n')){
                lines = text.split('\r\n');
            } else {
                lines = text.split('\n');
            }
        
            // 检查CSV头部是否包含必需字段
            const header = lines[0].split(',');
            const tlsIndex = header.indexOf('TLS');
            const speedIndex = header.length - 1; // 最后一个字段
        
            const ipAddressIndex = 0;// IP地址在 CSV 头部的位置
            const portIndex = 1;// 端口在 CSV 头部的位置
            const dataCenterIndex = tlsIndex + 1; // 数据中心是 TLS 的后一个字段
        
            if (tlsIndex === -1) {
                console.error('CSV文件缺少必需的字段');
                continue;
            }
        
            // 从第二行开始遍历CSV行
            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split(',');
        
                // 检查TLS是否为"TRUE"且速度大于DLS
                if (columns[tlsIndex].toUpperCase() === 'TRUE' && parseFloat(columns[speedIndex]) > DLS) {
                    const ipAddress = columns[ipAddressIndex];
                    const port = columns[portIndex];
                    const dataCenter = columns[dataCenterIndex];
            
                    const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;
                    newAddressescsv.push(formattedAddress);
                }
            }
        } catch (error) {
            console.error('获取CSV地址时出错:', error);
            continue;
        }
    }
    
    return newAddressescsv;
}

let DLS = 4; // 速度下限
let addresses = [
    'icook.tw:2053#优选域名',
    'cloudflare.cfgo.cc#优选官方线路',
];
let addressesapi = [
    'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt' //可参考内容格式 自行搭建。
];
let addressescsv = [
    //'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv' //iptest测速结果文件。
];
let subconverter = "api.v1.mk"; // 在线订阅转换后端，目前使用肥羊的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
let subconfig = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"; // 订阅配置文件
let link = '';
let edgetunnel = 'ed';
let RproxyIP = 'false';
let proxyIPs = [
    'proxyip.aliyun.fxxk.dedyn.io',
    'proxyip.multacom.fxxk.dedyn.io',
    'proxyip.vultr.fxxk.dedyn.io',
];
let CMproxyIPs = [
    { proxyIP: "proxyip.fxxk.dedyn.io", type: "HK" },
];
let proxyhosts = [ // 本地代理域名池
    //'ppfv2tl9veojd-maillazy.pages.dev',
];
let proxyhostsURL = 'https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/proxyhosts'; // 在线代理域名池URL
let EndPS = ''; // 节点名备注内容
let FileName = 'WorkerVless2sub';
let SUBUpdateTime = 6; 
let total = 99; // PB
let timestamp = 410232960
async function getAddressesapi() {
    if (!addressesapi || addressesapi.length === 0) {
        return [];
    }
    
    let newAddressesapi = [];
    
    for (const apiUrl of addressesapi) {
        try {
            const response = await fetch(apiUrl);
        
            if (!response.ok) {
                console.error('获取地址时出错:', response.status, response.statusText);
                continue;
            }
        
            const text = await response.text();
            let lines;
            if (text.includes('\r\n')){
                lines = text.split('\r\n');
            } else {
                lines = text.split('\n');
            }
            const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(#.*)?$/;
        
            const apiAddresses = lines.map(line => {
                const match = line.match(regex);
                return match ? match[0] : null;
            }).filter(Boolean);
        
            newAddressesapi = newAddressesapi.concat(apiAddresses);
        } catch (error) {
            console.error('获取地址时出错:', error);
            continue;
        }
    }
    
    return newAddressesapi;
}

async function getAddressescsv() {
    if (!addressescsv || addressescsv.length === 0) {
        return [];
    }
    
    let newAddressescsv = [];
    
    for (const csvUrl of addressescsv) {
        try {
            const response = await fetch(csvUrl);
        
            if (!response.ok) {
                console.error('获取CSV地址时出错:', response.status, response.statusText);
                continue;
            }
        
            const text = await response.text();// 使用正确的字符编码解析文本内容
            let lines;
            if (text.includes('\r\n')){
                lines = text.split('\r\n');
            } else {
                lines = text.split('\n');
            }
        
            // 检查CSV头部是否包含必需字段
            const header = lines[0].split(',');
            const tlsIndex = header.indexOf('TLS');
            const speedIndex = header.length - 1; // 最后一个字段
        
            const ipAddressIndex = 0;// IP地址在 CSV 头部的位置
            const portIndex = 1;// 端口在 CSV 头部的位置
            const dataCenterIndex = tlsIndex + 1; // 数据中心是 TLS 的后一个字段
        
            if (tlsIndex === -1) {
                console.error('CSV文件缺少必需的字段');
                continue;
            }
        
            // 从第二行开始遍历CSV行
            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split(',');
        
                // 检查TLS是否为"TRUE"且速度大于DLS
                if (columns[tlsIndex].toUpperCase() === 'TRUE' && parseFloat(columns[speedIndex]) > DLS) {
                    const ipAddress = columns[ipAddressIndex];
                    const port = columns[portIndex];
                    const dataCenter = columns[dataCenterIndex];
            
                    const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;
                    newAddressescsv.push(formattedAddress);
                }
            }
        } catch (error) {
            console.error('获取CSV地址时出错:', error);
            continue;
        }
    }
    
    return newAddressescsv;
}

let protocol;
export default {
    async fetch (request, env) {
        mytoken = env.TOKEN || mytoken;
        BotToken = env.TGTOKEN || BotToken;
        ChatID = env.TGID || ChatID; 
        subconverter = env.SUBAPI || subconverter;
        subconfig = env.SUBCONFIG || subconfig;
        const userAgentHeader = request.headers.get('User-Agent');
        const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
        const url = new URL(request.url);
        const format = url.searchParams.get('format') ? url.searchParams.get('format').toLowerCase() : "null";
        let host = "";
        let uuid = "";
        let path = "";
        let UD = Math.floor(((timestamp - Date.now())/timestamp * 99 * 1099511627776 * 1024)/2);
        total = total * 1099511627776 * 1024;
        let expire= Math.floor(timestamp / 1000) ;

        if (mytoken !== '' && url.pathname.includes(mytoken)) {
            host = env.HOST || "edgetunnel-2z2.pages.dev";
            uuid = env.UUID || "30e9c5c8-ed28-4cd9-b008-dc67277f8b02";
            path = env.PATH || "/?ed=2048";
            edgetunnel = env.ED || edgetunnel;
            RproxyIP = env.RPROXYIP || RproxyIP;

            const hasSos = url.searchParams.has('sos');
            if (hasSos) {
                const hy2Url = "https://hy2sub.pages.dev";
                try {
                    const subconverterResponse = await fetch(hy2Url);
    
                    if (!subconverterResponse.ok) {
                        throw new Error(`Error fetching lzUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
                    }
    
                    const base64Text = await subconverterResponse.text();
                    link = atob(base64Text); // 进行 Base64 解码
    
                } catch (error) {
                    // 错误处理
                }	
            }
            await sendMessage("#获取订阅", request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
        } else {
            host = url.searchParams.get('host');
            uuid = url.searchParams.get('uuid');
            path = url.searchParams.get('path');
            edgetunnel = url.searchParams.get('edgetunnel') || edgetunnel;
            RproxyIP = url.searchParams.get('proxyip') || RproxyIP;
            
            if (!url.pathname.includes("/sub")) {
                const responseText = `
            路径必须包含 "/sub"
            The path must contain "/sub"
            مسیر باید شامل "/sub" باشد
            
            ${url.origin}/sub?host=[your host]&uuid=[your uuid]&path=[your path]
            
            
            
            
            
            
                
                https://github.com/cmliu/WorkerVless2sub
                `;
            
                return new Response(responseText, {
                status: 400,
                headers: { 'content-type': 'text/plain; charset=utf-8' },
                });
            }
            
            if (!host || !uuid) {
                const responseText = `
            缺少必填参数：host 和 uuid
            Missing required parameters: host and uuid
            پارامترهای ضروری وارد نشده: هاست و یوآی‌دی
            
            ${url.origin}/sub?host=[host]&uuid=[your uuid]&path=[your path]
            
            
            
            
            
            
                
                https://github.com/cmliu/WorkerVless2sub
                `;
            
                return new Response(responseText, {
                status: 400,
                headers: { 'content-type': 'text/plain; charset=utf-8' },
                });
            }
        }
    
        if (url.pathname.includes("vless")) {
            protocol = "vless";
        } else if (url.pathname.includes("vmess")) {
            protocol = "vmess";
        } else if (url.pathname.includes("trojan")) {
            protocol = "trojan";
        } else {
            protocol = "vmess";
        }
        
        let NewAddresses = addresses.concat(await getAddressescsv()).concat(await getAddressesapi());
    
        let configLink = '';
        if (subconfig) {
            configLink = `<a href="${subconfig}">配置文件</a>`;
        }
    
        let dlLink = '';
        if (link) {
            dlLink = `<a href="${link}">Download</a>`;
        }
    
        let proxyPool = proxyIPs;
        if (RproxyIP === 'true') {
            proxyPool = proxyPool.concat(CMproxyIPs.map(e => e.proxyIP));
        }
        
        const proxies = proxyPool.map(proxy => {
            return `[${proxy}](https://github.com/cmliu/WorkerVless2sub/blob/main/${proxy})`;
        }).join(' | ');

        let proxyhostsPool = proxyhosts;
        if (format !== "null") {
            const proxyhostsResponse = await fetch(proxyhostsURL);
    
            if (proxyhostsResponse.ok) {
                const text = await proxyhostsResponse.text();
                proxyhostsPool = text.split('\n');
            }
        }
    
        let proxyHosts = proxyhostsPool.map(proxyhost => {
            return `[${proxyhost}](https://github.com/cmliu/WorkerVless2sub/blob/main/${proxyhost})`;
        }).join(' | ');
        
        const re = /(\S+\.workers\.dev)/i;
        let subc = '';
        if (subconverter && re.test(subconverter)) {
            subc = `<a href="https://${subconverter}/?url=${url.origin}/sub">${subconverter}</a>`;
        } else {
            subc = subconverter;
        }
        
        let ed = '';
        if (edgetunnel === 'e2') {
            ed = "E2";
        } else {
            ed = "B站";
        }

        const sub = {
            v: "2",
            ps: `Your_Server_${ed}`, //显示在软件中的服务器别名
            add: host, //IP或者域名
            port: "443", //端口
            id: uuid, //uuid，必填
            aid: "2", //流控等级，0-255，一般为2
            net: protocol, //默认为"tcp"
            type: "none", //默认为"none"
            host: "", //host，可填，一般不填
            path: path, //路径，可填，一般不填
            tls: "tls", //默认为"none"
            sni: "", //sni，可填，一般不填
            version: "2",
            class: "Intranet", //等级
            ps: `Your_Server_${ed}`, //显示在软件中的服务器别名
            plugin: "",
            plugin_opts: "",
            cipher: "auto",
            udp: false,
        };

        const jsonSub = JSON.stringify(sub, null, 2);
    
        const responseText = `
            ${ed} - 订阅
            ---
            ${configLink}
            ${dlLink}
            ${subc}
            <details>
            <summary>Proxies</summary>
            ${proxies}
            </details>
            <details>
            <summary>ProxyHosts</summary>
            ${proxyHosts}
            </details>
            ---
            ${jsonSub}
            
            `;
    
        const response = new Response(responseText, {
            status: 200,
            headers: {
                'content-type': 'text/plain; charset=utf-8',
                'cache-control': 'no-cache, no-store, must-revalidate',
            },
        });
    
        return response;
    }
};
