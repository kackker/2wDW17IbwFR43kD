document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const iframeContainer = document.getElementById('iframe-container');
    const myIframe = document.getElementById('myIframe');

    // เปลี่ยนรหัสผ่านนี้ให้เป็นรหัสผ่านที่ต้องการ
    const correctPassword = 'your_password_here'; 

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const password = document.getElementById('password').value;

        if (password === correctPassword) {
            iframeContainer.style.display = 'block';
            myIframe.src = 'https://script.google.com/macros/s/AKfycbxyO3HlSpCmKu6aVi1MCw7ebAp_EazzhQvKCSz57XqJKg5l4UbZybLbfLoQQqk3DobR/exec'; // ใส่ URL ของ iframe ที่คุณต้องการแสดง
        } else {
            alert('รหัสผ่านไม่ถูกต้อง!');
        }
    });
});
