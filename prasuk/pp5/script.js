document.addEventListener('DOMContentLoaded', function() {
    // ดึงข้อมูลจาก Google Sheets เพื่อแสดงตัวเลือกใน select
    fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
        .then(response => response.json())
        .then(data => {
            var select = document.getElementById('iframe-select');

            // เพิ่มตัวเลือกใน select
            data.forEach((item, index) => {
                var option = document.createElement('option');
                option.value = index; // ใช้ดัชนีเป็นค่าในการเลือก
                option.textContent = 'Iframe ' + (index + 1);
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while fetching the iframe options.");
        });
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();  // ป้องกันการรีเฟรชหน้าหลังจากกดปุ่ม Submit

    var selectedIndex = document.getElementById('iframe-select').value;
    var inputPassword = document.getElementById('password').value;
    var hashedInputPassword = CryptoJS.SHA256(inputPassword).toString();

    // ดึงข้อมูลจาก Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
        .then(response => response.json())
        .then(data => {
            var selectedItem = data[selectedIndex];
            var storedHashedPassword = selectedItem.password;
            var hashedIframeUrl = selectedItem.iframeUrl;

            // ตรวจสอบรหัสผ่าน
            if (hashedInputPassword === storedHashedPassword) {
                // ถอดรหัส URL ของ iframe (ถ้าจำเป็น)
                var iframeUrl = CryptoJS.enc.Hex.parse(hashedIframeUrl).toString(CryptoJS.enc.Utf8);
                
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
