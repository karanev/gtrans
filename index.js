const csv = require ('csv-parser');
const fs = require ('fs');
const axios = require ('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'translated.csv',
    header: [
        {id: 'original', title: 'original'},
        {id: 'translated', title: 'translated'}
    ]
});

const readAddressFile = () => {
    const addresses = [];
    fs.createReadStream('data.csv', 'utf-8')
        .pipe(csv())
        .on('data', (row) => {
            addresses.push (row);
        })
        .on('end', () => {
            translateAddresses (addresses);
        });
}

const buildTranslationURL = (sourceText) => {
    const sourceLang = 'auto';
    const targetLang = 'en'
    const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
        + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

    return url;
}

async function translateAddresses (addresses) {
    try {
        const sourceText = addresses [0].meta_value;
        const url = buildTranslationURL (sourceText)
        const response = await axios.get(url);
        const translatedText = response.data [0][0][0];
        const records = [
            { original: sourceText, translated: translatedText },
        ];
        await csvWriter.writeRecords(records)
            .then(() => {
                console.log('Done');
            });
    } catch (error) {
        console.error(error);
    }
}

readAddressFile ();