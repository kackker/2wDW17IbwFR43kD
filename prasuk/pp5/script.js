document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const sheetURL = 'https://docs.google.com/spreadsheets/d/13H5PsR9twS63oYbn8udQ1mB1Y-rUNvdz-fiywRTjgGY/export?format=csv'; // ใส่ URL ของ Google Sheets ในรูปแบบ CSV

    try {
        // ดึงข้อมูลรหัสผ่านจาก Google Sheets
        const response = await fetch(sheetURL);
        const data = await response.text();

        // แยกแถวและเซลล์จาก CSV
        const rows = data.split('\n');
        const cellValue = rows[0].split(',')[0]; // อ่านค่าจากเซลล์ A1

        if (password === cellValue) {
            // แสดง iframe ถ้ารหัสผ่านถูกต้อง
            document.getElementById('content-frame').src = 'https://script.google.com/macros/s/AKfycbxyO3HlSpCmKu6aVi1MCw7ebAp_EazzhQvKCSz57XqJKg5l4UbZybLbfLoQQqk3DobR/exec'; // ใส่ URL ของ iframe ที่ต้องการแสดง
            document.getElementById('content-frame').style.display = 'block';
            document.getElementById('login-container').style.display = 'none';
        } else {
            errorMessage.textContent = 'Invalid password. Please try again.';
        }
    } catch (error) {
        errorMessage.textContent = 'Error accessing Google Sheets. Please try again later.';
    }
});
