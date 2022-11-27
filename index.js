const express = require('express')
const app = express()
const port = 3000
const unzip = require('unzip-stream')


app.get('/tp2', (req, res) => {
    const csv = require('csv-parser')
    const fs = require('fs')
    const results = [];
    const download = require('download');
    
    download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const fileName = entry.path;
            const type = entry.type;
            const size = entry.size;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    const transfertSiege = results.filter(result => result.transfertSiege == 'true')
                    const percentage = transfertSiege.length / results.length * 100
                    let x = percentage.toFixed(2)
                    res.send(`${x}% des compagnies ont transféré leur siège social depuis le 1er Novembre 2022`)
                } )
            } else {
                entry.autodrain();
            }
        });
})
})

app.listen(port, () => console.log(`TP Node est en marche sur ${port}!`))
