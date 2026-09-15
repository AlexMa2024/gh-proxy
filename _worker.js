export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1);
    if (!path) {
      return new Response(`gh-proxy<br/>Usage: ${url.origin}/https://github.com/xxx`, {
        status: 200,
        headers: { "content-type": "text/html;charset=utf-8" }
      });
    }
    let targetUrl;
    try {
      targetUrl = new URL(path);
    } catch (e) {
      return new Response("Invalid url", { status: 400 });
    }
    const newReq = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow"
    });
    const res = await fetch(newReq);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });
  }
};
