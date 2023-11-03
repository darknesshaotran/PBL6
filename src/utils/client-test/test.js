const welcome = document.getElementById('welcome');
const btn = document.getElementById('btn');
const img = document.getElementsByTagName('img')[0];
const input = document.getElementById('input');
const list = document.getElementById('list');
var message = '';

function readTokenFromCookie() {
    const cookie = document.cookie;
    const tokenName = 'token=';
    const tokenStartIndex = cookie.indexOf(tokenName);
    if (tokenStartIndex === -1) {
        return null;
    }
    const tokenEndIndex = cookie.indexOf(';', tokenStartIndex + tokenName.length);
    const tokenValue = decodeURIComponent(
        cookie.substring(tokenStartIndex + tokenName.length, tokenEndIndex === -1 ? cookie.length : tokenEndIndex),
    );
    return tokenValue;
}
const token = readTokenFromCookie();

fetch('http://localhost:4000/api/user/profile/me', {
    headers: new Headers({
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
    }),
})
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        const socket = io('http://localhost:4000');

        // lắng nghe sự kiện kêt nối socket thất bại
        socket.on('connect_error', (error) => console.log(error.data));

        // lắng nghe sự kiện kết nối socket
        socket.on('connect', () => console.log('user connect'));
        // lắng nghe sự kiện nhận tin nhắn từ server của socket người gửi trả về
        socket.on('receive_message', (data) => {
            var message = list.innerHTML;

            message += `<li style="color:white;padding:10px;margin-bottom:5px;background:grey;border-radius:10px"> (${data.id_sender}): ${data.content}</li>`;

            list.innerHTML = message;
        });

        // tạo sự kiện khi ấn btn thì gửi sự kiện send_message đến server
        // server lắng nghe sự kiện send_message và gửi sự kiện receive_message đến socket người nhận
        const send_message = () => {
            socket.emit('send_message', {
                content: input.value,
                id_receiver: response.user.id == 2 ? 7 : 2,
            });
            var message = list.innerHTML;
            message += `<li style="color:white;padding:10px;margin-bottom:5px;background:blue;border-radius:10px"> (${response.user.id}): ${input.value}</li>`;

            list.innerHTML = message;
            input.value = '';
        };
        btn.onclick = send_message;
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                send_message();
            }
        });

        // console.log(response.user.inforUser);
        if (response.user.inforUser) {
            img.src = response.user.inforUser.avatar;
            welcome.innerText = `welcome ${response.user.inforUser.firstname} ${response.user.inforUser.lastname}`;
            socket.auth = {
                id: response.user.id,
            };
        }
    });
