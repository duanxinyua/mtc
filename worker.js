let phone;
let wxpusherAppToken;
let wxpusherUIDs;

export default {
    async fetch(request, env, ctx) {
        try {
            phone = env.PHONE_NUMBER;
            wxpusherAppToken = env.WXAPPTOKEN;
            wxpusherUIDs = env.WXPUSHER_UIDS;

            // 判断请求的路径
            const url = new URL(request.url);
            if (url.pathname === '/sendNotification') {
                return await handleNotificationRequest(request, env);
            } else {
                return handleHtmlPage();
            }

        } catch (err) {
            console.error("Error:", err);
            return new Response("服务器内部错误", { status: 500 });
        }
    },
};

async function handleNotificationRequest(request, env) {
    const body = await request.json();

    try {
        // 发送 Wxpusher 通知的请求
        const response = await fetch("https://wxpusher.zjiecode.com/api/send/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                appToken: wxpusherAppToken,
                content: "您好，有人需要您挪车，请及时处理。",
                contentType: 1,
                uids: wxpusherUIDs,
            }),
        });

        const data = await response.json();

        if (data.code === 1000) {
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" },
            });
        } else {
            return new Response(
                JSON.stringify({ success: false, message: data.message || "通知发送失败" }),
                { headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error("发送通知失败:", error);
        return new Response(
            JSON.stringify({ success: false, message: "网络错误，请稍后再试" }),
            { headers: { "Content-Type": "application/json" } }
        );
    }
}

function handleHtmlPage() {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>挪车</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0f2f5; color: #333; }
                    .container { text-align: center; padding: 20px; width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); background: #fff; }
                    h1 { font-size: 24px; margin-bottom: 20px; color: #007bff; }
                    p { margin-bottom: 20px; font-size: 16px; color: #555; }
                    button { 
                        width: 100%; 
                        padding: 15px; 
                        margin: 10px 0; 
                        font-size: 18px; 
                        font-weight: bold; 
                        color: #fff; 
                        border: none; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        transition: background 0.3s; 
                    }
                    .notify-btn { background: #28a745; }
                    .notify-btn:hover { background: #218838; }
                    .call-btn { background: #17a2b8; }
                    .call-btn:hover { background: #138496; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>挪车</h1>
                    <p>如需通知车主，请点击以下按钮</p>
                    <button class="notify-btn" onclick="notifyOwner()">微信通知车主挪车</button>
                    <button class="call-btn" onclick="callOwner()">拨打车主电话</button>
                </div>

                <script>
                    function notifyOwner() {
                        const notifyButton = document.querySelector('.notify-btn');  // 获取按钮
                        notifyButton.disabled = true;  // 禁用按钮
                        notifyButton.innerText = "通知发送中...";  // 更改按钮文本，提示用户
                      
                        fetch("/sendNotification", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({})
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert("通知已发送！");
                            } else {
                                alert(\`通知发送失败: \${data.message || '请稍后重试'}\`);
                                console.error('发送失败的详细信息:', data);
                            }
                        })
                        .catch(error => {
                            console.error("发送失败，错误原因:", error);
                            alert("通知发送出错，请检查网络连接。");
                        })
                        .finally(() => {
                            // 请求完成后恢复按钮状态
                            notifyButton.disabled = false;
                            notifyButton.innerText = "微信通知车主挪车";  // 恢复按钮文本
                        });
                    }

                    function callOwner() {
                        window.location.href = "tel:${phone}";
                    }
                </script>
                
            </body>
        </html>
    `;
    return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
}
