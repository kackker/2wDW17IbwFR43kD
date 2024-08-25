document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();  // ป้องกันการรีเฟรชหน้าหลังจากกดปุ่ม Submit

    var inputPassword = document.getElementById('password').value;
    var hashedInputPassword = CryptoJS.SHA256(inputPassword).toString();

    // ส่งรหัสผ่านไปยัง Google Apps Script เพื่อยืนยัน
    fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `password=${hashedInputPassword}`
    })
    .then(response => response.text())
    .then(encodedIframeUrl => {
        if (encodedIframeUrl === 'Invalid Password') {
            alert("รหัสผ่านไม่ถูกต้อง!");
        } else {
            document.querySelector('.login-container').style.display = 'none';  // ซ่อนฟอร์มล็อกอิน
            document.getElementById('iframe-container').style.display = 'block';  // แสดง container ที่มี iframe และ loading

            // ถอดรหัส URL ที่ได้รับกลับมา
            var iframeUrl = CryptoJS.enc.Base64.parse(encodedIframeUrl).toString(CryptoJS.enc.Utf8);

            // แสดง iframe เมื่อโหลดเสร็จแล้ว
            var iframe = document.getElementById('iframe');
            iframe.src = iframeUrl;  // โหลด URL ของ iframe

            iframe.onload = function() {
                document.getElementById('loading').style.display = 'none';  // ซ่อน loading
                iframe.style.display = 'block';  // แสดง iframe
            };
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("เกิดข้อผิดพลาดขณะประมวลผลคำขอของคุณ.");
    });    
});



