(function(){
  const form = document.getElementById('verify-form');
  const input = document.getElementById('cert-id');
  const result = document.getElementById('result');
  const button = document.getElementById('verify-btn');

  // Set your backend base endpoint here (no trailing slash).
  // Example: const API_ENDPOINT = 'https://api.example.com/certificates';
  const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz-9LvVbU2Ek-wGfZu_HKQwTgAzDtwTjpf7UzOE_gAMqUaYJDBiv6mpNlwJLDbhf2Kj/exec';

  function isValidId(id) {
    return /^[a-zA-Z0-9]{6}$/.test(id);
  }

  function showMessage(html, isError){
    const bgColor = isError ? '#fee' : 'transparent';
    const textColor = isError ? '#000' : '#065f46';
    const icon = isError ? '&#9888; ' : '';
    result.innerHTML = `<p style="color:${textColor}; background:${bgColor}; padding:10px; border-radius:8px;">${icon}${html}</p>`;
  }

  async function verify(id){
    showMessage('Please wait while we search for your certificate...', false);
    button.disabled = true;
    try{
      const res = await fetch(`${API_ENDPOINT}?certId=${encodeURIComponent(id)}`, {method:'GET'});
      const text = await res.json();

      if(text.status === 'success'){
        window.open(text.certificatePdfUrl, '_blank');
        showMessage('Certificate found. <a href="' + text.certificatePdfUrl + '" target="_blank">Click here to download.</a>', false);
      } else {
        showMessage('Certificate not found. Please try again with a valid certificate ID.', true);
      }

    }catch(err){
      showMessage('Verification failed. See console for details.', true);
      console.error(err);
    } finally {
      button.disabled = false;
    }
  }

  // Check for URL parameter on page load
  const urlParams = new URLSearchParams(window.location.search);
  const certIdParam = urlParams.get('certId');
  if(certIdParam){
    input.value = certIdParam;
    verify(certIdParam);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const id = input.value.trim();
    if(!id){ showMessage('Please enter a Certificate ID.', true); return; }
    if(!isValidId(id)){ showMessage('Invalid Certificate ID. The certificate ID should be 6 numbers or letters, for example ABC12Z. Please try again.', true); return; }
    verify(id);
  });
})();
