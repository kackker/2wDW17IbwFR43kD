/*document.getElementById('login-form').addEventListener('submit', function(e) {
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
                document.getElementById('iframe-container').style.display = 'block';  // แสดง container ที่มี iframe และ loading

                // แสดง iframe เมื่อโหลดเสร็จแล้ว
                var iframe = document.getElementById('iframe');
                iframe.src = iframeUrl;  // โหลด URL ของ iframe

                iframe.onload = function() {
                    document.getElementById('loading').style.display = 'none';  // ซ่อน loading
                    iframe.style.display = 'block';  // แสดง iframe
                };
            } else {
                alert("รหัสผ่านไม่ถูกต้อง!");  // แจ้งเตือนหากรหัสผ่านไม่ถูกต้อง
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("เกิดข้อผิดพลาดขณะประมวลผลคำขอของคุณ.");
        });    
});*/

var encryptionKeyForClient = 'client-encryption-key'; // กุญแจที่ใช้ในการถอดรหัส
var decryptionKeyForClient = 'client-decryption-key'; // กุญแจที่ใช้ในการเข้ารหัส

function decrypt(encryptedData) {
    return CryptoJS.AES.decrypt(encryptedData, decryptionKeyForClient).toString(CryptoJS.enc.Utf8);
}

// JavaScript ฟังก์ชันที่ทำงานร่วมกับ Google Apps Script
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    var inputPassword = document.getElementById('password').value;
    var hashedInputPassword = CryptoJS.SHA256(inputPassword).toString(CryptoJS.enc.Hex);

    fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
        .then(response => response.json())
        .then(data => {
            var valid = false;
            var iframeUrl = '';

            for (var i = 0; i < data.length; i++) {
                var storedHashedPassword = data[i].password;
                var storedEncryptedIframeUrl = data[i].iframeUrl;

                if (hashedInputPassword === storedHashedPassword) {
                    valid = true;

                    // ถอดรหัส URL
                    iframeUrl = decrypt(storedEncryptedIframeUrl);
                    break;
                }
            }

            if (valid) {
                document.querySelector('.login-container').style.display = 'none';
                document.getElementById('iframe-container').style.display = 'block';

                var iframe = document.getElementById('iframe');
                iframe.src = iframeUrl;

                iframe.onload = function() {
                    document.getElementById('loading').style.display = 'none';
                    iframe.style.display = 'block';
                };
            } else {
                alert("รหัสผ่านไม่ถูกต้อง!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("เกิดข้อผิดพลาดขณะประมวลผลคำขอของคุณ.");
        });
});

