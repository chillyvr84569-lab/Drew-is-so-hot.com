// ... existing code ...
card.onclick = () => {
    // Decode the URL on the fly to hide it from Securly's initial scan
    const decodedUrl = atob(item.url); 
    
    // Success hack: Open as a "blank" window to strip the referrer
    const win = window.open('about:blank', '_blank');
    win.document.write(`
        <title>Loading Resources...</title>
        <script>window.location.replace("${decodedUrl}#translate.google.com");</script>
    `);
    win.opener = null; 
};
