function login() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  fetch('https://script.google.com/macros/s/AKfycbymITyEcnX2fWibMRJ9CYcEFQ1KWUlmpZsq99dYd1ep9SNLSMiRZy7SjNKyv37xt5CJiA/exec')
    .then(response => response.json())
    .then(data => {
      if (data[email] && data[email] === password) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('iframeContainer').style.display = 'block';
        document.getElementById('myIframe').src = 'https://script.google.com/macros/s/AKfycbxyO3HlSpCmKu6aVi1MCw7ebAp_EazzhQvKCSz57XqJKg5l4UbZybLbfLoQQqk3DobR/exec';
      } else {
        alert('Invalid email or password');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred');
    });
}
