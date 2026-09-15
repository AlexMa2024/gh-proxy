export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // 提取用户要转发的目标地址
    const targetRaw = url.pathname.slice(1);
    if (!targetRaw.startsWith("https://")) {
      return new Response("gh-proxy\nUsage: /https://github.com/xxx", { status: 200 });
    }

    const targetUrl = new URL(targetRaw);
    // 白名单：仅允许这两个域名
    const allowHosts = ["github.com", "raw.githubusercontent.com"];
    if (!allowHosts.includes(targetUrl.hostname)) {
      return new Response("Blocked: domain not allowed", { status: 403 });
    }

    // 透传请求
    const newReq = new Request(targetRaw, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow"
    });
    const resp = await fetch(newReq);
    return resp;
  }
};
