document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

  var password = document.getElementById('password').value;

  // Replace this URL with your Google Apps Script Web App URL
  var scriptUrl = 'https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec';

  fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.querySelector('.login-container').style.display = 'none';
      document.getElementById('contentFrame').style.display = 'block';
      document.getElementById('contentFrame').src = 'YOUR_IFRAME_SOURCE_URL';
    } else {
      document.getElementById('errorMessage').style.display = 'block';
    }
  })
  .catch(error => console.error('Error:', error));
});
