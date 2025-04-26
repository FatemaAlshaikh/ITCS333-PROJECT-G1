window.onload = function() {
    const selectedId = localStorage.getItem('selectedItem');
    fetch('items.json')
      .then(response => response.json())
      .then(data => {
        const item = data.find(i => i.id == selectedId);
        if (item) {
          document.getElementById('displayItemName').innerText = item.name;
          document.getElementById('displayItemDescription').innerText = item.description;
          document.getElementById('displayItemPrice').innerText = Price; {item.price} BD;
        }
      })
      .catch(() => {
        document.getElementById('displayItemName').innerText = "Item not found";
      });
  };
  
  