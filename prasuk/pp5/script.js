document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();  // ป้องกันการรีเฟรชหน้าหลังจากกดปุ่ม Submit

    var inputPassword = document.getElementById('password').value;

    // ดึงข้อมูลจาก Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
        
        .then(response => response.json())
        .then(data => {
            var sheetPassword = data.password;

            // ตรวจสอบรหัสผ่าน
            if(inputPassword === sheetPassword) {
                alert("Login successful!");
                document.querySelector('.login-container').style.display = 'none';  // ซ่อนฟอร์มล็อกอิน
                document.getElementById('iframe-container').style.display = 'block';  // แสดง iframe
            } else {
                 alert("Login successful!");
                document.querySelector('.login-container').style.display = 'none';  // ซ่อนฟอร์มล็อกอิน
                document.getElementById('iframe-container').style.display = 'block';  // แสดง iframe
            }
        })
        .catch(error => console.error('Error:', error));
});
