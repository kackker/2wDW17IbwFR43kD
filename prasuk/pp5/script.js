document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();  // ป้องกันการรีเฟรชหน้าหลังจากกดปุ่ม Submit

    var inputPassword = document.getElementById('password').value;

    // ดึงข้อมูลจาก Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
        .then(response => response.json())
        .then(data => {
            var encodedPassword = data.password;
            var decodedPassword = atob(encodedPassword);  // ถอดรหัส Base64

            // ตรวจสอบรหัสผ่าน
            if (inputPassword === decodedPassword) {
                alert("เข้าระบบ สำเร็จแล้ว! กรุณากด OK!");
                document.querySelector('.login-container').style.display = 'none';  // ซ่อนฟอร์มล็อกอิน
                document.getElementById('iframe-container').style.display = 'block';  // แสดง iframe
            } else {
                alert("รหัสผ่านไม่ถูกต้อง!");  // แจ้งเตือนหากรหัสผ่านไม่ถูกต้อง
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while processing your request.");
        });
});
