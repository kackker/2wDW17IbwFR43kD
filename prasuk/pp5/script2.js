document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault(); // ป้องกันการส่งฟอร์ม

        var inputPassword = document.getElementById('password').value;
        var hashedInputPassword = CryptoJS.SHA256(inputPassword).toString(CryptoJS.enc.Hex);

        fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
            .then(response => response.json())
            .then(data => {
                var valid = false;
                var iframeUrl = '';
                var decryptionKey = '';

                for (var i = 0; i < data.length; i++) {
                    var storedHashedPassword = data[i].password;
                    var storedEncryptedIframeUrl = data[i].iframeUrl;
                    var storedDecryptionKey = data[i].decryptionKey;

                    if (hashedInputPassword === storedHashedPassword) {
                        valid = true;
                        iframeUrl = storedEncryptedIframeUrl;
                        decryptionKey = storedDecryptionKey;
                        break;
                    }
                }

                if (valid) {
                    document.querySelector('.login-container').style.display = 'none';
                    document.getElementById('iframe-container').style.display = 'block';

                    var decryptedIframeUrl = CryptoJS.AES.decrypt(iframeUrl, decryptionKey).toString(CryptoJS.enc.Utf8);

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
