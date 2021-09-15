import './App.css';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import Encoding from 'encoding-japanese';

function App() {
  const [parsedCsvData, setParsedCsvData] = useState([]);

  const parseFile = file => {
    Papa.parse(file, {
      header: true,
      complete: results => {
        setParsedCsvData(results.data);
      },
    });
  };

  console.log(parsedCsvData);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const contents = new Uint8Array(reader.result);
        const encodingType = Encoding.detect(contents);

        const unicodeArray = Encoding.convert(contents, {
          to: 'UNICODE',
          from: encodingType,
        });

        const unicodeString = Encoding.codeToString(unicodeArray);
        const newFile = new File([unicodeString], 'prefectures.txt', {
          type: 'text/csv',
        });
        parseFile(newFile);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'text/csv',
  });

  return (
    <div className="App">
      <div
        {...getRootProps({
          className: `dropzone 
          ${isDragAccept && 'dropzoneAccept'} 
          ${isDragReject && 'dropzoneReject'}`,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Kanji</th>
            <th>Reading</th>
            <th>English</th>
          </tr>
        </thead>
        <tbody>
          {parsedCsvData &&
            parsedCsvData.map((parsedData, index) => (
              <tr key={index}>
                <td>{parsedData.Kanji}</td>
                <td>{parsedData.Reading}</td>
                <td>{parsedData.English}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
