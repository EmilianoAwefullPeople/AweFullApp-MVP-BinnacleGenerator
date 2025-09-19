document.addEventListener('DOMContentLoaded', () => {
    const descriptionInput = document.getElementById('descriptionInput');
    const charCounter = document.querySelector('.char-counter');
    const placeInput = document.getElementById('placeInput');
    const imageUpload = document.getElementById('imageUpload');
    const imageUploadLabel = document.querySelector('.image-upload-label');
    const createButton = document.querySelector('.create-button');
    const loadingDiv = document.createElement('div'); // Create loading div dynamically
    loadingDiv.id = 'loading';
    loadingDiv.style.display = 'none';
    loadingDiv.textContent = 'Crafting Your Awe Binnacle…';
    document.body.appendChild(loadingDiv);
    const outputDiv = document.createElement('div'); // Create output div dynamically
    outputDiv.id = 'binnacle-output';
    outputDiv.style.display = 'none';
    document.body.appendChild(outputDiv);

    // Character counter functionality
    descriptionInput.addEventListener('input', () => {
        const currentLength = descriptionInput.value.length;
        charCounter.textContent = `${currentLength}/200`;
        
        // Update styles based on character count
        if (currentLength > 150) {
            charCounter.style.color = '#ff4757';
        } else if (currentLength > 100) {
            charCounter.style.color = '#ff8c00';
        } else {
            charCounter.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    });

    // Image upload handling
    imageUploadLabel.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // For now, update label to indicate selection (thumbnail could be added later)
                const fileName = file.name;
                const fileSize = (file.size / 1024).toFixed(1) + ' KB';
                // Placeholder for visual feedback (e.g., thumbnail or text update)
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Create Binnacle button click handler with backend integration
    createButton.addEventListener('click', () => {
        const place = placeInput.value.trim();
        const description = descriptionInput.value.trim();
        const imageFile = imageUpload.files[0];

        // Validate required fields
        if (!place) {
            alert('Please enter a place/city/country');
            return;
        }
        
        if (!description) {
            alert('Please enter a description');
            return;
        }
        
        if (!imageFile) {
            alert('Please add a picture');
            return;
        }

        // Show loading
        loadingDiv.style.display = 'block';
        outputDiv.style.display = 'none';

        // Prepare FormData for fetch
        const formData = new FormData();
        formData.append('place', place);
        formData.append('description', description);
        formData.append('image', imageFile);

        // Fetch to backend
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
