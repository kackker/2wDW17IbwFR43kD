document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault(); // ป้องกันการส่งฟอร์ม

        var inputPassword = document.getElementById('password').value;
        var hashedInputPassword = CryptoJS.SHA256(inputPassword).toString(CryptoJS.enc.Hex);

        fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
            .then(response => response.json())
            .then(data => {
                var valid = false;
                var doubleEncodedIframeUrl = '';
                var decryptionKey = '';

                for (var i = 0; i < data.length; i++) {
                    var storedHashedPassword = CryptoJS.SHA256(data[i].password).toString(CryptoJS.enc.Hex);
                    doubleEncodedIframeUrl = data[i].iframeUrl;
                    decryptionKey = data[i].key;

                    if (hashedInputPassword === storedHashedPassword) {
                        valid = true;
                        break;
                    }
                }

                if (valid) {
                    document.querySelector('.login-container').style.display = 'none';
                    document.getElementById('iframe-container').style.display = 'block';

                    // ถอดรหัส URL ของ iframe
                    // Decode base64 first
                    var intermediateDecodedUrl = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(doubleEncodedIframeUrl));
                    // Decode base64 again
                    var decryptedIframeUrl = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(intermediateDecodedUrl));

                    var iframe = document.getElementById('iframe');
                    iframe.src = decryptedIframeUrl;

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
});
