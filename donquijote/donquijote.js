const fs = require('fs');
const natural = require('natural');
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();
const PDFParser = require('pdf-parse');

const pdfFilePath = 'Don_Quijote_de_la_Mancha-Cervantes_Miguel.pdf';

const contarPalabrasEnPDF = async () => {
  try {
    const dataBuffer = fs.readFileSync(pdfFilePath);
    const data = await PDFParser(dataBuffer);
    let textoPDF = data.text;
    textoPDF = textoPDF.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/[0-9]/g, '').replace(/\s{2,}/g," ");
    const palabras = textoPDF.split(/\s+/);
    tfidf.addDocument(textoPDF);
    const recuentoPalabras = {};

    palabras.forEach(palabra => {
      palabra = palabra.trim();
      if (palabra !== '') {
        if (recuentoPalabras[palabra]) {
          recuentoPalabras[palabra]++;
        } else {
          recuentoPalabras[palabra] = 1;
        }
      }
    });

    const palabrasOrdenadas = Object.keys(recuentoPalabras).sort((a, b) => recuentoPalabras[b] - recuentoPalabras[a]);

    console.log('Palabras más repetidas y su puntuación TF-IDF:');
    for (let i = 0; i < 7000 && i < palabrasOrdenadas.length; i++) {
      const palabra = palabrasOrdenadas[i];
      console.log(`${palabra}: ${recuentoPalabras[palabra]} veces, puntuación TF-IDF: ${tfidf.tfidf(palabra, 0)}`);
    }


    const totalPalabras = palabras.length;
    console.log(`Total de palabras en el PDF: ${totalPalabras}`);
  } catch (error) {
    console.error('Error al contar las palabras en el PDF:', error);
  }
};

contarPalabrasEnPDF();