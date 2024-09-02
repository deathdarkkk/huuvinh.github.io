document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'x')) {
        e.preventDefault();
    }
});

document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        e.preventDefault(); 
        window.location.href = 'https://www.facebook.com/profile.php?id=61563438726293&mibextid=ZbWKwL'; 
    }
});
