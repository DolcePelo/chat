const socket = io();
let user = "";

Swal.fire({
    title: "Inicia sesion!",
    text: "Ingresa tu nombre de usuario",
    input: "text",
    confirmButtonText: "Cool",
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return "Por favor ingresa un nombre"
        }
    },
}).then((result) => {
    if (result.value) {
        user = result.value;

        socket.emit("new-user", { user: user, id: socket.id });
    }
});

socket.on("new-user-connected", (data) => {
    if (data.id !== socket.id) {
        Swal.fire({
            text: `${data.user} se conectó al chat`,
            toast: true,
            position: "top-end",
        });
    };
})

let chatBox = document.getElementById("chatBox");

chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        console.log("estoy por acá");
        console.log(chatBox.value);
        socket.emit("message", {
            user,
            message: chatBox.value,
            isUser: true,
        });
        chatBox.value = "";
    }
});


socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let message = "";

    data.forEach((elem) => {
        const isUserMessage = elem.id === socket.id ? "user-message" : "";

        message += `
        <div class="chat-message ${isUserMessage}">
        <div class="message-bubble">
            <div class="message-sender" >${elem.user}</div>
            <span">${elem.date}</span>

            <p>${elem.message}</p>
        </div>
        </div>
        `;
    });

    log.innerHTML = message;
});

function firstLoad() {
    fetch("/messages")
        .then((res) => res.json())
        .then((data) => {
            let log = document.getElementById("messageLogs");
            let message = "";

            data.forEach((elem) => {
                message += `

                <div class="chat-message">
                <div class="message-bubble">
                
                    <div class="message-sender" >${elem.user}</div>
                    <span>${elem.date}</span>
                    <p>${elem.message}</p>
                    </div>
                </div>
                `;
            });

            log.innerHTML = message;
        });
}

firstLoad();