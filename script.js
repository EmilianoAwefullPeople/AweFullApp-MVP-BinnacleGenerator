document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text');
    const charCount = document.getElementById('char-count');
    const placeInput = document.getElementById('place');
    const photoInput = document.getElementById('photo');
    const generateBtn = document.getElementById('generate-btn');
    const loadingDiv = document.getElementById('loading');
    const outputDiv = document.getElementById('binnacle-output');

    // Character counter
    textInput.addEventListener('input', () => {
        charCount.textContent = `${textInput.value.length}/200 characters`;
    });

    // Form submission
    generateBtn.addEventListener('click', () => {
        const place = placeInput.value.trim();
        const text = textInput.value.trim();
        const photos = photoInput.files;

        // Validation
        if (!place || (!text && photos.length === 0)) {
            alert('Please add a place and either text or photo');
            return;
        }

        // Show loading
        loadingDiv.style.display = 'block';
        outputDiv.style.display = 'none';

        // Prepare FormData for fetch
        const formData = new FormData();
        formData.append('place', place);
        formData.append('text', text);
        for (let i = 0; i < photos.length; i++) {
            formData.append('photos', photos[i]);
        }

        // Fetch to backend (placeholder URL)
        fetch('/api/generate-binnacle', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            outputDiv.textContent = data.binnacle;
            outputDiv.style.display = 'block';
            loadingDiv.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            loadingDiv.style.display = 'none';
            alert('Failed to generate binnacle. Check console for details.');
        });
    });
});
