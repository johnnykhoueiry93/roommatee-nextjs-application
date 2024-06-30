const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const Client = require('ssh2-sftp-client');

const outputFilePath = path.join(__dirname, '../next.zip');
console.log('Resolved output file path:', outputFilePath);

const output = fs.createWriteStream(outputFilePath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

// output.on('close', async function() {
//   console.log(archive.pointer() + ' total bytes');
//   console.log('next.zip has been created successfully.');

//   console.log('SFTP upload started...');

//   // Perform SFTP upload after zipping
//   const sftp = new Client();
//   try {
//     await sftp.connect({
//       host: "108.181.201.115",
//       port: 22,
//       username: "administrator",
//       password: "6100Be@30",
//     });

//     await sftp.put(outputFilePath, '/home/administrator/next.zip');
//     console.log('SFTP upload completed successfully.');
//   } catch (err) {
//     console.error('SFTP upload failed:', err);
//   } finally {
//     sftp.end();
//   }
// });

output.on('end', function() {
  console.log('Data has been drained');
});

archive.on('warning', function(err) {
  if (err.code !== 'ENOENT') {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.directory('.next', '.next');

archive.finalize();
