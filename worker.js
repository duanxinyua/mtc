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
                :root {
                    --primary-color: #4776E6;
                    --secondary-color: #8E54E9;
                    --text-color: #2c3e50;
                    --shadow-color: rgba(0, 0, 0, 0.1);
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: var(--text-color);
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    text-align: center;
                    padding: 20px 30px;
                    width: 100%;
                    max-width: 450px;
                    border-radius: 24px;
                    box-shadow: 0 10px 40px var(--shadow-color);
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    transform: translateY(0);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .container:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
                }
                h1 {
                    font-size: 32px;
                    margin-bottom: 25px;
                    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 700;
                }
                .car-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    display: inline-block;
                    animation: float 6s ease-in-out infinite;
                }
                p {
                    margin-bottom: 20px;
                    font-size: 12px;
                    color: #546e7a;
                    line-height: 1.3;
                }
                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                button {
                    width: 100%;
                    padding: 16px 24px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #fff;
                    border: none;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                button:active {
                    transform: scale(0.98);
                }
                .notify-btn {
                    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                    box-shadow: 0 4px 15px rgba(71, 118, 230, 0.2);
                }
                .notify-btn:hover {
                    box-shadow: 0 6px 20px rgba(71, 118, 230, 0.3);
                    transform: translateY(-2px);
                }
                .call-btn {
                    background: linear-gradient(45deg, #00b09b, #96c93d);
                    box-shadow: 0 4px 15px rgba(0, 176, 155, 0.2);
                }
                .call-btn:hover {
                    box-shadow: 0 6px 20px rgba(0, 176, 155, 0.3);
                    transform: translateY(-2px);
                }
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .toast {
                    position: fixed;
                    top: 30%;  /* 垂直居中 */
                    left: 50%; /* 水平居中 */
                    transform: translate(-50%, -50%); /* 调整自身大小使其完美居中 */
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 24px;
                    border-radius: 20px;
                    font-size: 14px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .toast.show {
                    opacity: 1;
                }
                /* 整体车牌的样式 */
                .license-plate {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Arial', sans-serif;
                    background-color: #F0F0F0;
                    border-radius: 8px;
                    padding: 5px 15px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                /* 省份字符 */
                .province {
                    font-size: 32px;
                    font-weight: bold;
                    color: #D64B16;
                    margin-right: 5px;
                }
                /* 字母部分 */
                .letter {
                    font-size: 32px;
                    font-weight: bold;
                    color: #5C5C5C;
                    margin-right: 5px;
                }
                /* 数字部分 */
                .numbers {
                    font-size: 32px;
                    font-weight: bold;
                    color: #1E90FF;
                    letter-spacing: 2px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <div class="car-icon">&#128663;</div>
                <div class="license-plate">
                    <span class="province">津</span>
                    <span class="letter">A</span>
                    <span class="numbers">162V2</span>
                </div>
                <p>请通过以下方式联系我，我会立即前来处理</p>
                <div class="button-group">
                    <button class="notify-btn" onclick="notifyOwner()">
                    <span>微信通知挪车</span> &#128663;
                    </button>
                    <button class="call-btn" onclick="callOwner()">
                    <span>拨打电话联系</span> &#128222;
                    </button>
                </div>
                </div>
                <div id="toast" class="toast"></div>

                <script>
                function notifyOwner() {
                    const notifyButton = document.querySelector('.notify-btn');
                    notifyButton.disabled = true;
                    notifyButton.innerText = "通知发送中...";
            
                    // 启动1分钟倒计时，更新按钮显示
                    let countdown = 60;
                    const countdownInterval = setInterval(() => {
                        notifyButton.innerText = "微信通知车主挪车(" + countdown + "s)";
                        countdown--;
                        if (countdown < 0) {
                            clearInterval(countdownInterval); // 倒计时结束，恢复按钮
                            notifyButton.innerText = "微信通知车主挪车";
                            notifyButton.disabled = false;
                        }
                    }, 1000);
            
                    // 发送通知请求
                    fetch("/sendNotification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({})
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showNotification("通知已发送！");
                        } else {
                            showNotification("通知发送失败: " + (data.message || '请稍后重试'));
                            console.error('发送失败的详细信息:', data);
                        }
                    })
                    .catch(error => {
                        console.error("发送失败，错误原因:", error);
                        showNotification("通知发送出错，请检查网络连接。");
                    })
                    .finally(() => {
                        // 请求完成后不需要立即恢复按钮文本，因为已在倒计时中处理
                    });
                }
            
                function callOwner() {
                    window.location.href = "tel:${phone}";
                }
            
                function showNotification(message, duration = 5000) {
                    const toast = document.getElementById('toast');
                    toast.textContent = message;
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, duration);
                }
            </script>
            </body>
        </html>
    `;
    return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
}
