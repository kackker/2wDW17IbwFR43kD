document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();  // ป้องกันการรีเฟรชหน้าหลังจากกดปุ่ม Submit

    var inputPassword = document.getElementById('password').value;
    var hashedInputPassword = CryptoJS.SHA256(inputPassword).toString();

    // ดึงข้อมูลจาก Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
        .then(response => response.json())
        .then(data => {
            var valid = false;
            var iframeUrl = '';

            // ตรวจสอบรหัสผ่าน
            for (var i = 0; i < data.length; i++) {
                var storedHashedPassword = data[i].password;
                var storedEncodedIframeUrl = data[i].iframeUrl;

                if (hashedInputPassword === storedHashedPassword) {
                    valid = true;
                    iframeUrl = CryptoJS.enc.Base64.parse(storedEncodedIframeUrl).toString(CryptoJS.enc.Utf8);
                    break;
                }
            }

            if (valid) {
                document.querySelector('.login-container').style.display = 'none';  // ซ่อนฟอร์มล็อกอิน
                document.getElementById('iframe-container').style.display = 'block';  // แสดง iframe
                document.getElementById('iframe').src = iframeUrl;  // โหลด URL ของ iframe
            } else {
                alert("รหัสผ่านไม่ถูกต้อง!");  // แจ้งเตือนหากรหัสผ่านไม่ถูกต้อง
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while processing your request.");
        });
});
