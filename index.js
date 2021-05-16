const csv = require ('csv-parser');
const fs = require ('fs');
const axios = require ('axios');

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
        const url = buildTranslationURL (addresses [0].meta_value)
        const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

readAddressFile ();