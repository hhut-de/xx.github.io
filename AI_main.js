// 高中情义主题交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取按钮元素
    const ctaButton = document.querySelector('.cta-button');
    
    // 留言墙相关元素
    const userNameInput = document.getElementById('userName');
    const messageInput = document.getElementById('messageInput');
    const submitButton = document.getElementById('submitMessage');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageCountElement = document.getElementById('messageCount');
    const charCountElement = document.getElementById('charCount');
    
    // 励志语录数组
    const inspirationalQuotes = [
        "青春是一场盛大的相遇，我们在最美的年华里相识相知",
        "那些一起奋斗的日子，是我们青春最珍贵的记忆",
        "同窗三载，情谊一生，这份纯真的友谊将永远珍藏",
        "在追梦的路上，有你们的陪伴，让青春更加精彩",
        "时光会老去，但我们的友谊永远年轻如初"
    ];
    
    // 初始化留言数据
    let messages = JSON.parse(localStorage.getItem('highSchoolMessages')) || [];
    let messageCount = messages.length;
    
    // 更新留言计数
    function updateMessageCount() {
        messageCountElement.textContent = messageCount;
    }
    
    // 更新字符计数
    function updateCharCount() {
        const count = messageInput.value.length;
        charCountElement.textContent = count;
        
        if (count > 180) {
            charCountElement.style.color = '#ff6b6b';
        } else if (count > 150) {
            charCountElement.style.color = '#ffa726';
        } else {
            charCountElement.style.color = '#666';
        }
    }
    
    // 显示所有留言
    function displayMessages() {
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="no-messages">还没有留言，快来写下第一条吧！</div>';
            return;
        }
        
        messagesContainer.innerHTML = '';
        messages.forEach((message, index) => {
            const messageElement = createMessageElement(message, index);
            messagesContainer.appendChild(messageElement);
        });
    }
    
    // 创建留言元素
    function createMessageElement(message, index) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-item';
        
        // 处理匿名显示
        const authorName = message.author ? message.author.trim() : '';
        const displayName = authorName || '匿名同学';
        const isAnonymous = !authorName;
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-author ${isAnonymous ? 'anonymous' : ''}">${displayName}</span>
                <span class="message-time">${formatTime(message.timestamp)}</span>
            </div>
            <div class="message-content">${message.content}</div>
            <div class="message-number">第${index + 1}条留言</div>
        `;
        return messageDiv;
    }
    
    // 格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // 验证姓名格式
    function validateName(name) {
        if (!name) return { isValid: true, name: '' };
        
        const trimmedName = name.trim();
        if (trimmedName.length > 20) {
            return { isValid: false, error: '姓名不能超过20个字符' };
        }
        
        // 检查是否包含特殊字符（允许中文、英文、数字和常见标点）
        const invalidChars = /[<>'"&\\]/;
        if (invalidChars.test(trimmedName)) {
            return { isValid: false, error: '姓名包含非法字符' };
        }
        
        return { isValid: true, name: trimmedName };
    }
    
    // 提交留言
    function submitMessage() {
        const content = messageInput.value.trim();
        const nameValidation = validateName(userNameInput.value);
        
        if (!nameValidation.isValid) {
            alert(nameValidation.error);
            return;
        }
        
        if (content === '') {
            alert('请输入留言内容');
            return;
        }
        
        if (content.length > 200) {
            alert('留言内容不能超过200个字符');
            return;
        }
        
        const newMessage = {
            author: nameValidation.name,
            content: content,
            timestamp: Date.now()
        };
        
        messages.unshift(newMessage); // 添加到开头，新的显示在前面
        messageCount = messages.length;
        
        // 保存到本地存储
        localStorage.setItem('highSchoolMessages', JSON.stringify(messages));
        
        // 更新界面
        updateMessageCount();
        displayMessages();
        
        // 清空输入框（保留姓名，方便连续留言）
        messageInput.value = '';
        updateCharCount();
        
        // 显示成功提示
        showSuccessMessage('留言发布成功！');
    }
    
    // 显示成功提示
    function showSuccessMessage(text) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideInRight 0.5s ease;
        `;
        successDiv.textContent = text;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 500);
        }, 3000);
    }
    
    // 按钮点击事件
    ctaButton.addEventListener('click', function() {
        // 随机选择一条励志语录
        const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
        
        // 创建或更新语录显示区域
        let quoteDisplay = document.querySelector('.quote-display');
        if (!quoteDisplay) {
            quoteDisplay = document.createElement('div');
            quoteDisplay.className = 'quote-display';
            quoteDisplay.style.cssText = `
                margin-top: 20px;
                padding: 15px;
                background: rgba(102, 126, 234, 0.1);
                border-radius: 10px;
                color: #667eea;
                font-style: italic;
                transition: all 0.3s ease;
            `;
            ctaButton.parentNode.appendChild(quoteDisplay);
        }
        
        // 添加淡入效果
        quoteDisplay.style.opacity = '0';
        quoteDisplay.textContent = `"${randomQuote}"`;
        
        setTimeout(() => {
            quoteDisplay.style.opacity = '1';
            quoteDisplay.style.transform = 'translateY(0)';
        }, 100);
        
        // 按钮点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // 留言墙事件监听
    messageInput.addEventListener('input', updateCharCount);
    
    submitButton.addEventListener('click', submitMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitMessage();
        }
    });
    
    // 姓名输入框回车提交
    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            messageInput.focus();
        }
    });
    
    // 初始化留言墙
    updateMessageCount();
    displayMessages();
    
    // 页面加载时的欢迎效果
    setTimeout(() => {
        document.querySelector('h1').style.opacity = '1';
        document.querySelector('h1').style.transform = 'translateY(0)';
    }, 200);
    
    // 滚动效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('header');
        parallax.style.transform = `translateY(${scrolled * 0.4}px)`;
    });
    
    // 添加打字机效果到标题
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // 页面加载完成后执行打字机效果
    window.addEventListener('load', function() {
        const title = document.querySelector('h1');
        const originalText = title.textContent;
        typeWriter(title, originalText, 150);
    });
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);