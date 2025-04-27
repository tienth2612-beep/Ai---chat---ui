const fs = require('fs-extra');
const path = require('path');

// Nội dung file _redirects
const redirectsContent = '/*    /index.html   200\n';

// Vị trí tạo file
const redirectsPath = path.join(__dirname, '..', '..', 'out', '_redirects');

// Ghi file vào thư mục /out
fs.outputFileSync(redirectsPath, redirectsContent);

console.log('✅ _redirects file created at', redirectsPath);
