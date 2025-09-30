
// StreamElements Chat Display Widget

window.addEventListener('onWidgetLoad', function (obj) {
    console.log("Chat widget loaded");

    // Get field data from StreamElements
    const fieldData = obj.detail.fieldData || {};
    console.log("Field data:", fieldData);

    // Initialize the chat widget
    const chatWidget = new ChatWidget(fieldData);

    // Make widget accessible globally for testing
    window.chatWidget = chatWidget;
});

class ChatWidget {
    constructor(fieldData) {
        this.fieldData = fieldData;
        this.chatContainer = document.getElementById('chat-container');
        this.maxMessages = parseInt(fieldData.maxMessages, 10) || 10;
        this.debugMode = fieldData.debugMode === "yes";
        this.showTimestamps = fieldData.showTimestamps === "yes";
        this.fadeOldMessages = fieldData.fadeOldMessages === "yes";

        console.log("ChatWidget initialized with field data:", this.fieldData);
        this.initializeChatEvents();

        // Add debug info
        if (this.debugMode) {
            this.addChatMessage("Debug", "Chat widget ready - listening for StreamElements events", "welcome");
        }
    }

    initializeChatEvents() {
        console.log("Initializing chat events...");

        // StreamElements event listener for chat messages
        window.addEventListener('onEventReceived', (obj) => {
            try {
                if (!obj.detail) return;

                const listener = obj.detail.listener;
                const data = obj.detail.event;

                console.log("Event listener:", listener, "Data:", data);

                // StreamElements sometimes sends "message" or "chat-message"
                if (listener !== "message" && listener !== "chat-message") return;

                // Extract chat message data
                const username = data.nick || data.displayName || data.name || "Unknown";
                const message = data.text || "No message";
                const tags = data.tags || {};
                const badges = tags.badges || "";

                console.log(`Chat message - User: ${username}, Message: ${message}, Badges: ${badges}`);

                // Determine user role
                let userRole = "viewer";
                if (badges) {
                    if (badges.includes("broadcaster")) {
                        userRole = "broadcaster";
                    } else if (badges.includes("moderator")) {
                        userRole = "moderator";
                    } else if (badges.includes("vip")) {
                        userRole = "vip";
                    } else if (badges.includes("subscriber")) {
                        userRole = "subscriber";
                    }
                }

                this.addChatMessage(username, message, userRole);

            } catch (error) {
                console.error("Error handling chat message:", error);
                console.error("Event object:", obj);
            }
        });

        console.log("Chat events initialized");
    }

    addChatMessage(username, message, role = "viewer") {
        if (!this.chatContainer) return;

        // Create message element
        const messageElement = document.createElement("div");
        messageElement.className = `chat-message ${role}`;

        let timestampHtml = "";
        if (this.showTimestamps) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            timestampHtml = `<span class="timestamp">[${timeStr}]</span> `;
        }

        messageElement.innerHTML = `
            ${timestampHtml}
            <span class="username">${this.escapeHtml(username)}:</span>
            <span class="message">${this.escapeHtml(message)}</span>
        `;

        // Add to chat container
        this.chatContainer.appendChild(messageElement);

        // Remove old messages if limit exceeded
        const messages = this.chatContainer.querySelectorAll(".chat-message");
        if (messages.length > this.maxMessages) {
            this.removeOldestMessage();
        }

        // Auto-scroll
        this.scrollToBottom();

        console.log(`Added message from ${username}: ${message}`);
    }

    removeOldestMessage() {
        const messages = this.chatContainer.querySelectorAll(".chat-message");
        if (messages.length > 0) {
            const oldestMessage = messages[0];
            if (oldestMessage) {
                if (this.fadeOldMessages) {
                    oldestMessage.classList.add("fade-out");
                    setTimeout(() => {
                        if (oldestMessage.parentNode) {
                            oldestMessage.parentNode.removeChild(oldestMessage);
                        }
                    }, 300);
                } else {
                    oldestMessage.remove();
                }
            }
        }
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // Test function to simulate chat messages
    testMessage(username = "TestUser", message = "This is a test message!", role = "viewer") {
        const mockEvent = {
            detail: {
                listener: "chat-message",
                event: {
                    nick: username,
                    displayName: username,
                    text: message,
                    tags: {
                        badges: role === "viewer" ? "" : `${role}/1`,
                        "display-name": username,
                        color: "#641FEF"
                    },
                    time: Date.now(),
                    userId: Math.random().toString(36).substr(2, 9),
                    channel: "testchannel",
                    isAction: false
                }
            }
        };

        console.log("Dispatching test event:", mockEvent);
        const event = new CustomEvent("onEventReceived", mockEvent);
        window.dispatchEvent(event);
    }
}
