document.getElementById('submit').addEventListener('click', function() {
    let itemName = document.getElementById('itemName').value.trim();
    let itemDescription = document.getElementById('itemDescription').value.trim();
    let itemPrice = document.getElementById('itemPrice').value.trim();
  
    if (!itemName || !itemPrice) {
      alert('Please fill all required fields correctly.');
      return;
    }
  
    localStorage.setItem('itemName', itemName);
    localStorage.setItem('itemDescription', itemDescription);
    localStorage.setItem('itemPrice', Price: ${itemPrice} );
  
    alert('Product saved successfully!');
  });